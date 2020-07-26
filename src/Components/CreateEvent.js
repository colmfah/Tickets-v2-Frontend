import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Test from './Test'
import Nav from "./Nav";
import EventDetails from "./CreateEventComponents/EventDetails";
import RefundPolicy from './RefundPolicy'
import "react-datepicker/dist/react-datepicker.css";
import Map from './CreateEventComponents/Map'
import Image from './CreateEventComponents/Image'
import Tickets from './CreateEventComponents/Tickets'
import Geocode from "react-geocode"



class CreateEvent extends React.Component {

	constructor(){
	super()
	this.addTicket= this.addTicket.bind(this)
	this.changeTicketDetails= this.changeTicketDetails.bind(this)
	}


  state = {
	step: 1,
	showMap: false,
	currencyOptions: {
		'EUR': '€',
		'GBP': '£',
		dublin: 'EUR',
		cork: 'EUR',
		belfast : 'GBP',
		london: 'GBP',
		other: 'EUR'
	},
	userEvent: {
		image: '',
		region: '',
		lat: 53.34723555464459,
		lng: -6.258907671241786,
		title: "",
		venue: '',
		address1: '',
		address2: '',
		address3: '',
		address4: '',
		description: "",
		startDetails: "",
		endDetails: "",
		organiser: "",
		currency: "EUR",
		totalTicketsCreated: 1,
		ticketTypesEquivalent: '',
		eventPassword: '',
		tickets: [{
			ticketType: '',
			ticketTypeID: 1,
			price: '',
			numberOfTickets: '',
			startSelling: '',
			chargeForTicketsStatus: '',
			chargeForNoShows: '',
			stopSelling: '',
			startSellingTime: Date.now(),
			stopSellingTime: '',
			ticketDescription: '',
			hold: '',
			refunds: {optionSelected: 'excessDemand',
							refundUntil: '',
							howToResell: 'auction',
							resellAtSpecificPrice: '',
							minimumPrice: '',
						}
		}],
		globalRefundPolicy: true,
		globalRefundOptions: {optionSelected: 'excessDemand',
						refundUntil: '',
						howToResell: 'auction',
						resellAtSpecificPrice: '',
						minimumPrice: ''}
	},
	errors: {
		startDateInPast: false,
		eventEndsBeforeItBegins: false,
		startSellingAfterEventBegins: false,
		sellingTicketsWhenEventIsOver: false,
		sellingStopsBeforeStarts: false,
	},
    errorMsg: {
			startDateInPast: 'Event must begin in the future',
			eventEndsBeforeItBegins: 'Event must end after it starts',
			startSellingAfterEventBegins: 'You must start selling tickets before the event begins',
			sellingTicketsWhenEventIsOver: 'You cannot sell tickets after the event has ended',
			sellingStopsBeforeStarts: 'You cannot stop selling tickets before you have started selling them',
			waitingForTicketThatDoesntExistToSellOut: 'The ticket you have selected no longer exists'
	},
	onBlurFired: 0
	}




	componentDidMount() {

	}

	addTicket = (e) => {
		let userEvent = this.state.userEvent
		userEvent.tickets.push({
			chargeForTicketsStatus: '',
			chargeForNoShows: '',
			ticketType: '',
			ticketTypeID: userEvent.totalTicketsCreated + 1,
			price: '',
			numberOfTickets: '',
			sellWhenTicketNumberSoldOut: '',
			startSelling: '',
			stopSelling: '',
			startSellingTime: Date.now(),
			stopSellingTime: userEvent.endDetails,
			ticketDescription: '',
			hold: '',
			refunds: {optionSelected: 'excessDemand',
							refundUntil: '',
							howToResell: 'auction',
							resellAtSpecificPrice: '',
							minimumPrice: ''
							}
		}
		)
		userEvent.totalTicketsCreated += 1
		this.setState({ userEvent })
	}

	changeGlobalRefundPolicy = () => {
		let userEvent = this.state.userEvent
		userEvent.globalRefundPolicy = !userEvent.globalRefundPolicy
		this.setState({ userEvent })
	}

	createEvent = e => {
		e.preventDefault()

		let data = this.state.userEvent.image
		let eventData = this.state.userEvent
		axios.post(`${process.env.REACT_APP_API}/image`, data)
			.then(res => {
				axios.patch(`${process.env.REACT_APP_API}/events/${res.data._id}`, eventData)
				.then(res => {console.log(res)})
				.catch(err =>{console.log(err)})
				})

				.catch(err => {
				console.log("imgerr", err)
			})
	}

	changeField = (e, field, boolean) => {
		
		let userEvent = this.state.userEvent
		if (field === "image") {
			userEvent.image = new FormData()
			userEvent.image.append('file', e.target.files[0])
			this.setState({ userEvent })
		}else if (field === "startDetails" || field === "endDetails") {
	        userEvent[field] = e
		}else if(boolean){
			e.target.value === 'true' ? userEvent[field]=true : userEvent[field]=false			
		}else {
	      userEvent[field] = e.target.value;
	    }
	    this.setState({ userEvent })
	}//checked

	changeSellingTimes = (e, field1, ticketNumber, field2) => {

		let userEvent = this.state.userEvent


		userEvent.tickets[ticketNumber][field1] = e.target.value

		if(e.target.value === 'now'){
			userEvent.tickets[ticketNumber][field2] = Date.now()
		} else if(e.target.value === 'whenPreviousSoldOut'){
			userEvent.tickets[ticketNumber][field2] = ''
		} else if(e.target.value === 'eventBegins'){
			userEvent.tickets[ticketNumber][field2] = userEvent.startDetails
		} else if (e.target.value ==='eventEnds'){
			userEvent.tickets[ticketNumber][field2] = userEvent.endDetails
		}
		this.setState({ userEvent })
	}

	changeTicketDetails = (e, field, ticketNumber) => {

		let userEvent = this.state.userEvent

		if(field === 'price'){
			userEvent.globalRefundOptions.minimumAuctionPrice = this.highestPricedTicket()
		}
		if(e instanceof Date){
			userEvent.tickets[ticketNumber][field] = e
		}else {

			userEvent.tickets[ticketNumber][field] = e.target.value
		}
			this.setState({ userEvent })
	}

	deleteTicket = (e, ticketNumber) => {
		e.preventDefault()
		let userEvent = this.state.userEvent
		userEvent.tickets.splice(ticketNumber, 1)
		this.setState({ userEvent })
	}

	getLatLng = () => {
		let userEvent = this.state.userEvent
		Geocode.fromAddress(`${userEvent.venue}, ${userEvent.address1}, ${userEvent.address2}, ${userEvent.address3}, ${userEvent.address4}`).then(response => {
			const { lat, lng } = response.results[0].geometry.location;
			userEvent.lat = lat
			userEvent.lng = lng
			this.setState({ userEvent })
  		})
	}//checked

	getLatLngAfterDrag = (event) => {
		let userEvent = this.state.userEvent
		userEvent.lat = event.latLng.lat()
		userEvent.lng = event.latLng.lng()
		this.setState({ userEvent })
	}//checked

	getTicketNames = (chargeForTicketsStatus) => {

		if(chargeForTicketsStatus === 'chargeForTickets'){
			return this.state.userEvent.tickets.filter(e=>e.chargeForTicketsStatus==='chargeForTickets').map(e => e.ticketType)
		}else if(chargeForTicketsStatus === 'freeTickets'){
			return this.state.userEvent.tickets.filter(e=>e.chargeForTicketsStatus==='freeTickets').map(e => e.ticketType)	
		}


	}

	handleBooleanChange = (e, field) => {
		let userEvent = this.state.userEvent
		if (e.target.value ==='true'){
			userEvent.ticketTypesEquivalent = true
		} else if(e.target.value ==='false'){
			userEvent.ticketTypesEquivalent = false
		}
			   this.setState({ userEvent })
	}

	handleRefundChange = (e, field, i)=>{

		
		let userEvent = this.state.userEvent
		if (i === 'not relevant'){
			if(field === 'optionSelected' && e.target.value !== 'excessDemand'){
				userEvent.globalRefundOptions.howToResell = 'specific'
			}
			if(e instanceof Date){
				userEvent.globalRefundOptions[field] = e
			}else{
				userEvent.globalRefundOptions[field] = e.target.value
			}
		} else {
			if(field === 'optionSelected' && e.target.value !== 'excessDemand'){
				userEvent.tickets[i].refunds.howToResell = 'specific'
			}
			if(e instanceof Date){
				userEvent.tickets[i].refunds[field] = e
			}else{
				userEvent.tickets[i].refunds[field] = e.target.value
			}
		}
		this.setState({ userEvent })
	}

	highestPricedTicket = () => {
		return (this.state.userEvent.tickets.map(	(e,i) => {return e.price}	).sort((a, b) => (b-a))[0])
	}

	logout = () => {
		localStorage.removeItem("token")
		this.props.history.push({
			pathname: "/events"
		});
			}

	nextStep = () => {
		const {step} = this.state
		this.setState({step: step+1})
	}

	prevStep = () => {
		const {step} = this.state
		this.setState({step: step-1})
	}

	setDefaultstopSellingTime = (time) => {
	let userEvent = this.state.userEvent
	userEvent.tickets = userEvent.tickets.map(	(e,i) => {
		if (e.stopSelling === 'eventEnds'){
			e.stopSellingTime = Date.parse(time); return e}
			else if(e.stopSelling === 'eventBegins'){
				e.stopSellingTime = Date.parse(time); return e}
		}		)
			this.setState({ userEvent })
		}

	validTicketCheck = (e, i) => {
		let userEvent = this.state.userEvent
		console.log('e.target.value', e.target.value)
		console.log('i', i)
		if(e.target.value !== ''){
			userEvent.tickets[i].waitingForTicketThatDoesntExistToSellOut = false
		}
		this.setState({ userEvent })
		}




  render() {
	  const { step } = this.state
	  const{ title, description, region, venue, address1, address2, address3, address4, startDetails, endDetails, currency, eventPassword, image, ticketTypesEquivalent, tickets } = this.state.userEvent
	  const values = { title, description, region, venue, address1, address2, address3, address4, startDetails, endDetails, currency, eventPassword, image, ticketTypesEquivalent, tickets }

	  switch(step){
		  case 1:
			return(
				<EventDetails 
					nextStep={this.nextStep}
					changeField={this.changeField}
					values={values}
					getLatLng = {this.getLatLng}
				/>
			)
			case 2: return(
				<Map
					google={this.props.google}
					center={{lat: this.state.userEvent.lat, lng: this.state.userEvent.lng}}
					height='300px'
					zoom={15}
					getLatLngAfterDrag={this.getLatLngAfterDrag}
					nextStep={this.nextStep}
					prevStep={this.prevStep}
				/>
			)
			case 3:
				return(
					<Image
						values={values}
						nextStep={this.nextStep}
						prevStep={this.prevStep}
						changeField={this.changeField}
					/>
				)
			case 4:
				return(
					<Tickets
						values={values}
						nextStep={this.nextStep}
						prevStep={this.prevStep}
						tickets = {this.state.userEvent.tickets}
						changeTicketDetails = {this.changeTicketDetails}
						validTicketCheck = {this.validTicketCheck}
						errorIfSecondTimeIsNotBeforeFirstTime={this.errorIfSecondTimeIsNotBeforeFirstTime}
						changeSellingTimes={this.changeSellingTimes}
						deleteTicket={this.deleteTicket}
						waitingForTicketThatDoesntExistToSellOut={this.waitingForTicketThatDoesntExistToSellOut}
						addTicket={this.addTicket}
						handleBooleanChange={this.handleBooleanChange}
					/>
				)
	  }

  }
}

export default withRouter(CreateEvent);

import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Test from './Test'

import EventDetails from "./CreateEventComponents/EventDetails";
import RefundPolicy from './RefundPolicy'
import "react-datepicker/dist/react-datepicker.css";
import Map from './CreateEventComponents/Map'
import Image from './CreateEventComponents/Image'
import Tickets from './CreateEventComponents/Tickets'
import Cancellations from './CreateEventComponents/Cancellations'
import Geocode from "react-geocode"
import AddressDetails from "./CreateEventComponents/AddressDetails";



class CreateEvent extends React.Component {

	constructor(){
	super()
	// this.addTicket= this.addTicket.bind(this)
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
			refunds: {optionSelected: '',
							refundUntil: '',
							howToResell: '',
							resellAtSpecificPrice: '',
							minimumPrice: '',
						}
		}],
		globalRefundPolicy: true,
		globalRefundOptions: {optionSelected: '',
						refundUntil: '',
						howToResell: '',
						resellAtSpecificPrice: '',
						minimumPrice: ''}
	}
	}

	componentDidMount = () => {
		
	}


	// addTicket = (e) => {
	// 	e.preventDefault()
	// 	let userEvent = this.state.userEvent
	// 	userEvent.tickets.push({
	// 		chargeForTicketsStatus: '',
	// 		chargeForNoShows: '',
	// 		ticketType: '',
	// 		ticketTypeID: userEvent.totalTicketsCreated + 1,
	// 		price: '',
	// 		numberOfTickets: '',
	// 		sellWhenTicketNumberSoldOut: '',
	// 		startSelling: '',
	// 		stopSelling: '',
	// 		startSellingTime: Date.now(),
	// 		stopSellingTime: userEvent.endDetails,
	// 		ticketDescription: '',
	// 		hold: '',
	// 		refunds: {optionSelected: '',
	// 						refundUntil: '',
	// 						howToResell: '',
	// 						resellAtSpecificPrice: '',
	// 						minimumPrice: ''
	// 						}
	// 	}
	// 	)
	// 	userEvent.totalTicketsCreated += 1
	// 	this.setState({ userEvent })
	// }

	createEvent = e => {
		e.preventDefault()

		
		

		let userEvent = this.state.userEvent
		console.log('userEvent.ticekts',	userEvent.tickets);
		let data = userEvent.image
		data.append('title', userEvent.title)
		data.append('venue', userEvent.venue)
		data.append('description', userEvent.description)
		data.append('startDetails', userEvent.startDetails)
		data.append('endDetails', userEvent.endDetails)
		data.append('token', localStorage.getItem("token"))
		data.append('currency', userEvent.currency)
		data.append('lat', userEvent.lat)
		data.append('lng', userEvent.lng)
		data.append('address1', userEvent.address1)
		data.append('address2', userEvent.address2)
		data.append('address3', userEvent.address3)
		data.append('address4', userEvent.address4)
		data.append('eventPassword', userEvent.eventPassword)
		data.append('globalRefundPolicy', userEvent.globalRefundPolicy)
		data.append('globalRefundOptions', JSON.stringify(userEvent.globalRefundOptions))
		data.append('region', userEvent.region)
		data.append('tickets', userEvent.tickets)
		data.append('ticketTypesEquivalent', userEvent.ticketTypesEquivalent)
		
		userEvent.tickets.forEach(item => {
			data.append(`tickets[]`, JSON.stringify(item));
		  });
		
	
		axios.post(`${process.env.REACT_APP_API}/image`, data)
			.then(res => {
				console.log('res', res)
				
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
		}
		
		// else if (field === "startDetails" || field === "endDetails") {
	    //     userEvent[field] = e
		// }else if(boolean){
		// 	e.target.value === 'true' ? userEvent[field]=true : userEvent[field]=false			
		// }else {
	    //   userEvent[field] = e.target.value;
	    // }
	    this.setState({ userEvent })
	}



	// changeSellingTimes = (e, field1, ticketNumber, field2, numberOfTickets) => {

	// 	console.log('numberOfTickets', numberOfTickets);
		

	// 	let userEvent = this.state.userEvent

	// 	userEvent.tickets[ticketNumber][field1] = e.target.value

	// 	if(e.target.value === 'now'){
	// 		userEvent.tickets[ticketNumber][field2] = Date.now()
	// 	} else if(e.target.value === 'whenPreviousSoldOut'){
	// 		userEvent.tickets[ticketNumber][field2] = ''
	// 		if(numberOfTickets === 2){
	// 			userEvent.tickets[1]['sellWhenTicketNumberSoldOut'] = 1
	// 		}
	// 	} else if(e.target.value === 'eventBegins'){
	// 		userEvent.tickets[ticketNumber][field2] = userEvent.startDetails
	// 	} else if (e.target.value ==='eventEnds'){
	// 		userEvent.tickets[ticketNumber][field2] = userEvent.endDetails
	// 	}
	// 	this.setState({ userEvent })
	// }

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

	// deleteTicket = (e, ticketNumber) => {
	// 	e.preventDefault()
	// 	let userEvent = this.state.userEvent
	// 	userEvent.tickets.splice(ticketNumber, 1)
	// 	this.setState({ userEvent })
	// }

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

	saveDataToParent = (data) => {		
		let userEvent = this.state.userEvent
		let newData = Object.entries(data)
		newData.forEach(e => {
			userEvent[e[0]] = e[1]
		})
		this.setState({userEvent})
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



  render() {
	  const { step } = this.state
	  const{ title, description, region, venue, address1, address2, address3, address4, startDetails, endDetails, currency, eventPassword, image, ticketTypesEquivalent, tickets,globalRefundOptions, globalRefundPolicy, lat, lng } = this.state.userEvent
	  const values = { title, description, region, venue, address1, address2, address3, address4, startDetails, endDetails, currency, eventPassword, image, ticketTypesEquivalent, tickets, globalRefundOptions,globalRefundPolicy, lat, lng }

	  switch(step){

		case 10:
			return(
				<Test
					values={values}	
				/>
			)

		  case 10:
			return(
				<EventDetails 
					nextStep={this.nextStep}
					saveDataToParent={this.saveDataToParent}
					values={values}					
				/>
			)

			case 10:
				return(
					<AddressDetails
						changeField={this.changeField}		
						getLatLngAfterDrag={this.getLatLngAfterDrag} 
						nextStep={this.nextStep}
						prevStep={this.prevStep}
						saveDataToParent={this.saveDataToParent}
						values={values}
					/>
				)
	

			case 10:
				return(
					<Image
						values={values}
						nextStep={this.nextStep}
						prevStep={this.prevStep}
						changeField={this.changeField}
					/>
				)
			case 1:
				return(
					<Tickets
						addTicket={this.addTicket}
						changeField={this.changeField}
						changeSellingTimes={this.changeSellingTimes}
						changeTicketDetails = {this.changeTicketDetails}
						deleteTicket={this.deleteTicket}
						errorIfSecondTimeIsNotBeforeFirstTime={this.errorIfSecondTimeIsNotBeforeFirstTime}
						handleBooleanChange={this.handleBooleanChange}
						nextStep={this.nextStep}
						prevStep={this.prevStep}
						tickets = {this.state.userEvent.tickets}
						values={values}
						waitingForTicketThatDoesntExistToSellOut={this.waitingForTicketThatDoesntExistToSellOut}
					/>
				)

			case 5:
				return(
				<Cancellations		
					handleRefundChange={this.handleRefundChange}
					nextStep={this.nextStep}
					prevStep={this.prevStep}
					submit={this.createEvent}
					values={values}
				/>
			)
	  }

  }
}

export default withRouter(CreateEvent);



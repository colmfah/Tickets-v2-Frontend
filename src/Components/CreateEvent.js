import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import EventDetails from "./CreateEventComponents/EventDetails";
import "react-datepicker/dist/react-datepicker.css";
import Image from './CreateEventComponents/Image'
import CreateTickets from './CreateEventComponents/CreateTickets'
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
		region: 'dublin',
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
		ticketTypesEquivalent: true,
		eventPassword: '',
		tickets: [{
			ticketType: '',
			ticketTypeID: 1,
			price: '',
			numberOfTickets: '',
			startSelling: '',
			chargeForTicketsStatus: 'chargeForTickets',
			chargeForNoShows: '',
			stopSelling: '',
			startSellingTime: '',
			stopSellingTime: '',
			ticketDescription: '',
			hold: '',
			refunds: {optionSelected: '',
							untilSpecific: '',
							howToResell: 'specificPrice',
							resellAtSpecificPrice: '',
							minimumPrice: '',
						},
			borderColors: {
				ticketType: 'none',
				ticketDescription: 'none',
				chargeForTicketsStatus: 'none',
				chargeForNoShows: 'none',
				price: 'none',
				hold: 'none',
				startSelling: 'none',
				startSellingTime: 'none',
				stopSelling: 'none',
				stopSellingTime: 'none',
				sellWhenTicketNumberSoldOut: 'none',
			},
			errors:{
				ticketType: '',
				ticketDescription: '',
				chargeForTicketsStatus: '',
				chargeForNoShows: '',
				price: '',
				hold: '',
				startSelling: '',
				startSellingTime: '',
				stopSelling: '',
				stopSellingTime: '',
				sellWhenTicketNumberSoldOut: ''
			}
		}],
		globalRefundPolicy: true,
		globalRefundOptions: {optionSelected: '',
						untilSpecific: '',
						howToResell: '',
						resellAtSpecificPrice: '',
						minimumPrice: ''},
		errorMessage: '',
		displaySpinner: false,
		message: ''
	}
	}

	componentDidMount = () => {
		
	}


	addTicket = () => {		
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
			startSellingTime: '',
			stopSellingTime: userEvent.endDetails,
			ticketDescription: '',
			hold: '',
			refunds: {optionSelected: '',
							untilSpecific: '',
							howToResell: 'specificPrice',
							resellAtSpecificPrice: '',
							minimumPrice: ''
							},
			borderColors: {
				ticketType: 'none',
				ticketDescription: 'none',
				chargeForTicketsStatus: 'none',
				chargeForNoShows: 'none',
				price: 'none',
				hold: 'none',
				startSelling: 'none',
				startSellingTime: 'none',
				stopSelling: 'none',
				stopSellingTime: 'none',
				sellWhenTicketNumberSoldOut: 'none',
			},
			errors:{
				ticketType: '',
				ticketDescription: '',
				chargeForTicketsStatus: '',
				chargeForNoShows: '',
				price: '',
				hold: '',
				startSelling: '',
				startSellingTime: '',
				stopSelling: '',
				stopSellingTime: '',
				sellWhenTicketNumberSoldOut: ''
			}
		}
		)
		userEvent.totalTicketsCreated += 1
		this.setState({ userEvent })
	}

	createEvent = e => {
		e.preventDefault()
		let userEvent = this.state.userEvent
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

		let displaySpinner = true
		this.setState({displaySpinner})
		
	
		axios.post(`${process.env.REACT_APP_API}/image`, data)
			.then(res => {
				console.log('res.data', res.data)
				displaySpinner = false
				this.setState({displaySpinner})
				this.props.history.push(`/events/${res.data._id}`)
				
				})

				.catch(err => {
				displaySpinner = false
				let errorMessage = String(err)
				this.setState({errorMessage, displaySpinner})
			})
	}

	changeField = (e, field) => {	
		
		
		
		let userEvent = this.state.userEvent
				
		if (field === "image") {
			userEvent.image = new FormData()
			userEvent.image.append('file', e.target.files[0])
			this.setState({ userEvent })
		}
		
		else if (field === "startDetails" || field === "endDetails") {
			userEvent[field] = e
		}

		else {
	      userEvent[field] = e.target.value;
		}
	
		
	    this.setState({ userEvent })
	}

	checkForErrors = (field, i, finalCheck) => {	
		
		let userEvent = this.state.userEvent

        let warning = ''

        if(userEvent.tickets[i][field] === ''){

			console.log('userEvent.tickets[i].numberOfTickets.split', userEvent.tickets[i].numberOfTickets.split(''))

            
            if(field ==='ticketType'){
                warning = 'Please Name Your Ticket'
            }else if(field === 'chargeForTicketsStatus'){
                warning = 'Please Select An Option'
            }else if(field === 'chargeForNoShows'){
                warning = 'Please Select How Much To Charge. Select €0 If You Do Not Want To Charge No Shows'
            }else if(field === 'hold'){
                warning = 'Please Select How To Fine Customers Who Do Not Turn Up'
            }else if(field === 'startSelling'){
                warning = 'Please Select When To Start Selling'
            }else if(field === 'stopSelling'){
                warning = 'Please Select When To Stop Selling'
            }else if(field === 'sellWhenTicketNumberSoldOut'){
                warning = 'Please Select Which Ticket Must Sell Out'
            }else if(field ==='numberOfTickets'){
                warning = 'Please Select Number Of Tickets'
            }else if(field ==='price'){
				warning = 'Please Select A Price. If Tickets Are Free Select €0'
			}
   
        }else if((field === 'chargeForNoShows' && userEvent.tickets[i].chargeForNoShows < 0) || (field === 'price' && userEvent.tickets[i].price < 0) || field === 'numberOfTickets' && userEvent.tickets[i].numberOfTickets <= 0 ){
            warning = 'Value Must Be Positive'

        }else if (field === 'price' && userEvent.tickets[i].price > 0 && userEvent.tickets[i].price < 1){
            warning = 'If Tickets Are Not Free, The Minimum Price Allowed Is €1'
		}
		else if(field === 'numberOfTickets' && userEvent.tickets[i].numberOfTickets.split('').includes('.')){
			warning = 'Number Of Tickets Must Be A Whole Number'
		}
		
		// else if (field === 'sellWhenTicketNumberSoldOut'){
		// 	let tickets = this.state.userEvent.tickets.map(f => f.ticketTypeID)

		// 	console.log('tickets', tickets)
		// 	console.log('userEvent.tickets[i].sellWhenTicketNumberSoldOut', Number(userEvent.tickets[i].sellWhenTicketNumberSoldOut));
			
		// 	console.log('!tickets.includes(userEvent.tickets[i].sellWhenTicketNumberSoldOut)', !tickets.includes(userEvent.tickets[i].sellWhenTicketNumberSoldOut));
		// 	console.log('tickets.includes(userEvent.tickets[i].sellWhenTicketNumberSoldOut)', tickets.includes(userEvent.tickets[i].sellWhenTicketNumberSoldOut));
			
			

        //     if(!tickets.includes(Number(userEvent.tickets[i].sellWhenTicketNumberSoldOut))){
        //         warning = 'sellWhenTicketNumberSoldOut'
        //     }

		// }
		
 
        userEvent.tickets[i].errors[field] = warning
        let color 
        warning === '' ? color = '#00988f' : color = 'tomato'
        userEvent.tickets[i].borderColors[field] = color

        this.setState({userEvent})

        if(finalCheck && warning !== ''){return field}
	}
				
	changeSellingTimes = (e, ticketNumber, field1, field2, values) => {


		let userEvent = this.state.userEvent

		userEvent.tickets[ticketNumber][field1] = e.target.value

		if(e.target.value === 'now'){
			userEvent.tickets[ticketNumber][field2] = Date.now()
			
		} else if(e.target.value === 'whenPreviousSoldOut'){
			userEvent.tickets[ticketNumber][field2] = ''
			if(ticketNumber === 1){
				userEvent.tickets[1]['sellWhenTicketNumberSoldOut'] = 1
			}
		} else if(e.target.value === 'eventBegins'){
			userEvent.tickets[ticketNumber][field2] = values.startDetails
		} else if (e.target.value ==='eventEnds'){
			userEvent.tickets[ticketNumber][field2] = values.endDetails
        }else if(e.target.value === 'specific' && field1 === 'startSelling'){			
			userEvent.tickets[ticketNumber][field2] = ''
		}

        this.setState({ userEvent })
        
        this.checkForTimeErrors(ticketNumber, field1, field2, values)
    }

	changeTicketDetails = (e, field, ticketNumber) => {

		let userEvent = this.state.userEvent

		if(e instanceof Date){
			userEvent.tickets[ticketNumber][field] = e
		}else {

			userEvent.tickets[ticketNumber][field] = e.target.value
		}
		this.setState({ userEvent })

		this.checkForErrors(field, ticketNumber)
				
	}

	checkForDescriptionErrors = (i) =>{
        let userEvent = this.state.userEvent
        userEvent.tickets[i].borderColors.ticketDescription = '#00988f' 
        this.setState({userEvent})
	}
	
	checkForTimeErrors = (i, field1, field2, values, finalCheck) =>{

        let userEvent = this.state.userEvent
        let warning = ''
        if(userEvent.tickets[i][field1] === ''){
            warning = 'Please Select A Time'
        }else if(moment(field2).isAfter(moment(values.endDetails))){
            warning = 'Tickets Cannot Be Sold After Your Event Has Ended'
        }

        
        userEvent.tickets[i].errors[field1] = warning
        let color 
        warning === '' ? color = '#00988f' : color = 'tomato'

        userEvent.tickets[i].borderColors[field1] = color

        this.setState({userEvent})

        if(finalCheck){
            if(warning === 'Please Select A Time'){
                return field1
            }else if(warning === 'Tickets Cannot Be Sold After Your Event Has Ended') {
                return field2
            }
        }

    }

	updateTickets( tickets){

		this.setState({tickets})
	}

	deleteTicket = (e, i) => {
		e.preventDefault()
		let userEvent = this.state.userEvent
		userEvent.tickets = userEvent.tickets.map(f => {
			
			if(Number(f.sellWhenTicketNumberSoldOut) === i+1){
				console.log('triggered', i+1)
				
				f.sellWhenTicketNumberSoldOut = ''
				f.startSelling = ''
			}
			return f
		})
		userEvent.tickets.splice(i, 1)
		this.setState({ userEvent })
	}

	getLatLng = () => {
        let userEvent = this.state.userEvent        
		Geocode.fromAddress(`${userEvent.venue}, ${userEvent.address1}, ${userEvent.address2}, ${userEvent.address3}, ${userEvent.address4}`).then(response => {            
			const { lat, lng } = response.results[0].geometry.location;
			userEvent.lat = lat
            userEvent.lng = lng 
            this.setState(userEvent)
          })
    }

	getLatLngAfterDrag = (event) => {
		let userEvent = this.state.userEvent
		userEvent.lat = event.latLng.lat()
		userEvent.lng = event.latLng.lng()
        this.setState(userEvent)
    }

	handleRefundChange = (e, field, i)=>{
		
		let userEvent = this.state.userEvent
		
		if(field === 'optionSelected' && e.target.value !== 'excessDemand'){
			userEvent.globalRefundOptions.howToResell = 'specific'
		}
		if(e instanceof Date){
			userEvent.globalRefundOptions[field] = e
		}else{
			userEvent.globalRefundOptions[field] = e.target.value
		}
	
		this.setState({ userEvent })
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

	startSellingSpecificTimeErrors = (i, field, values, finalCheck) => {
     
        
        let userEvent = this.state.userEvent
        let warning = ''

        if(userEvent.tickets[i][field] === ''){

            warning = 'Please Select When You Want To Start Selling These Tickets'
    
        }else if(moment(userEvent.tickets[i].startSellingTime).isAfter(moment(values.endDetails))){

            warning = 'You Cannot Sell Tickets After The Event Ends'
        }

        userEvent.tickets[i].errors[field] = warning
        let color 
        warning === '' ? color = '#00988f' : color = 'tomato'
        userEvent.tickets[i].borderColors[field] = color

        this.setState({userEvent})

        if(finalCheck && warning !== ''){return field}

	}
	
	stopSellingSpecificTimeErrors = (i, field, values, finalCheck) => {
         
        let userEvent = this.state.userEvent
        let warning = ''

        if(userEvent.tickets[i][field] === ''){

            warning = 'Please Select When You Want To Stop Selling These Tickets'
    
        }else if(moment(userEvent.tickets[i].startSellingTime).isAfter(moment(values.endDetails))){

            warning = 'You Cannot Sell Tickets After The Event Ends'

        }else if(userEvent.tickets[i].startSelling!=='whenPreviousSoldOut' &&  !moment(this.state.userEvent.tickets[i].stopSellingTime).isAfter(moment(this.state.userEvent.tickets[i].startSellingTime))){

            warning = 'You Have Selected To Stop Selling Tickets Before You Start Selling Them'
        }

        userEvent.tickets[i].errors[field] = warning
        let color 
        warning === '' ? color = '#00988f' : color = 'tomato'
        userEvent.tickets[i].borderColors[field] = color

        this.setState({ userEvent })

        if(finalCheck && warning !== ''){return field}

    }

	setSpecificTime = (e, i, field) =>{
		
		let userEvent = this.state.userEvent       
        userEvent.tickets[i][field] = e   
        this.setState({userEvent})
    }

	turnBorderOrange = (field, i) => { 
		let userEvent = this.state.userEvent      
		userEvent.tickets[i].borderColors[field] = '#ff8c00' 
		userEvent.tickets[i].errors[field]=''  			
		this.setState({userEvent})
	}




  render() {
	  const { step } = this.state
	  const{ title, description, region, venue, address1, address2, address3, address4, startDetails, endDetails, currency, eventPassword, image, ticketTypesEquivalent, tickets,globalRefundOptions, lat, lng } = this.state.userEvent
	  const values = { title, description, region, venue, address1, address2, address3, address4, startDetails, endDetails, currency, eventPassword, image, ticketTypesEquivalent, tickets, globalRefundOptions, lat, lng }
	  switch(step){

		  case 1:
			return(
				<EventDetails 
					changeField={this.changeField}	
					nextStep={this.nextStep}
					values={values}					
				/>
			)

			case 2:
				return(
					<AddressDetails
						changeField={this.changeField}	
						getLatLng={this.getLatLng} 	
						getLatLngAfterDrag={this.getLatLngAfterDrag} 
						nextStep={this.nextStep}
						prevStep={this.prevStep}
						values={values}
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
					<CreateTickets
						addTicket={this.addTicket}
						changeSellingTimes = {this.changeSellingTimes }
						changeTicketDetails = {this.changeTicketDetails}
						checkForDescriptionErrors={this.checkForDescriptionErrors}
						checkForErrors={this.checkForErrors}
						checkForTimeErrors={this.checkForTimeErrors}
						updateTickets={this.updateTickets}
						deleteTicket={this.deleteTicket}
						// handleBooleanChange={this.handleBooleanChange}
						nextStep={this.nextStep}
						prevStep={this.prevStep}
						setSpecificTime={this.setSpecificTime}
						startSellingSpecificTimeErrors={this.startSellingSpecificTimeErrors}
						stopSellingSpecificTimeErrors={this.stopSellingSpecificTimeErrors}
						values={values}
					/>
				)

			case 5:
				return(
				<Cancellations		
					changeField={this.changeField}
					handleRefundChange={this.handleRefundChange}
					nextStep={this.nextStep}
					prevStep={this.prevStep}
					submit={this.createEvent}
					values={values}
					errorMessage={this.state.errorMessage}
					message = {this.state.message}
					displaySpinner = {this.state.displaySpinner}
				/>
			)
	  }

  }
}

export default withRouter(CreateEvent);



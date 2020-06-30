import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import DatePicker from "react-datepicker";
import Nav from "./Nav";
import RefundPolicy from './RefundPolicy'
import "react-datepicker/dist/react-datepicker.css";
import Map from './Map'
import Geocode from "react-geocode"

class CreateEvent extends React.Component {

	constructor(){
	super()
	this.addTicket= this.addTicket.bind(this)
	this.changeTicketDetails= this.changeTicketDetails.bind(this)
}


  state = {
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
				startSelling: 'now',
				chargeForTicketsStatus: 'chargeForTickets',
				chargeForNoShows: 0,
				stopSelling: 'eventEnds',
				startSellingTime: Date.now(),
				stopSellingTime: '',
				ticketDescription: '',
				hold: 'noHold',
				refunds: {optionSelected: 'excessDemand',
								refundUntil: '',
								howToResell: 'auction',
								resellAtSpecificPrice: '',
								minimumPrice: '',
							}
			}]
			,
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
		let token = localStorage.getItem("token");
		let objectToSend = {
		token: token
		}

		axios.post(`${process.env.REACT_APP_API}/auth`, objectToSend).then(res => {
				let userEvent = this.state.userEvent
				userEvent.organiser = res.data._id
				this.setState({ userEvent })
		})
	}

	addTicket = (e, inForm) => {
		if(inForm === true){e.preventDefault()}
		let userEvent = this.state.userEvent
		userEvent.tickets.push({
			chargeForTicketsStatus: 'chargeForTickets',
			chargeForNoShows: 0,
			ticketType: '',
			ticketTypeID: userEvent.totalTicketsCreated + 1,
			price: '',
			numberOfTickets: '',
			sellWhenTicketNumberSoldOut: '',
			startSelling: 'now',
			stopSelling: 'eventEnds',
			startSellingTime: Date.now(),
			stopSellingTime: userEvent.endDetails,
			ticketDescription: '',
			hold: 'noHold',
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

	changeField = (e, field) => {
	    let userEvent = this.state.userEvent

			if (field === "image") {
				userEvent.image = new FormData()
				userEvent.image.append('file', e.target.files[0])
				this.setState({ userEvent })
			}

		else if (field === "startDetails" || field === "endDetails") {
	        userEvent[field] = e
	    } else {
	      userEvent[field] = e.target.value;
	    }
	    this.setState({ userEvent })
	  }

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
			userEvent.tickets[ticketNumber][field] = Date.parse(e)
		}else {

			userEvent.tickets[ticketNumber][field] = e.target.value
		}
			this.setState({ userEvent })
	}

	changeRegion = (e) => {
		e.preventDefault()
		let userEvent = this.state.userEvent
		let currencyOptions=this.state.currencyOptions
			userEvent.region=e.target.value
			userEvent.currency=currencyOptions[e.target.value]

			this.setState({ userEvent })
	}

	deleteTicket = (e, ticketNumber) => {
		e.preventDefault()
		let userEvent = this.state.userEvent
		userEvent.tickets.splice(ticketNumber, 1)
		this.setState({ userEvent })
	}

	errorIfSecondTimeIsNotBeforeFirstTime = (firstTime, secondTime, field) => {

		let errors = this.state.errors

		if(field ==='sellingTicketsWhenEventIsOver'){
			if(moment(firstTime).isBefore(secondTime)){
				errors[field] = true
			}  else{
				errors[field] = false
			}
		}
		else if(moment(firstTime).isSameOrBefore(secondTime)){
			errors[field] = true
		}  else{
			errors[field] = false
		}
		this.setState({errors })
	}
 

	getLatLng = (e) => {
		e.preventDefault()
		let userEvent = this.state.userEvent
		let showMap = this.state.showMap
		showMap = true
		Geocode.fromAddress(`${userEvent.venue}, ${userEvent.address1}, ${userEvent.address2}, ${userEvent.address3}, ${userEvent.address4}`).then(
  	response => {
    const { lat, lng } = response.results[0].geometry.location;
    userEvent.lat = lat
		userEvent.lng = lng
		this.setState({ showMap, userEvent })
  },
  error => {
    console.error(error)
  }
)
	}

	getLatLngAfterDrag = (event) => {
		console.log('latlongafterdrag', event)
		let userEvent = this.state.userEvent
		userEvent.lat = event.latLng.lat()
		userEvent.lng = event.latLng.lng()
		this.setState({ userEvent })
	}

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

	waitingForTicketThatDoesntExistToSellOut = (e) => {
			let userEvent = this.state.userEvent
			let validTicketTypeIDs = this.state.userEvent.tickets.map(e=>e.ticketTypeID)
			console.log('validTicketTypeIDs', validTicketTypeIDs)
			let ticketsWaitingOnSellOut = userEvent.tickets.filter(e=>{return e.sellWhenPrevSoldOut === true})
			console.log('ticketsWaitingOnSellOut', ticketsWaitingOnSellOut)
	
			let numProblemTickets = ticketsWaitingOnSellOut.filter(e => {if(!validTicketTypeIDs.includes(Number(e.sellWhenTicketNumberSoldOut))){return e}} )
	
			let numProblemTicketsArray = numProblemTickets.map(e => e.ticketTypeID)
	
			if(numProblemTickets.length > 0){
				userEvent.tickets.forEach( e => {if(numProblemTicketsArray.includes(Number(e.ticketTypeID))){
					e.waitingForTicketThatDoesntExistToSellOut = true
				}
				})
				this.setState({ userEvent})
			}
		}


  render() {
    return (
<>
	<Nav />

	<form onSubmit={this.createEvent}>
		<h2>Event Details</h2>

		<div>
		<input
			value={this.state.userEvent.title}
			required
			onChange={event => this.changeField(event, 'title')}
			type='text'
			placeholder='Event Name'
			/>
		</div>

		<div>
		<textarea
			value={this.state.userEvent.description}
			required
			onChange={event => this.changeField(event, 'description')}
			type='text'
			placeholder='Describe the event'
			/>
		</div>

		<div>
		Select Region to post event
		<select
			required
			value={this.state.userEvent.region}
			onChange={event=>this.changeRegion(event)}
		>
			<option value="dublin">Dublin</option>
			<option value="cork">Cork</option>
			<option value="belfast">Belfast</option>
			<option value="london">London</option>
			<option value="other">Other</option>
		</select>
		</div>

		{/*Import region options from backend when this is set up. Set default based on address entered by user*/}

		<div>
			<input
				value={this.state.userEvent.venue}
				required
				onChange={event => this.changeField(event, 'venue')}
				type='text'
				placeholder='Name of Venue'
			/>
		</div>

		<div>
			<input
				value={this.state.userEvent.address1}
				required
				onChange={event => this.changeField(event, 'address1')}
				type='text'
				placeholder='Street Address'
			/>
		</div>

		<div>
			<input
				value={this.state.userEvent.address2}
				required
				onChange={event => this.changeField(event, 'address2')}
				onBlur={this.getLatLng}
				type='text'
				placeholder='Address Line 2'
			/>
		</div>

		<div>
			<input
				value={this.state.userEvent.address3}
				onChange={event => this.changeField(event, 'address3')}
				onBlur={this.getLatLng}
				type='text'
				placeholder='Address Line 3 (optional)'
			/>
		</div>

		<div>
			<input
				value={this.state.userEvent.address3}
				onChange={event => this.changeField(event, 'address4')}
				onBlur={this.getLatLng}
				type='text'
				placeholder='Address Line 4 (optional)'
			/>
		</div>


		{this.state.showMap === true &&
			<div>
				<Map
					google={this.props.google}
					center={{lat: this.state.userEvent.lat, lng: this.state.userEvent.lng}}
					height='300px'
					zoom={15}
					getLatLngAfterDrag={this.getLatLngAfterDrag}
				/>
			</div>
		}


		<div>
			<DatePicker
				timeIntervals={15}
				selected={this.state.userEvent.startDetails}
				onChange={event =>
				this.changeField(event, "startDetails")
				}
				onBlur={(event) => {this.errorIfSecondTimeIsNotBeforeFirstTime(moment(event.target.value), moment(), 'startDateInPast'); this.setDefaultstopSellingTime(event.target.value)}}
				showTimeSelect
				dateFormat="Pp"
				required
				placeholderText='Date & Time Event Starts'
			/>
		</div>

		{this.state.errors.startDateInPast === true && <div className='warning'>{this.state.errorMsg.startDateInPast}</div>}

		<div>
			<DatePicker
				timeIntervals={15}
				selected={this.state.userEvent.endDetails}
				onChange={event =>
					this.changeField(event, "endDetails")
				}
				onBlur={(event) => { this.errorIfSecondTimeIsNotBeforeFirstTime(event.target.value, this.state.userEvent.startDetails, 'eventEndsBeforeItBegins'); this.setDefaultstopSellingTime(event.target.value)}}
				showTimeSelect
				dateFormat="Pp"
				required
				placeholderText='Date And Time Event Ends'
			/>
			</div>


		{this.state.errors.endDateInPast === true && <div className='warning'>{this.state.errorMsg.endDateInPast}</div>}

		{this.state.errors.eventEndsBeforeItBegins === true && <div className='warning'>{this.state.errorMsg.eventEndsBeforeItBegins}</div>}


		<div>
			Upload an image
			<input
				required
				type="file"
				onChange={event => this.changeField(event, 'image')}
			/>
		</div>

		{this.state.userEvent.region === 'other' && 
			<div>
				Currency:
				<select
					required
					value={this.state.userEvent.currency}
					onChange={event => this.changeField(event, "currency")}
				>
					<option value="EUR">EUR</option>
					<option value="GBP">GBP</option>
				</select>
			</div>
		}

		<div>
			<input
				value={this.state.userEvent.eventPassword}
				required
				onChange={event => this.changeField(event, 'eventPassword')}
				type='password'
				placeholder='password to check customers in'
			/>
		</div>


		<h1>Create Tickets</h1>

		{this.state.userEvent.tickets.map((e, i) => {
			return (
				<div key={i}>
					<div>
						Ticket Number {i+1}:
					</div>

					<div>
						<label>
							Ticket Name:
							<input
								required
								type="text"
								value={this.state.userEvent.tickets[i].ticketType}
								onChange={event => this.changeTicketDetails(event, 'ticketType', i)}
								placeholder="Early Bird, General Admission..."/>
						</label>
					</div>

					<div>
						<label>
							Ticket Description:
							<input
								type="text"
								value={this.state.userEvent.tickets[i].ticketDescription}
								onChange={event => this.changeTicketDetails(event, 'ticketDescription', i)}
								placeholder="Optional - Get backstage access..."/>
							</label>
					</div>


					<div>					          
						<select
							required 
							value={this.state.userEvent.tickets[i].chargeForTicketsStatus}			
							onChange={event => this.changeTicketDetails(event, 'chargeForTicketsStatus', i)}
						>
						<option value="chargeForTickets">Charge For Tickets</option>
						<option value="freeTickets">Free Tickets</option>
						</select>
					</div>


					{this.state.userEvent.tickets[i].chargeForTicketsStatus === 'freeTickets' ?
						<div>
							<label>
								{`Fine for customers who don't show up: ${this.state.currencyOptions[this.state.userEvent.currency]}`}
							</label>
							<input
								type="number"
								value={this.state.userEvent.tickets[i].chargeForNoShows}
								onChange={event => this.changeTicketDetails(event, 'chargeForNoShows', i)}
								placeholder="None"
								min={0}
							/>     
						</div>

						:

						<div>
							<label>
								{`Price: ${this.state.currencyOptions[this.state.userEvent.currency]}`}
							</label>

							<input
								required
								type="number"
								value={this.state.userEvent.tickets[i].price}
								onChange={event => this.changeTicketDetails(event, 'price', i)}
								placeholder="10"
								min={1}
							/>

						</div>
					
					}

					{this.state.userEvent.tickets[i].chargeForNoShows > 0 && 
					<div>
						<select
							required 
							value={this.state.userEvent.tickets[i].hold}			
							onChange={event => this.changeTicketDetails(event, 'hold', i)}
						>
						<option value="hold">Place hold on customers account before event begins</option>
						<option value="noHold">Trust customers to provide chargable credit card (no hold)</option>
						</select>
					</div>
					
					}	




					<div>
						<label>
							Number of Tickets
							<input
								required
								type="number"
								min={1}
								value={this.state.userEvent.tickets[i].numberOfTickets}
								onChange={event => this.changeTicketDetails(event, 'numberOfTickets', i)}
								placeholder="100"/>
						</label>
					</div>

					<div>
						<label>
							Start Selling Tickets:
						</label>
								
						<select
							required value={this.state.userEvent.tickets[i].startSelling}
							onChange={event => this.changeSellingTimes(event, 'startSelling', i, 'startSellingTime')}
						>
							<option value="now">Now</option>
							<option value="specific">Specific Date and Time</option>
							<option value="whenPreviousSoldOut" disabled={i==0}>When A Previous Ticket Is Sold Out</option>
						</select>
					</div>

					{this.state.userEvent.tickets[i].startSelling === 'whenPreviousSoldOut' &&
						<div>
							<label>
								When Which Ticket is sold out?
							</label>
							<select
								required
								value={this.state.userEvent.tickets[i].sellWhenTicketNumberSoldOut}
								onChange={(event) => {this.changeTicketDetails(event, 'sellWhenTicketNumberSoldOut', i); this.validTicketCheck(event, i)}}
							>

								<option value=''>select ticket</option>
								{this.state.userEvent.tickets.filter((e, ind) => ind<i).map(	(e, index) => {
									return (
										<option key={index} value={e.ticketTypeID}>
											{e.ticketType}
										</option>
									)}	
								)}

							</select>

						{this.state.userEvent.tickets[i].waitingForTicketThatDoesntExistToSellOut === true &&
							<div className='error'>
								Please select a valid ticket
							</div>}

						</div>
					}


					{this.state.userEvent.tickets[i].startSelling == 'specific' &&
						<div>
							<label>
								<DatePicker
									timeIntervals={15}
									onChange={event => this.changeTicketDetails(event, 'startSellingTime', i)}
									onBlur={event => this.errorIfSecondTimeIsNotBeforeFirstTime(this.state.userEvent.startDetails, event.target.value, 'startSellingAfterEventBegins')}
									selected={this.state.userEvent.tickets[i].startSellingTime}
									placeholderText='Select Date And Time'
									showTimeSelect
									dateFormat="Pp"
									required
									/>
								</label>
						</div>
					}

					{this.state.errors.startSellingAfterEventBegins === true && this.state.userEvent.tickets[i].startSelling === 'specific' && <div className='warning'>{this.state.errorMsg.startSellingAfterEventBegins}</div>}


					<div>
						<label>
						Stop Selling Tickets:
							<select
								required value={this.state.userEvent.tickets[i].stopSelling}
								onChange={event => this.changeSellingTimes(event, 'stopSelling', i, 'stopSellingTime')}
							>
								<option value="eventBegins">When Event Begins</option>
								<option value="eventEnds">When Event Ends</option>
								<option value="specific">At Specific Date and Time</option>
							</select>
						</label>
					</div>

					{this.state.userEvent.tickets[i].stopSelling == 'specific'  &&
						<div>
							<label>
								<DatePicker
									timeIntervals={15}
									onChange={event => this.changeTicketDetails(event, 'stopSellingTime', i)}
									onBlur={(event) =>{ this.errorIfSecondTimeIsNotBeforeFirstTime(this.state.userEvent.endDetails, event.target.value, 'sellingTicketsWhenEventIsOver'); this.errorIfSecondTimeIsNotBeforeFirstTime(this.state.userEvent.tickets[i].stopSellingTime, this.state.userEvent.tickets[i].startSellingTime, 'sellingStopsBeforeStarts') }}
									selected={this.state.userEvent.tickets[i].stopSellingTime}
									placeholderText='Select Date And Time'
									showTimeSelect
									dateFormat="Pp"
									required
								/>
							</label>
						</div>
					}

					{this.state.errors.sellingTicketsWhenEventIsOver === true && this.state.userEvent.tickets[i].stopSelling === 'specific' && <div className='warning'>{this.state.errorMsg.sellingTicketsWhenEventIsOver}</div>}

					{this.state.errors.sellingStopsBeforeStarts === true && <div className='warning'>{this.state.errorMsg.sellingStopsBeforeStarts}</div>}


					{this.state.userEvent.tickets.length > 1 &&
						<button 
							onClick={(event )=> {this.deleteTicket(event, i); this.waitingForTicketThatDoesntExistToSellOut()} }>Delete Ticket
						</button>
					}
									
					<hr />
			</div>
			)
		})}

		<button onClick={(e) => this.addTicket(e, true)}>Create Another Ticket</button>

		{this.state.userEvent.tickets.length > 1 && 		
		
		<div>
			<h4>Are all ticket types equivalent to each other when customers enter the event?</h4>
			<select
				required
				value={this.state.userEvent.ticketTypesEquivalent}
				onChange={event => this.handleBooleanChange(event, 'ticketTypesEquivalent')}
				>
				<option value={true}>Yes - eg. Early Bird, General Admission etc.</option>
				<option value={false}>No - eg. Backstage Access, VIP Treatment etc.</option>
			</select>

		</div>
		}


		{this.state.userEvent.tickets.find(e=>e.chargeForTicketsStatus === 'chargeForTickets')!==undefined &&
			<div>
				
				<h3>Refund Policy</h3>

				<RefundPolicy
					freeTickets={false}
					ticketTypesEquivalent={this.state.userEvent.ticketTypesEquivalent}
					globalRefundPolicy ={this.state.userEvent.globalRefundPolicy}
					selectedRefundOption={this.state.userEvent.globalRefundOptions.optionSelected}
					handleRefundChange={this.handleRefundChange}
					refundUntil={this.state.userEvent.globalRefundOptions.refundUntil}
					howToResell={this.state.userEvent.globalRefundOptions.howToResell}
					resellAtSpecificPrice={this.state.userEvent.globalRefundOptions.resellAtSpecificPrice}
					i = {'not relevant'}
					price={this.state.userEvent.tickets.price}
					textForAuctionAndSpecific={'The original price of the most expensive ticket is'}
					ticketName={'Refunded Tickets'}
					minimumPrice={this.state.userEvent.tickets.minimumPrice}
					highestPricedTicket={this.highestPricedTicket()}
					currencySymbol={this.state.currencyOptions[this.state.userEvent.currency]}
					nameOfResoldTickets={this.state.userEvent.globalRefundOptions.nameOfResoldTickets}
					originalName={this.getTicketNames('chargeForTickets')}
					numberOfTickets={this.state.userEvent.tickets.length}
					ticketTypesEquivalent={this.state.userEvent.ticketTypesEquivalent}
				/>
				
			</div>
		}

		{this.state.userEvent.tickets.find(e=>{return (e.chargeForTicketsStatus === 'freeTickets' && e.chargeForNoShows > 0)})!==undefined &&
			<div>
				<h3>Cancellation Policy For Free Tickets</h3>
				<h5>This applies to free tickets that incur a penalty if customer doesn't show up.</h5><br /> 
				<h5>Free tickets that do not incur a penalty can be cancelled by customer at any time</h5>

				<RefundPolicy
					freeTickets={true}
					ticketTypesEquivalent={this.state.userEvent.ticketTypesEquivalent}
					globalRefundPolicy ={this.state.userEvent.globalRefundPolicy}
					selectedRefundOption={this.state.userEvent.globalRefundOptions.optionSelected}
					handleRefundChange={this.handleRefundChange}
					refundUntil={this.state.userEvent.globalRefundOptions.refundUntil}
					howToResell={this.state.userEvent.globalRefundOptions.howToResell}
					resellAtSpecificPrice={this.state.userEvent.globalRefundOptions.resellAtSpecificPrice}
					i = {'not relevant'}
					price={this.state.userEvent.tickets.price}
					textForAuctionAndSpecific={'The original price of the most expensive ticket is'}
					ticketName={'Refunded Tickets'}
					minimumPrice={this.state.userEvent.tickets.minimumPrice}
					highestPricedTicket={this.highestPricedTicket()}
					currencySymbol={this.state.currencyOptions[this.state.userEvent.currency]}
					nameOfResoldTickets={this.state.userEvent.globalRefundOptions.nameOfResoldTickets}
					originalName={this.getTicketNames('freeTickets')}
					numberOfTickets={this.state.userEvent.tickets.length}
					ticketTypesEquivalent={this.state.userEvent.ticketTypesEquivalent}
				/>

			</div>
		
		}



		<button>Create Event</button>
    </form>


    </>
    )
  }
}

export default withRouter(CreateEvent);

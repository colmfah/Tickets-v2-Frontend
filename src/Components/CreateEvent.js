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
			tickets: [],
			globalRefundPolicy: true,
			globalRefundOptions: {}
		},
		errors: {
			startDateInPast: false,
			endDateInPast: false,
			eventEndsBeforeItBegins: false,
			startSellingAfterEventBegins: false,
			sellingTicketsWhenEventIsOver: false,
			sellingStopsBeforeStarts: false
	},
    errorMsg: {
			startDateInPast: 'Event must begin in the future',
			endDateInPast: 'Event must end in the future',
			eventEndsBeforeItBegins: 'Event must start before it ends!',
			startSellingAfterEventBegins: 'You must start selling tickets before the event begins',
			sellingTicketsWhenEventIsOver: 'You cannot sell tickets after the event has ended',
			sellingStopsBeforeStarts: 'You cannot stop selling tickets before you have started selling them'
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
			userEvent.globalRefundOptions=this.generateRefundPolicyOptions()
			this.setState({ userEvent })
    })
		this.addTicket('not relevant', false)
  }



	errorIfSecondTimeIsAfterFirstTime = (firstTime, secondTime, field) => {
		console.log('field', field)
		console.log('firstTime', moment(Date.parse(firstTime)).format('DDMMYY HH:mm'))
		console.log('secondTime', moment(Date.parse(secondTime)).format('DDMMYY HH:mm'))
		let errors = this.state.errors
		let onBlurFired = this.state.onBlurFired
		onBlurFired += 1
		console.log('ONBLURFIRED', onBlurFired)
		if(Date.parse(firstTime) < Date.parse(secondTime)){
			errors[field] = true
			console.log('second time is after first time - error')
		}  else{
			errors[field] = false
			console.log('second timeisnot after first time - no error')
			console.log('-------------------')
		}
		this.setState({ onBlurFired, errors })
	}



	changeRegion = (e) => {
		e.preventDefault()
		let userEvent = this.state.userEvent
		let currencyOptions=this.state.currencyOptions
			console.log(e.target.value)
			userEvent.region=e.target.value
			userEvent.currency=currencyOptions[e.target.value]

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


  changeField = (e, field) => {
    let userEvent = this.state.userEvent;

    if (field === "image") {
      let data = new FormData();
      data.append("file", e.target.files[0]);
      this.setState({
        eventToSend: data
      });
    } else if (field === "startDetails" || field === "endDetails") {


        userEvent[field] = e;

    } else {
      userEvent[field] = e.target.value;
    }
    this.setState({ userEvent })
  }

	generateRefundPolicyOptions = () => {
		return 	{optionSelected: 'excessDemand',
						refundUntil: '',
						howToResell: 'auction',
						resellAtSpecificPrice: '',
						minimumPrice: '',
						nameOfResoldTickets: 'lastMinuteTickets'}
	}

	addTicket = (e, inForm) => {
		if(inForm === true){e.preventDefault()}
		let userEvent = this.state.userEvent
		userEvent.tickets.push({
			ticketType: '',
			price: '',
			numberOfTickets: '',
			startSelling: '',
			stopSelling: '',
			startSellingTime: '',
			stopSellingTime: '',
			ticketDescription: '',
			refunds: this.generateRefundPolicyOptions()
		})
		this.setState({ userEvent })
	}

  createEvent = e => {
    e.preventDefault()
		this.setState({
			errorMsg:'Creating Event. Please Wait...'
		})

    let data = this.state.eventToSend;

    data.append("title", this.state.userEvent.title)
    data.append("location", this.state.userEvent.location)
    data.append("ticketNo", this.state.userEvent.ticketNo)
    data.append("price", this.state.userEvent.price)
    data.append("description", this.state.userEvent.description)
    data.append("startDetails", this.state.userEvent.startDetails)
    data.append("endDetails", this.state.userEvent.endDetails)
    data.append("organiser", this.state.userEvent.organiser)
    data.append("currency", this.state.userEvent.currency)
    axios
      .post(`${process.env.REACT_APP_API}/image`, data)
      .then(res => {
        this.props.history.push({
          pathname: `/events/${res.data._id}`
        })
      })
      .catch(err => {
        console.log("imgerr", err)
      })
  }

  logout = () => {
    localStorage.removeItem("token")
    this.props.history.push({
      pathname: "/events"
    });
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

	getTicketNames = () => {

		return this.state.userEvent.tickets.map(	(e,i) => {return e.ticketType}	)
	}

	changeGlobalRefundPolicy = () => {
		let globalRefundPolicy = this.state.globalRefundPolicy
		globalRefundPolicy = !globalRefundPolicy
		this.setState({ globalRefundPolicy })
	}

	highestPricedTicket = () => {
		return (this.state.userEvent.tickets.map(	(e,i) => {return e.price}	).sort((a, b) => (b-a))[0])
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




        <div required>
					<DatePicker
						timeIntervals={15}
						selected={this.state.userEvent.startDetails}
						onChange={event =>
						this.changeField(event, "startDetails")
						}
						onBlur={event => this.errorIfSecondTimeIsAfterFirstTime(event.target.value, moment(), 'startDateInPast')}
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
							onBlur={(event) => {this.errorIfSecondTimeIsAfterFirstTime(event.target.value, moment(), 'endDateInPast'); this.errorIfSecondTimeIsAfterFirstTime(event.target.value, this.state.userEvent.startDetails, 'eventEndsBeforeItBegins')}}
							showTimeSelect
							dateFormat="Pp"
							required
							placeholderText='Date & Time Event Ends'
							/>
              </div>


							{this.state.errors.endDateInPast === true && <div className='warning'>{this.state.errorMsg.endDateInPast}</div>}

							{this.state.errors.eventEndsBeforeItBegins === true && <div className='warning'>{this.state.errorMsg.eventEndsBeforeItBegins}</div>}


							Upload an image
              <input
                type="file"
                onChange={event => this.changeField(event, "image")}
              />

							{this.state.userEvent.region === 'other' && <div>
								Currency:
								<select
									required
									value={this.state.userEvent.currency}
									onChange={event => this.changeField(event, "currency")}
								>
									<option value="EUR">EUR</option>
									<option value="GBP">GBP</option>
								</select>
								</div>}


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
										<label>
											{`Price: ${this.state.currencyOptions[this.state.userEvent.currency]}`}
											<input
												required
												type="number"
												value={this.state.userEvent.tickets[i].price}
												onChange={event => this.changeTicketDetails(event, 'price', i)}
												placeholder="10"/>
										</label>
										</div>

										<div>
										<label>
											Number of Tickets
											<input
												required
												type="number"
												value={this.state.userEvent.tickets[i].numberOfTickets}
												onChange={event => this.changeTicketDetails(event, 'numberOfTickets', i)}
												placeholder="100"/>
										</label>
										</div>

										<div>
										<label>
						          Start Selling Tickets:
						          <select
											required value={this.state.userEvent.tickets[i].startSelling}
											onChange={event => this.changeTicketDetails(event, 'startSelling', i)} >
						            <option value="now">Now</option>
						            <option value="specific">Specific Date & Time</option>
						            <option value="whenPreviousSoldOut" disabled={i==0}>When Previous Tickets Are Sold Out</option>
						          </select>
						        </label>
										</div>


										{this.state.userEvent.tickets[i].startSelling == 'specific' &&
										<div>
										<label>
											<DatePicker
												timeIntervals={15}
												onChange={event => this.changeTicketDetails(event, 'startSellingTime', i)}
												onBlur={event => this.errorIfSecondTimeIsAfterFirstTime(this.state.userEvent.startDetails, event.target.value, 'startSellingAfterEventBegins')}
												selected={this.state.userEvent.tickets[i].startSellingTime}
												placeholderText='Select Date & Time'
												showTimeSelect
												dateFormat="Pp"
												required
												/>
											</label>
											</div>
										}

						{this.state.errors.startSellingAfterEventBegins === true && <div className='warning'>{this.state.errorMsg.startSellingAfterEventBegins}</div>}

{/*
onBlur={(event) => {this.errorIfSecondTimeIsAfterFirstTime(event.target.value, moment(), 'endDateInPast'); this.errorIfSecondTimeIsAfterFirstTime(event.target.value, this.state.userEvent.startDetails, 'eventEndsBeforeItBegins')}}



	onBlur={(event) => {this.errorIfSecondTimeIsAfterFirstTime(this.state.userEvent.endDetails, event.target.value, 'sellingTicketsWhenEventIsOver'); this.errorIfSecondTimeIsAfterFirstTime(event.target.value, this.state.userEvent.startDetails, 'sellingStopsBeforeStarts')}}

	*/}



<div>
<label>
Stop Selling Tickets:
<select
required value={this.state.userEvent.tickets[i].stopSelling}
onChange={event => this.changeTicketDetails(event, 'stopSelling', i)}
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
onBlur={(event) => {this.errorIfSecondTimeIsAfterFirstTime(this.state.userEvent.endDetails, event.target.value, 'sellingTicketsWhenEventIsOver'); this.errorIfSecondTimeIsAfterFirstTime(event.target.value, this.state.userEvent.startDetails, 'sellingStopsBeforeStarts')}}
selected={this.state.userEvent.tickets[i].stopSellingTime}
placeholderText='Select Date & Time'
showTimeSelect
dateFormat="Pp"
required
/>
</label>
</div>
}

								{this.state.errors.sellingTicketsWhenEventIsOver === true && <div className='warning'>{this.state.errorMsg.sellingTicketsWhenEventIsOver}</div>}

								{this.state.errors.sellingStopsBeforeStarts === true && <div className='warning'>{this.state.errorMsg.sellingStopsBeforeStarts}</div>}


										{this.state.userEvent.tickets.length > 1 &&
											<button onClick={event => this.deleteTicket(event, i)}>Delete Ticket</button>}
										<hr />
									</div>)
							})}

							<button onClick={(e) => this.addTicket(e, true)}>Create Another Ticket</button>


		<h1>Refund Policy</h1>

		{this.state.userEvent.tickets.length > 1 && 		<div>
				<select
					required
					value={this.state.globalRefundPolicy}
					onChange={this.changeGlobalRefundPolicy}
				>
					<option value="true">Apply the same refund policy to all ticket types</option>
					<option value="false">Apply a different refund policy to each ticket type</option>
				</select>
				</div>
			}





		{(this.state.globalRefundPolicy === true)?
			<RefundPolicy
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
			originalNames={`Use Original Names - ${this.getTicketNames()[0]}, ${this.getTicketNames()[1]} etc. `}
			numberOfTickets={this.state.userEvent.tickets.length}
			 />
			 :this.state.userEvent.tickets.map(	(e,i) =>
			 {return <div key={i}>
			 <RefundPolicy
	 			selectedRefundOption={this.state.userEvent.tickets[i].refunds.optionSelected}
	 			handleRefundChange={this.handleRefundChange}
				i={i}
	 			refundUntil={this.state.userEvent.tickets[i].refunds.refundUntil}
	 			howToResell={this.state.userEvent.tickets[i].refunds.howToResell}
	 			resellAtSpecificPrice={this.state.userEvent.tickets[i].refunds.resellAtSpecificPrice}
				ticketName={`Ticket Type ${i+1}: ${e.ticketType}`}
				price={e.price}
				textForAuctionAndSpecific={'The original price was'}
				minimumPrice={e.minimumPrice}
				highestPricedTicket={e.price}
				currencySymbol={this.state.currencyOptions[this.state.userEvent.currency]}
				nameOfResoldTickets={this.state.userEvent.tickets[i].refunds.nameOfResoldTickets}
				originalNames={`Use Original Name - ${e.ticketType}`}
				numberOfTickets={this.state.userEvent.tickets.length}
	 			 />
				 <hr />
			 </div>


			 }	)}


                    <button>Create Event</button>
            </form>


      </>
    );
  }
}

export default withRouter(CreateEvent);

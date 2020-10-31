import React from "react";
import axios from "axios";
import moment from "moment";
import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from "./CheckoutForm";
import SaveCardForm from "./SaveCardForm";
import Nav from "./Nav";
import BuyTicket from "./BuyTicket";
import ColmTicket from "./ColmTicket";
import LastMinuteTickets from "./LastMinuteTickets";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";




class Event extends React.Component {
	constructor(){
	super()
	this.changeNumTickets= this.changeNumTickets.bind(this)
	this.calculateStripeFee= this.calculateStripeFee.bind(this)
}


  state = {
    formFields: [
      { label: "Number to Buy", type: "number", value: "price" }
    ],
    userEvent: {
			_id: '',
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
			organiser: {_id: '', name: '', stripeAccountID: '', salesPlan: ''},
			currency: "EUR",
			tickets: [{
				ticketType: '',
				ticketTypeID: '',
				price: '',
				numberOfTickets: '',
				sellWhenPrevSoldOut: '',
				startSelling: '',
				stopSelling: '',
				startSellingTime: '',
				stopSellingTime: '',
				ticketDescription: '',
				refunds: {optionSelected: 'excessDemand',
								refundUntil: '',
								howToResell: 'auction',
								resellAtSpecificPrice: '',
								minimumPrice: '',
								nameOfResoldTickets: 'lastMinuteTickets'},
				buy: {
					numTicketsSought: 0
				},
			}],
    },
    currency: {
      USD: "$",
      EUR: "€",
      NZD: "$"
    },
    purchaser: "",
		stripeCustomerID: '',
    errorMsg: "",
		lastMinuteTicketCharges: {
			subTotal: 0,
			fixedCharge: 0,
			variableCharge: 0,
			vatOnCharges: 0,
		},
		purchaseTicketCharges: {
			subTotal: 0,
			fixedCharge: 0,
			variableCharge: 0,
			vatOnCharges: 0,
		},
		cardDetails:{
			last4: '',
			card: ''
		},
		replaceExistingCard: false,
		message: ''
  }

	componentDidMount() {
			let token = ''
	if (localStorage.getItem("token")) {
		token = localStorage.getItem("token")
		}
		let objectToSend = {
		token: token,
				specificEvent: this.props.match.params.id
		};
		axios
		.post(`${process.env.REACT_APP_API}/retrieveEventByID`, objectToSend)
		.then(res => {
			this.setState({
			purchaser: res.data.purchaser,
						cardDetails: res.data.cardDetails,
						stripeCustomerID: res.data.stripeCustomerID,
						userEvent: res.data.userEvent
			});
		})
		.catch(err => console.log('errr', err));

	}

	calculateStripeFee = () => {
	return (1.23*(0.25 + (0.014)*this.displayTotal()))
	}

	calculateTotals = (data) => {

			let subTotal = 0
			let fixedCharge = 0
			let variableCharge = 0
			let totalTickets = 0
			let allTickets = this.state.userEvent.tickets
			let purchaseTicketCharges
			let lastMinuteTicketCharges

			let tickets
			if (data.lastMinuteTicket === false){
				tickets = this.state.userEvent.tickets.filter(e => {return (e.lastMinuteTicket !== true && e.chargeForTicketsStatus==='chargeForTickets')})
				purchaseTicketCharges = this.state.purchaseTicketCharges
			}else{
				tickets = this.state.userEvent.tickets.filter(e => {return (e.lastMinuteTicket === true && e.chargeForTicketsStatus==='chargeForTickets')})
				lastMinuteTicketCharges = this.state.lastMinuteTicketCharges
			}

			let highPriceTickets = tickets.filter(	e => {return e.price > 10}	)
			tickets.forEach(	e => {subTotal += (e.buy.numTicketsSought * e.price) }	)
			tickets.forEach(e => {totalTickets += Number(e.buy.numTicketsSought)})
			if(this.state.userEvent.organiser.salesPlan === 'basic'){
				fixedCharge = totalTickets * 0.49
				if(tickets[0].price > 10){
					variableCharge = (subTotal * 0.04)
				}
			} else {
				fixedCharge = totalTickets * 0.69
				highPriceTickets.forEach( e => {
					variableCharge += (Number(e.buy.numTicketsSought) * e.price * 0.055)
				} )
			}
			let vatOnCharges = 0.23*(fixedCharge + variableCharge)

			if (data.lastMinuteTicket === false){
				purchaseTicketCharges.subTotal = subTotal
				purchaseTicketCharges.fixedCharge = fixedCharge
				purchaseTicketCharges.variableCharge= variableCharge
				purchaseTicketCharges.vatOnCharges = vatOnCharges
				this.setState({purchaseTicketCharges})
			} else{
				lastMinuteTicketCharges.subTotal = subTotal
				lastMinuteTicketCharges.fixedCharge = fixedCharge
				lastMinuteTicketCharges.variableCharge= variableCharge
				lastMinuteTicketCharges.vatOnCharges = vatOnCharges
				this.setState({lastMinuteTicketCharges})
			}

	}

	changeQuantity = (i, quantity) =>{
		let userEvent = this.state.userEvent
		userEvent.tickets[i].buy.numTicketsSought = quantity
		this.setState(userEvent)
	}

	displayAdminFee = () => {
		return(
			(this.state.purchaseTicketCharges.fixedCharge+this.state.purchaseTicketCharges.variableCharge+this.state.purchaseTicketCharges.vatOnCharges).toFixed(2)
		)
			}

	displayTotal = () => {
		return (
				this.state.purchaseTicketCharges.fixedCharge+this.state.purchaseTicketCharges.variableCharge+this.state.purchaseTicketCharges.subTotal+this.state.purchaseTicketCharges.vatOnCharges
		).toFixed(2)
	}

	changeNumTickets = (e, i) => {
		let userEvent = this.state.userEvent
		userEvent.tickets[i].buy.numTicketsSought = Number(e.target.value)
	this.setState({
		userEvent: userEvent
	})
	}

	chargeExistingCard = (e) =>{
	e.preventDefault()


	this.setState({message: 'Saving Your Bid. Please Wait...'})
	let objectToSend = {
		waitListData: this.state.userEvent.tickets.filter(e => e.lastMinuteTicket===true && e.buy.numTicketsSought > 0),
		purchaserID: this.state.purchaser,
		userEventID: this.state.userEvent._id,
		replaceExistingCard: this.state.replaceExistingCard,
		cardSaved: this.state.cardDetails.cardSaved
		}

	console.log('objectToSend', objectToSend);


	axios.post(`${process.env.REACT_APP_API}/purchaseWaitList`, objectToSend).then(res => {
		this.setState({message: res.data.message})
	})
	}

	payWithSavedCard = (e, numTicketsSought) =>{
		e.preventDefault()
		this.setState({message: "Checking for tickets. Please Wait..."})

		

		let objectToSend = {
	
			checkForTickets :{				
				numTicketsSought: numTicketsSought,
				purchaser: this.state.purchaser,				
				userEvent: this.state.userEvent._id,
			  },
			  stripeData: {
				amount: this.displayTotal(),
				currency: this.state.currency,
				description: this.state.userEvent.title,
				moneyForColm: this.displayAdminFee()-this.calculateStripeFee(),
				seller: this.state.userEvent.organiser._id,	  
			  },
			  ticketTypesEquivalent: this.state.userEvent.ticketTypesEquivalent,
			  waitListData: this.state.userEvent.tickets.filter(e => e.lastMinuteTicket===true && e.buy.numTicketsSought > 0),
			  cardSaved: this.state.cardDetails.cardSaved,
			  replaceExistingCard: this.state.replaceExistingCard
		
		}
	


		axios.post(`${process.env.REACT_APP_API}/paymentIntent`, objectToSend).then(res => {
			this.setState({message: res.data.message})
		
			if (res.data.success){
				this.props.stripe.handleCardPayment(res.data.clientSecret, {}).then( paymentRes => {
					if(paymentRes.error){
						this.setState({message: paymentRes.error.message})
						axios.post(`${process.env.REACT_APP_API}/deleteTempTickets`, {tickets: res.data.tickets, refunds: res.data.refundRequests, ticketsAlreadyRefunded: res.data.ticketsAlreadyRefunded})//amend to include overdue refunds
						//i've never tested this. also need to include it anywhere else payment might fail
		
						{/*Secuirty Issue: There is a window here for hacker to manually post the tickets to backend to make them valid using updateTicketData controller*/}
		
					}
					else if(paymentRes.paymentIntent.status === 'succeeded'){
						let updateTicketData = {
										purchaser: this.props.purchaser,
										tickets: res.data.tickets,
										ticketsAlreadyRefunded: res.data.ticketsAlreadyRefunded,
										refundRequests: res.data.refundRequests,
										paymentIntentID: paymentRes.paymentIntent.id,
										userEvent: this.props.userEvent._id,
										}
					
					axios.post(`${process.env.REACT_APP_API}/emailTickets`, updateTicketData).then(res => {
						this.setState({message:res.data.message})
							}).catch(err => console.log('create tickets err', err))
		
		
					} else {
						this.setState({
							message: "Payment Failed. You have not been charged"
						})
						console.log('payment failed', paymentRes)
					}
		
			}).catch(err => console.log('handleCardPaymentErr', err))
			}
				})
	}


	replaceExistingCard = (e) => {
		e.preventDefault()
		this.setState({
			replaceExistingCard: true
		})
	}

	upDateMessage = (msg) => {
		this.setState({message: msg})
	}

	waitListChange = (e, field, placeInOriginalArray) => {

		let waitList = this.state.waitList
		let userEvent = this.state.userEvent
		console.log('lmt1', userEvent.tickets[1])
		if (field === 'waitListSpecificDate'){
			console.log('date triggered')
			userEvent.tickets[placeInOriginalArray][field] = e
		}else if(field === 'numTicketsSought'){
			console.log('else if triggered')
					userEvent.tickets[placeInOriginalArray].buy.numTicketsSought = e.target.value
					//can delete this condition when you remove the buy object - it serves no function
			}

		else {
			console.log('else triggered')
			userEvent.tickets[placeInOriginalArray][field] = e.target.value
			console.log('placeInOriginalArray', placeInOriginalArray)
			console.log('field', field)
			console.log('e.target.value', e.target.value)
		}
		console.log('lmt2', userEvent.tickets[1])
		this.setState({userEvent})

	}


  render() {		

	{/**this.state.userEvent.tickets.filter(e => e.finalFewTicket === true).length > 0 || this.state.userEvent.tickets.filter(e => e.ticketTypeID > 0 && e.soldOut === false) )&& <div></div>**/}


	let numTicketsSought = this.state.userEvent.tickets.filter( e => {return e.buy.numTicketsSought > 0}).map(e => {return (
		{
			chargeForTicketsStatus: e.chargeForTicketsStatus,
			chargeForNoShows: e.chargeForNoShows,
			ticketType: e.ticketType,
			ticketTypeID: e.ticketTypeID,
			numTicketsSought: e.buy.numTicketsSought,
			finalFewTicket: e.finalFewTicket,
			lastMinuteTicket: e.lastMinuteTicket,
			resaleOfRefund: e.resaleOfRefund
		}
	)})

	let checkoutForm = 		
		<StripeProvider
			apiKey={process.env.REACT_APP_API_STRIPE_PUBLISH}
			stripeAccount={this.state.userEvent.organiser.stripeAccountID}
		>
			<Elements>		
				<CheckoutForm
					total={this.displayTotal()}
					ticketTypesEquivalent={this.state.userEvent.ticketTypesEquivalent}
					moneyForColm={this.displayAdminFee()-this.calculateStripeFee()}
					currency={this.state.userEvent.currency}
					eventTitle={this.state.userEvent.title}
					purchaser={this.state.purchaser}
					userEvent={this.state.userEvent}
					purchaserID={this.state.purchaser}
					replaceExistingCard={this.state.replaceExistingCard}
					cardSaved={this.state.cardDetails.cardSaved}
					upDateMessage={this.upDateMessage}
					numTicketsSought={numTicketsSought}
				/>
			</Elements>
		
		</StripeProvider>

	let useSavedCardDisplay = 
		<div>
			Would you like to pay for these tickets using {this.state.cardDetails.card} card ending in {this.state.cardDetails.last4}?
			<button onClick={(e) => this.payWithSavedCard(e, numTicketsSought)}>Yes Please</button>
			<button onClick={this.replaceExistingCard}>No, charge a different card</button>
			<div>{this.state.message}</div>
		</div>




	let saveCardDisplay = 
		<StripeProvider apiKey={process.env.REACT_APP_API_STRIPE_PUBLISH}>
			<Elements>
					<SaveCardForm
						cardSaved={this.state.cardDetails.cardSaved}
						currency={this.state.userEvent.currency}
						eventTitle={this.state.userEvent.title}
						purchaserID={this.state.purchaser}	
						replaceExistingCard={this.state.replaceExistingCard}
						message={this.state.message}
						moneyForColm={this.displayAdminFee()-this.calculateStripeFee()}
						numTicketsSought={numTicketsSought}
						seller = {this.state.userEvent.organiser._id}
						stripeAccountID={this.state.userEvent.organiser.stripeAccountID}
						ticketTypesEquivalent = {this.state.userEvent.ticketTypesEquivalent}
						total={this.displayTotal()}
						upDateMessage={this.upDateMessage}
						userEventID={this.state.userEvent._id}
						waitListData={this.state.userEvent.tickets.filter(e => e.lastMinuteTicket===true && e.buy.numTicketsSought > 0)}
					/>
			</Elements>
		</StripeProvider>

	let paymentDisplay

	if (this.state.userEvent.organiser.stripeAccountID !== ''){
		if (this.state.cardDetails.cardSaved === false || this.state.replaceExistingCard === true){
			paymentDisplay = saveCardDisplay
		}else{paymentDisplay = useSavedCardDisplay}
	}

	let locationArray = [this.state.userEvent.venue, this.state.userEvent.address1, this.state.userEvent.address2, this.state.userEvent.address3, this.state.userEvent.address4]

	locationArray.forEach((e,i) => {if(e === ''){locationArray.splice(i,1)}})

	let location = locationArray.join(', ')

	console.log('location', location);
	

		

    return (
      <>
        <Nav />
		<div id='eventImage' >
			<img src={this.state.userEvent.imageURL}/>
			

			<div 	id='eventDetailElements'>
					<div className='eventDetail'><strong>Location: </strong>{location}</div>
					<div className='eventDetail'><strong>Starts: </strong> {moment(this.state.userEvent.startDetails).format("ddd, D MMM YYYY HH:mm")}</div>
					<div className='eventDetail'><strong>Ends: </strong> {moment(this.state.userEvent.endDetails).format("ddd, D MMM YYYY HH:mm")}</div>
					<div className='eventDetail'><strong>Organiser: </strong>The Organiser</div>
					{/* <div><strong>Organiser: </strong>{this.state.userEvent.organiser.name}</div> */}
					<div className='eventDetail'><strong>Cancellation Policy: </strong>{this.state.userEvent.tickets[0].refunds.optionSelected}</div>
			</div>

			
			
		</div>

		<h1 className='centerText'>{this.state.userEvent.title}</h1>

		<div id='buyTicketButton'>
			<button className='primary'>Purchase Tickets</button>
		</div>

		<div className='wrapperToCenter'>
			<div id = 'description'>{this.state.userEvent.description}</div>
		</div>

		<div className = 'sellTickets'>

			{this.state.userEvent.tickets.filter(	e => {return(e.lastMinuteTicket !== true)}).map(	(e,i) => {return (


				// <BuyTicket 
				// 	ticketType={e.ticketType}
				// 	description={e.description}
				// 	price={e.price}
				// 	fine={e.chargeForNoShows}
				// 	quantity={e.buy.numTicketsSought}
				// 	changeQuantity={this.changeQuantity}
				// 	i = {i}
				// />

				<ColmTicket 
					ticketType={e.ticketType}
					description={e.description}
					price={e.price}
					fine={e.chargeForNoShows}
					quantity={e.buy.numTicketsSought}
					changeQuantity={this.changeQuantity}
					i = {i}
				/>

				// <div key={i}>
				// 	<h5>{e.ticketType}</h5>
				// 	<div>{e.ticketDescription}</div>
				// 	{e.chargeForTicketsStatus==='chargeForTickets' ? <div>Price: {this.state.userEvent.currency}{e.price}</div> : <div>Price: Free</div>}
				// 	{e.chargeForNoShows>0 && <div>Fine for securing ticket and not attending: ${this.state.userEvent.currency}${e.chargeForNoShows} per ticket</div>}


				// {e.soldOut ? <div>Sold Out</div> : 
				// 	<div>
				// 		<label>How Many Tickets?</label>
				// 		<input
				// 			value={e.buy.numTicketsSought}
				// 			required
				// 			onChange={(event) => {this.changeNumTickets(event, i); this.calculateTotals({lastMinuteTicket: false})}}
				// 			type="number"
				// 			min={0}
				// 			max={10}
				// 			// change to take account of when there are less tickets
				// 		/>
				// 	</div>
				// }			
				// 	<hr />

				// </div>
					)}	)}

				{this.state.userEvent.tickets.filter(e => e.lastMinuteTicket).length > 0 && <h4>Bid For Tickets</h4>}
				{this.state.userEvent.tickets.filter(e => e.lastMinuteTicket).map(f => {return (
					<LastMinuteTickets
						waitListData={{quantity: f.buy.numTicketsSought,
							maximumPrice: f.price,
							expires: f.waitListExpires,
							specificDate: f.waitListSpecificDate,
							deliverTogether: f.waitListDeliverTogether
						}}
						waitListChange={this.waitListChange}
						currency={this.state.userEvent.currency}
						minimumPrice={f.refunds.minimumPrice}
						placeInOriginalArray={f.placeInOriginalArray}
						calculateTotals={this.calculateTotals}
						ticketType={f.ticketType}
						refundOption={f.refunds.howToResell}
					/>)})}

			</div>		

		

      </>
    );
  }
}

export default Event;

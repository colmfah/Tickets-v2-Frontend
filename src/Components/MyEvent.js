import React from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import axios from "axios";
import TicketSummary from "./TicketSummary";
import moment from "moment";
import EventDetails from "./CreateEventComponents/EventDetails";
import "react-datepicker/dist/react-datepicker.css";
import Image from './CreateEventComponents/Image'
import CreateTickets from './CreateEventComponents/CreateTickets'
import Cancellations from './CreateEventComponents/Cancellations'
import Geocode from "react-geocode"
import AddressDetails from "./CreateEventComponents/AddressDetails";
import { Link } from "react-router-dom";



class MyEvent extends React.Component {
  state = {
        myEvent: {eventPassword: '', image: ''},
        tickets: [],
        emails: [],
        waitList: 0,
        validTicketsOnly: false,
        receivePromotionalMaterial: true,
        eventDetails: {message: '', spin: false},
        addressDetails: {message: '', spin: false},
        image: {message: '', spin: false},
        refunds: {message: '', spin: false},
        ticketChanges: {},
        messsage: '',
        updating: false
  }

  componentDidMount() {
    let token = localStorage.getItem("token");
    axios.post(`${process.env.REACT_APP_API}/myEvent`, {token: token, myEventID: this.props.match.params.id})
      .then(res => {
        this.handleFailure(res.data)
        let tickets = res.data.tickets
        let emails = res.data.emails
        let waitList = res.data.waitList
        let myEvent = res.data.myEvent
        myEvent.totalTicketsCreated = Math.max(myEvent.tickets.map(ticket => ticket.ticketTypeID))
        let ticketChanges = myEvent.tickets.map(ticket => {return {message: '', spin: false}})
        this.setState({tickets, emails, waitList, myEvent, ticketChanges})
      
      }
        )    
  }

  addTicket = () => {		
    this.resetEditMessages()
    let myEvent = this.state.myEvent
    let ticketChanges = this.state.ticketChanges
    ticketChanges.push({message: '', spin: false})
		myEvent.tickets.push({
			chargeForTicketsStatus: '',
			chargeForNoShows: '',
			ticketType: '',
			ticketTypeID: myEvent.totalTicketsCreated + 1,
			price: '',
			numberOfTickets: '',
			sellWhenTicketNumberSoldOut: '',
			startSelling: '',
			stopSelling: '',
			startSellingTime: '',
			stopSellingTime: myEvent.endDetails,
			ticketDescription: '',
      hold: false,
      pauseSales: false,
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
		myEvent.totalTicketsCreated += 1
		this.setState({ myEvent, ticketChanges })
  }
  
  changeSellingTimes = (e, ticketNumber, field1, field2, values) => {

    this.resetEditMessages()


		let myEvent = this.state.myEvent

		myEvent.tickets[ticketNumber][field1] = e.target.value

		if(e.target.value === 'now'){
			myEvent.tickets[ticketNumber][field2] = Date.now()
			
		} else if(e.target.value === 'whenPreviousSoldOut'){
			myEvent.tickets[ticketNumber][field2] = ''
			if(ticketNumber === 1){
				myEvent.tickets[1]['sellWhenTicketNumberSoldOut'] = 1
			}
		} else if(e.target.value === 'eventBegins'){
			myEvent.tickets[ticketNumber][field2] = values.startDetails
		} else if (e.target.value ==='eventEnds'){
			myEvent.tickets[ticketNumber][field2] = values.endDetails
        }else if(e.target.value === 'specific' && field1 === 'startSelling'){			
			myEvent.tickets[ticketNumber][field2] = ''
		}

        this.setState({ myEvent })
        
        this.checkForTimeErrors(ticketNumber, field1, field2, values)
    }

	changeTicketDetails = (e, field, ticketNumber) => {

    this.resetEditMessages()

		let myEvent = this.state.myEvent

		if(e instanceof Date){
			myEvent.tickets[ticketNumber][field] = e
		}else {

			myEvent.tickets[ticketNumber][field] = e.target.value
    }
    
    this.setState({ myEvent })
		this.checkForTicketErrors(field, ticketNumber)
				
  }
  
  checkForDescriptionErrors = (i) =>{
    let myEvent = this.state.myEvent
    myEvent.tickets[i].borderColors.ticketDescription = '#00988f' 
    this.setState({myEvent})
}

  checkForTimeErrors = (i, field1, field2, values, finalCheck) =>{

    let myEvent = this.state.myEvent
    let warning = ''
    if(myEvent.tickets[i][field1] === ''){
        warning = 'Please Select A Time'
    }else if(moment(field2).isAfter(moment(values.endDetails))){
        warning = 'Tickets Cannot Be Sold After Your Event Has Ended'
    }

    
    myEvent.tickets[i].errors[field1] = warning
    let color 
    warning === '' ? color = '#00988f' : color = 'tomato'

    myEvent.tickets[i].borderColors[field1] = color

    if(finalCheck){
        if(warning === 'Please Select A Time'){
            return field1
        }else if(warning === 'Tickets Cannot Be Sold After Your Event Has Ended') {
            return field2
        }
    }

    this.setState({myEvent})

}

  getTicketsSold = (i) => {
    //ed tte - all tickets sold (regardless of refunded status)
    //ed ttne - all valid tickets sold
    //refund by - all valid tickets sold
    if(this.state.myEvent.tickets[0].refunds.optionSelected === 'excessDemand' && this.state.myEvent.ticketTypesEquivalent){
      return this.state.tickets[i].purchased
    }
  }

  checkForCapacityErrors = (warning, field, i) => {
    if(field !== 'numberOfTickets'){return warning}
    let capacity = this.state.myEvent.tickets[i].numberOfTickets
    if(capacity === ''){warning = 'Please Select Number Of Tickets'}
    if(capacity <= 0){warning = 'Value Must Be Positive'}
    if(String(capacity).split('').includes('.')){warning = 'Number Of Tickets Must Be A Whole Number'}
    if(capacity < this.getTicketsSold(i)){warning = `${this.getTicketsSold(i)} tickets have already been purchased`}
    return warning
  }

  stopSellingSpecificTimeErrors = (warning, field, i) => {
    if(field !== 'stopSellingTime' || this.state.myEvent.tickets[i].stopSelling !== 'specific'){return warning}
    let myEvent = this.state.myEvent
    if(myEvent.tickets[i][field] === '' || myEvent.tickets[i][field] === null ){return 'Please Select When You Want To Stop Selling These Tickets' }
    if(moment(myEvent.tickets[i].stopSellingTime).isAfter(moment(myEvent.endDetails))){return 'You Cannot Sell Tickets After The Event Ends'}
    if(myEvent.tickets[i].startSelling!=='whenPreviousSoldOut' &&  !moment(this.state.myEvent.tickets[i].stopSellingTime).isAfter(moment(this.state.myEvent.tickets[i].startSellingTime))){
        return 'You Have Selected To Stop Selling Tickets Before You Start Selling Them'
    }
    return warning
  }

  

  startSellingSpecificTimeErrors = (warning, field, i) => {

    if(field !== 'startSellingTime' || this.state.myEvent.tickets[i].startSelling !== 'specific'){return warning}
    let myEvent = this.state.myEvent
    if(myEvent.tickets[i][field] === '' || myEvent.tickets[i][field] === null ){return' Please Select When You Want To Start Selling These Tickets'} 
    if(moment(myEvent.tickets[i].startSellingTime).isAfter(moment(myEvent.endDetails))){return 'You Cannot Sell Tickets After The Event Ends'}
    return warning
  }

  checkForTicketErrors = (field, i, finalCheck) => {	
      
    let myEvent = this.state.myEvent
    let warning = ''
    if(myEvent.tickets[i][field] === '' || myEvent.tickets[i][field] === null ){
        
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
      }else if(field ==='price'){
          warning = 'Please Select A Price. If Tickets Are Free Select €0'
      }

    }else if((field === 'chargeForNoShows' && myEvent.tickets[i].chargeForNoShows < 0) || (field === 'price' && myEvent.tickets[i].price < 0)){
        warning = 'Value Must Be Positive'

    }else if (field === 'price' && myEvent.tickets[i].price > 0 && myEvent.tickets[i].price < 1){
        warning = 'If Tickets Are Not Free, The Minimum Price Allowed Is €1'
    }
  

    warning = this.checkForCapacityErrors(warning, field, i) 
    warning = this.stopSellingSpecificTimeErrors(warning, field, i)
    warning = this.startSellingSpecificTimeErrors(warning, field, i) 


    // else if (field === 'sellWhenTicketNumberSoldOut'){
    // 	let tickets = this.state.myEvent.tickets.map(f => f.ticketTypeID)

    // 	console.log('tickets', tickets)
    // 	console.log('myEvent.tickets[i].sellWhenTicketNumberSoldOut', Number(myEvent.tickets[i].sellWhenTicketNumberSoldOut));
      
    // 	console.log('!tickets.includes(myEvent.tickets[i].sellWhenTicketNumberSoldOut)', !tickets.includes(myEvent.tickets[i].sellWhenTicketNumberSoldOut));
    // 	console.log('tickets.includes(myEvent.tickets[i].sellWhenTicketNumberSoldOut)', tickets.includes(myEvent.tickets[i].sellWhenTicketNumberSoldOut));
      
      

        //     if(!tickets.includes(Number(myEvent.tickets[i].sellWhenTicketNumberSoldOut))){
        //         warning = 'sellWhenTicketNumberSoldOut'
        //     }

    // }
    

        myEvent.tickets[i].errors[field] = warning
        let color 
        warning === '' ? color = '#00988f' : color = 'tomato'
        myEvent.tickets[i].borderColors[field] = color

        this.setState({myEvent})

        if(finalCheck && warning !== ''){return field}
  }

  pauseSales = (event, index) => {
    event.preventDefault()
    this.resetEditMessages()
    this.updateEvent('pauseSales', index)
  }


  setSpecificTime = (e, i, field) =>{
    console.log(' in setSpecificTime')
    this.resetEditMessages()
    this.resetSpecificTimeErrors(i, field)
    let myEvent = this.state.myEvent       
    myEvent.tickets[i][field] = e   
    this.setState({myEvent})
    this.checkForTicketErrors(field, i)
  }

  resetSpecificTimeErrors = (i, field) => {
    let myEvent = this.state.myEvent
    myEvent.tickets[i].errors[field] = ''
    myEvent.tickets[i].borderColors[field] = '#ececec'
    this.setState({myEvent})
  }


  getEmailAddresses(){
    let emails = this.state.emails
    if(this.state.validTicketsOnly){emails = emails.filter(e => e.validTicket)}
    if(this.state.receivePromotionalMaterial){emails = emails.filter(e => e.receivePromotionalMaterial)}
    emails = emails.map(e=>e.purchaserEmail)
    emails =[...new Set(emails)] 
    return emails.join(', ')
  }
 

  handleFailure(data){
    if(data.success){return}
    if(!data.loggedIn){
      this.props.history.push({
        pathname: "/logIn",
      });
    }
    let message = data.message
    this.setState({message})
  }

  toggleCheckbox(event, checkbox){
    let stateCopy = this.state
    stateCopy[checkbox] = !stateCopy[checkbox]
    let validTicketsOnly = stateCopy.validTicketsOnly
    let promotionalMarketing = stateCopy.promotionalMarketing
    this.setState({validTicketsOnly, promotionalMarketing})
  }

  resetEditMessages = () => {
    let eventDetails = this.state.eventDetails
    let addressDetails = this.state.addressDetails
    let image = this.state.image
    let ticketChanges = this.state.ticketChanges
    let refunds = this.state.refunds
    ticketChanges = ticketChanges.map(e => {
      e.message = ''
      return e
    })
    eventDetails.message = ''
    addressDetails.message = ''
    image.message = ''
    refunds.message = ''
    this.setState({eventDetails, addressDetails, image, refunds })

  }

  changeField = (e, field, field2) => {	
    this.resetEditMessages()
    let myEvent = this.state.myEvent
		if (field === "image") {
			myEvent.image = new FormData()
			myEvent.image.append('file', e.target.files[0])
      this.setState({ myEvent })
    }
    else if (field==='refunds'){ this.handleRefundChange(e, field2)}
		else if (field === "startDetails" || field === "endDetails") {myEvent[field] = e}
		else {myEvent[field] = e.target.value;}
	  this.setState({ myEvent })
  }

  toggleUpdateStatus = () => {
    let updating = this.state.updating
    updating = !updating
    this.setState( {updating })
  }

  updateMainImage = (component) => {
    if(component !== 'image'){return}
    this.toggleUpdateStatus()
    let token = localStorage.getItem("token")
    let image = this.state.myEvent.image
    image.append('token', token)
    image.append('userEventID', this.state.myEvent._id)
    axios.patch(`${process.env.REACT_APP_API}/updateMainImage`, image).then(res => {
      this.displayUpdateMessages(component, res.data.message, false)
      this.updateImagePreview(res)
      this.toggleUpdateStatus()
  })
  }

  updateImagePreview = (res) => {
    if(!res.data.success){return}
    let myEvent = this.state.myEvent
    myEvent.imageURL = res.data.updatedEvent.imageURL
    this.setState({myEvent})
  }

  updateEventData(component, index){
    if(component === 'image'){return}
    this.toggleUpdateStatus()
    let token = localStorage.getItem("token")
    axios.patch(`${process.env.REACT_APP_API}/updateEvent`, {token: token, userEvent: this.state.myEvent, component, index}).then(res => {
      this.displayUpdateMessages(component, res.data.message, false, index)
      this.updatePauseSales(component, index, res)
      this.toggleUpdateStatus()    
    })
  }

  updatePauseSales = (component, index, res) => {
    if(component !== 'pauseSales'){return}
    if(!res.data.success){return}
      let myEvent = this.state.myEvent
      myEvent.tickets[index].pauseSales = res.data.updatedEvent.tickets[index].pauseSales
      this.setState({myEvent})
  }

  displayTicketUpdateMessages = (component, message, spin, index) => {
    let stateCopy = this.state
    stateCopy.ticketChanges[index].message = message
    stateCopy.ticketChanges[index].spin = spin
    this.setState(stateCopy)
  }

  displayUpdateMessages = (component, message, spin, index) =>{
    if(component==='tickets' || component==='pauseSales'){this.displayTicketUpdateMessages(component, message, spin, index); return}
    let stateCopy = this.state
    stateCopy[component].message = message
    stateCopy[component].spin = spin
    this.setState(stateCopy)
  }
  
 
  updateEvent = (component, index) => {
    this.displayUpdateMessages(component, 'Updating: Please Wait', true, index)
    this.updateMainImage(component)
    this.updateEventData(component, index)
  }
  
  
  getLatLng = () => {
    let myEvent = this.state.myEvent        
    Geocode.fromAddress(`${myEvent.venue}, ${myEvent.address1}, ${myEvent.address2}, ${myEvent.address3}, ${myEvent.address4}`).then(response => {            
    const { lat, lng } = response.results[0].geometry.location;
    myEvent.lat = lat
    myEvent.lng = lng 
    this.setState(myEvent)
  })
  }

  getLatLngAfterDrag = (event) => {
    let myEvent = this.state.myEvent
    myEvent.lat = event.latLng.lat()
    myEvent.lng = event.latLng.lng()
    this.setState(myEvent)
  }

  nextStep(){
    console.log('next step')
  }

  prevStep(){
    console.log('prev step')
  }

  handleRefundChange = (e, field)=>{
    this.resetEditMessages()
		let myEvent = this.state.myEvent
		if(field === 'optionSelected' && e.target.value !== 'excessDemand'){
			myEvent.globalRefundOptions.howToResell = 'specific'
		}
		if(e instanceof Date){
			myEvent.globalRefundOptions[field] = e
		}else{   
      myEvent.globalRefundOptions[field] = e.target.value
		}
	
    this.setState({ myEvent })
    
  }
  
  updateRefundData = (e, field) => {
    let myEvent = this.state.myEvent
		field === 'refundUntil' ? myEvent.globalRefundOptions[field] = e : myEvent.globalRefundOptions[field] = e.target.value
		this.setState({ myEvent })
	}


  render() {
	  const{ title, description, region, venue, address1, address2, address3, address4,  currency, startDetails, endDetails, eventPassword, ticketTypesEquivalent, tickets,globalRefundOptions, lat, lng } = this.state.myEvent
    const values = { title, description, region, venue, address1, address2, address3, address4,  currency, startDetails, endDetails, eventPassword, ticketTypesEquivalent, tickets, globalRefundOptions, lat, lng }    
 
    
    return (
      <>
        <Nav />   
        <div className='my-event-container'>
          <div className="my-event-title">
            <header>{this.state.myEvent.title}</header>
            <hr />
            <div className='my-event-details'>Event ID: {this.state.myEvent._id}</div>
            <Link to={`/checkin/${this.state.myEvent._id}`}><button className='create-event-button'>Check In Tickets</button></Link>
          </div>

          <div className="my-event-tickets">
            <div className="my-event-heading">
              <header>Sales Summary</header>
              <hr />
            </div>
            {this.state.tickets.map((ticket, index)=> <TicketSummary ticket = {ticket} key={index}/>)}
          </div>

          <div className="my-event-tickets">
            <div className="my-event-heading">
              <header>Email Addresses</header>
              <hr />
            </div>
            <div className='my-event-checkbox-container'>
            <div>
                <input 
                    type="checkbox" id="receivePromotionalMaterial" name="receivePromotionalMaterial" value="receivePromotionalMaterial" 
                    checked={this.state.receivePromotionalMaterial} onChange={event => this.toggleCheckbox(event, 'receivePromotionalMaterial')}
                  /> 
                  {` Customers who agreed to receive promotional material only`}
              </div>
              <div>
                <input 
                  type="checkbox" id="validTicketsOnly" name="validTicketsOnly" value="validTicketsOnly" 
                  checked={this.state.validTicketsOnly} onChange={event => this.toggleCheckbox(event, 'validTicketsOnly')}
                /> 
                {` Valid tickets only (excludes refunds and failed payment attempts)`}
              </div>

            </div>
              <div className='my-event-emails'>{this.getEmailAddresses()}</div>  
          </div>



          <EventDetails 
   					changeField={this.changeField}	
             nextStep={this.updateEvent}
             values={values}	
             buttonText={'Update'}	
             message={this.state.eventDetails.message}			
             spin={this.state.eventDetails.spin}	 
             amendingEvent={true}
             updating={this.state.updating}
				/>

          <AddressDetails
						changeField={this.changeField}	
						getLatLng={this.getLatLng} 	
						getLatLngAfterDrag={this.getLatLngAfterDrag} 
						nextStep={this.updateEvent}
						values={values}
            buttonText={'Update'}
            message={this.state.addressDetails.message}			
            spin={this.state.addressDetails.spin}	 
            amendingEvent={true}
            updating={this.state.updating}

					/>

          <Image
            imageURL={this.state.myEvent.imageURL}
            resetEditMessages={this.resetEditMessages}
						values={values}
						nextStep={this.updateEvent}
            changeField={this.changeField}
            buttonText={'Update'}
            message={this.state.image.message}			
            spin={this.state.image.spin}	 
            amendingEvent={true}
            updating={this.state.updating}
					/>

          <CreateTickets
						addTicket={this.addTicket}
						changeSellingTimes = {this.changeSellingTimes }
						changeTicketDetails = {this.changeTicketDetails}
						checkForDescriptionErrors={this.checkForDescriptionErrors}
						checkForErrors={this.checkForTicketErrors}
						checkForTimeErrors={this.checkForTimeErrors}
						nextStep={this.updateEvent}
						setSpecificTime={this.setSpecificTime}
            values={values}
            amendingEvent={true}
            pauseSales={this.pauseSales}
            message={this.state.ticketChanges}			
            spin={this.state.ticketChanges}	 
            updating={this.state.updating}
            getTicketsSold={this.getTicketsSold}
            displayUpdateMessages = {this.displayTicketUpdateMessages}
					/>

        <Cancellations		
          changeField = {this.changeField}
					nextStep={this.updateEvent}
					values={values}
					errorMessage={''}
          message = {this.state.refunds.message}
          amendingEvent={true}
          displaySpinner = {this.state.refunds.spin}
          updating={this.state.updating}
          updateRefundData={this.updateRefundData}
          handleRefundChange={this.handleRefundChange}
				/>
        </div>


          

        <Footer />
        </>
  
    )    
  }
}

export default MyEvent;




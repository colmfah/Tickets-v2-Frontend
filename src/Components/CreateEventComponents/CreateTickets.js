import React, { Component } from 'react'
import Nav from "../Nav";
import DatePicker from "react-datepicker";
import Footer from "../Footer";

export class CreateTickets extends Component {

    state = {
        errors: [],
        newTicketCreated: false,
        ticketsCreated: 1,
        tickets:[{
            ticketType: '',
            ticketNumber: 1,
            ticketDescription: '',
            chargeForTicketsStatus: '',
            chargeForNoShows: '',
            price: '',
            hold: '',
            startSelling: '',
            startSellingTime: '',
            stopSelling: '',
            stopSellingTime: '',
            sellWhenTicketNumberSoldOut: '',
            numberOfTickets: '',
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
        }]
    }

    componentDidUpdate(prevProps, prevState){

      
    }



    continue = (values) => {

        let errors = []

        values.tickets.forEach((e,i) => {

                        

            let ticketErrors = [i]

            ticketErrors.push( this.props.checkForErrors( 'ticketType', i, true)  )
            ticketErrors.push(  this.props.checkForErrors( 'startSelling', i, true)  )
            ticketErrors.push(  this.props.checkForErrors( 'stopSelling', i, true)  )   
            ticketErrors.push(  this.props.checkForErrors( 'numberOfTickets', i, true)  )
            ticketErrors.push(  this.props.checkForTimeErrors(i, 'startSelling', 'startSellingTime', values, true) )
            ticketErrors.push(  this.props.checkForTimeErrors(i, 'stopSelling', 'stopSellingTime', values, true) )

            


            if(e.chargeForTicketsStatus === 'freeTickets'){
                ticketErrors.push(  this.props.checkForErrors( 'chargeForNoShows', i, true)  )
            }else{
                ticketErrors.push(  this.props.checkForErrors( 'price', i, true)  )
            }

            if(e.chargeForNoShows > 0){
                ticketErrors.push(  this.props.checkForErrors( 'hold', i, true)  )
            }

            if(e.startSelling ==='whenPreviousSoldOut'){
                ticketErrors.push(  this.props.checkForErrors( 'sellWhenTicketNumberSoldOut', i, true)  )

                
            }else if(e.startSelling === 'specific'){
                ticketErrors.push(  this.props.startSellingSpecificTimeErrors (i, 'startSellingTime', values) )
            }else if(e.startSelling ==='whenPreviousSoldOut'){
                
                this.checkTicketExists(e)
            }

            if(e.stopSelling === 'specific'){
                ticketErrors.push(  this.props.stopSellingSpecificTimeErrors (i, 'stopSellingTime', values) )
            }

        

            

            errors.push(ticketErrors)
            
        })

        errors = errors.map(e => e.filter(f => f!== undefined))
        errors = errors.filter(e => e.length>1)
        
        if(errors.length === 0){

            this.props.nextStep() 

        }else{
            document.getElementById(`ticket${errors[0][0]}`).getElementsByClassName(errors[0][1])[0].scrollIntoView({behavior: "smooth"})
        } 


        
    }

    
    
   

    displayPreviousTickets = (values, i) => {
        if(values.tickets[i].startSelling !== 'whenPreviousSoldOut' || i<=1){return}
        return (
            <div>
                <p className="create-event-warning sellWhenTicketNumberSoldOut">{values.tickets[i].errors.sellWhenTicketNumberSoldOut}</p>  
                <div className="create-event-radio-container"  style={{borderColor: values.tickets[i].borderColors.sellWhenTicketNumberSoldOut  }}> 
                    <div>Which Ticket?</div> 
                    <div className='create-event-radio-wrapper'>          
                        {values.tickets.filter((e, ind) => ind<i).map(	(e, index) =>  
                            <div key={index}>
                                <input
                                    type="radio"
                                    checked={Number(values.tickets[i].sellWhenTicketNumberSoldOut)===e.ticketTypeID}
                                    value={e.ticketTypeID}
                                    onChange={event => this.props.changeTicketDetails(event, 'sellWhenTicketNumberSoldOut', i)}
                                /> 
                                {e.ticketType === '' ? ` ${this.numberToOrdinal(index+1)} Ticket` : ` ${e.ticketType}`}
                            </div>
                            )}
                    </div>  
                </div> 
            </div>
        )        
    }

    textForPreviousTicketOption(index, values){
        
        if(index === 0){return}
        if(index === 1){
            let ticketName = values.tickets[0].ticketType
            if(ticketName === ''){return ' When all of the first tickets are sold out'}
            // if(ticketName === ''){return ` When all of the first tickets are sold out`}
            return ` When ${ticketName} tickets are sold out`
        }
        return ` When a previous ticket is sold out`

    }

    displayPreviousTicketOption(index, values){
        if(index === 0){return}
        return (
      
            <input
                type="radio"
                checked={values.tickets[index].startSelling==='whenPreviousSoldOut'}
                value="whenPreviousSoldOut"
                onChange={event => this.props.changeSellingTimes(event, index, 'startSelling', 'startSellingTime', values)}
            /> 
        )
    }

    displaySpecificStartSellingOption(index, values){
        if(values.tickets[index].startSelling !== 'specific'){return}
        return(
            // 
        <div className="create-ticket-date-picker" style={{ borderColor: values.tickets[index].borderColors.startSellingTime }} >
                <DatePicker
                    timeIntervals={15}
                    onBlur={() => this.props.startSellingSpecificTimeErrors (index, 'startSellingTime', values)}
                    onChange={event => this.props.setSpecificTime(event, index, 'startSellingTime', values)}
                    selected={values.tickets[index].startSellingTime}
                    placeholderText='Select Date And Time'
                    showTimeSelect
                    dateFormat="Pp"
                    required
                    
                    />
        </div>)
    }

    displaySpecificStopSellingOption(index, values){
        if(values.tickets[index].stopSelling !== 'specific'){return}
        return (<div>
            <p className="create-event-warning stopSellingTime">{values.tickets[index].errors.stopSellingTime}</p>
            <div className="create-ticket-date-picker" style={{ borderColor: values.tickets[index].borderColors.stopSellingTime }}>  
                <DatePicker
                    className="datePicker"
                    timeIntervals={15}
                    onChange={event => this.props.setSpecificTime(event, index, 'stopSellingTime', values)}
                    onBlur={()=> this.props.stopSellingSpecificTimeErrors(index, 'stopSellingTime', values)}
                    selected={values.tickets[index].stopSellingTime}
                    placeholderText='Select Date And Time'
                    showTimeSelect
                    dateFormat="Pp"
                    required
                />
            </div>
        </div>)
    }

    displayDeleteTicketButton(index, values){
        if(values.tickets.length <= 1){return}
        return( 
            <button
                className = "create-event-button delete-ticket-button" 
                onClick={(event)=> this.props.deleteTicket(event, index) }>Delete Ticket
            </button>
        ) 
    }

    numberToOrdinal(n){
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
      };


    render() {

        const {values} = this.props

        return (
            <div className="create-event-container">
                <Nav />
                <div className="create-ticket-heading">
                    <header>Create Event</header>
                    <hr />
                </div>    
                <div className='create-events-tickets-container'>
                    {values.tickets.map((e, i) => 
                    <div key={i} className="create-ticket-form" id={`ticket${i}`}>
                        <form>
                            <div className="create-ticket-number-heading">
                                <header>{`${this.numberToOrdinal(i+1)} Ticket`}</header>
                                <hr />
                            </div>   
                            <p className="create-event-warning ticketType">{values.tickets[i].errors.ticketType}</p>
                                <input
                                    required
                                    type="text"
                                    value={values.tickets[i].ticketType}
                                    onBlur={() => this.props.checkForErrors('ticketType', i, false)}
                                    onChange={event => this.props.changeTicketDetails(event, 'ticketType', i)}
                                    placeholder="Ticket Name eg. General Admission"
                                    style={{borderColor: values.tickets[i].borderColors.ticketType}}
                                />     
                            <p className="create-event-warning" >{values.tickets[i].errors.ticketDescription}</p>
                            <textarea
                                id="create-event-ticket-description"
                                type="text"
                                value={values.tickets[i].ticketDescription}
                                onBlur={() => this.props.checkForDescriptionErrors(i)}
                                onChange={event => this.props.changeTicketDetails(event, 'ticketDescription', i)}
                                placeholder="Ticket Description (optional)"
                                style={{borderColor: values.tickets[i].borderColors.ticketDescription}}
                            />          
                            <p className="create-event-warning price">{values.tickets[i].errors.price}</p>
                                <input
                                    required
                                    type="number"
                                    value={values.tickets[i].price}
                                    onChange={event => this.props.changeTicketDetails(event, 'price', i)}
                                    onBlur={() => this.props.checkForErrors('price', i)}
                                    placeholder="Price (€)"
                                    min={0}
                                    style={{borderColor: values.tickets[i].borderColors.price}}
                                />

                           
                                
                            <p className="create-event-warning numberOfTickets">{values.tickets[i].errors.numberOfTickets}</p>
                            <input
                                required
                                type="number"
                                step="1" 
                                
                                value={values.tickets[i].numberOfTickets}
                                onChange={event => this.props.changeTicketDetails(event, 'numberOfTickets', i)}
                                onBlur={() => this.props.checkForErrors('numberOfTickets', i)}
                                placeholder="Number of Tickets"
                                style={{borderColor: values.tickets[i].borderColors.numberOfTickets }}
                            />
                            <p className="create-event-warning startSelling">{values.tickets[i].errors.startSelling}</p>
                            <div className="create-event-radio-container" style={{borderColor: values.tickets[i].borderColors.startSelling  }}>
                                <div>Start Selling Tickets</div> 
                                <div className='create-event-radio-wrapper' >
                                    <div>
                                        <input
                                            type="radio"
                                            checked={values.tickets[i].startSelling==='now'}
                                            value="now"
                                            onChange={event => this.props.changeSellingTimes(event, i, 'startSelling', 'startSellingTime', values)}
                                        />
                                        {` Now`}
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            checked={values.tickets[i].startSelling==='specific'}
                                            value="specific"
                                            onChange={event => this.props.changeSellingTimes(event, i, 'startSelling', 'startSellingTime', values)}
                                        /> 
                                        {` At a specific time`}
                                    </div>
                                    <div>
                                        {this.displayPreviousTicketOption(i, values)}
                                    
                                        {this.textForPreviousTicketOption(i, values)}
                               
                                    </div>
                                    
                                </div>
                            </div>
                            <p className="create-event-warning startSellingTime">{values.tickets[i].errors.startSellingTime}</p>

                            {this.displaySpecificStartSellingOption(i, values)}
                            {this.displayPreviousTickets(values, i)}


                            <p className="create-event-warning stopSelling">{values.tickets[i].errors.stopSelling}</p>
                            <div className="create-event-radio-container"   style={{borderColor: values.tickets[i].borderColors.stopSelling  }}>
                                <div>Stop Selling Tickets</div> 
                                <div className='create-event-radio-wrapper'>
                                    <div>
                                        <input
                                            type="radio"
                                            checked={values.tickets[i].stopSelling==='eventBegins'}
                                            value="eventBegins"
                                            onChange={event => this.props.changeSellingTimes(event, i, 'stopSelling', 'stopSellingTime', values)}
                                        />
                                        {` When event begins`}
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            checked={values.tickets[i].stopSelling==='eventEnds'}
                                            value="eventEnds"
                                            onChange={event => this.props.changeSellingTimes(event, i, 'stopSelling', 'stopSellingTime', values)}
                                        />{` When event ends`}
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            checked={values.tickets[i].stopSelling==='specific'}
                                            value="specific"
                                            onChange={event => this.props.changeSellingTimes(event, i, 'stopSelling', 'stopSellingTime', values)}
                                        />
                                        {` At a specific time`} 
                                    </div> 
                                </div>                              
                            </div>     
                            {this.displaySpecificStopSellingOption(i, values)}  
                            {this.displayDeleteTicketButton(i, values)}                     
                        </form>
                    </div>
                    )}
                </div>

          


                <div className="create-tickets-button-container">
                    <button className="create-event-button create-ticket-button green-button"  onClick={this.props.addTicket}>Create Another Ticket</button>
                

                    <div className="create-event-button-container">
                        <button className="create-event-button create-ticket-button" onClick={this.props.prevStep}>Go Back</button>
                        <button className="create-event-button create-ticket-button" onClick={event => this.continue(values)}>Continue</button>   
                    </div>
                </div>

            
        <Footer />
    </div>
        )
    }
}

export default CreateTickets

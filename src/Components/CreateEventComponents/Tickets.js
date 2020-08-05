import React, { Component } from 'react'
import Nav from "../Nav";
import DatePicker from "react-datepicker";
import moment from "moment";

export class Test extends Component {

    state = {
        errors: []
    }


    continue = (e, values) => {
        e.preventDefault()
        console.log('values.endDetails', values.endDetails)
        console.log('e.stopSelling', e.stopSelling);
        console.log('moment(e.stopSelling).isAfter(values.endDetails)', moment(e.stopSellingTime).isAfter(values.endDetails));
        
        
        
        const checkForErrors = (values) => {            
            let errors = []
            let validTicketTypeIDs = values.tickets.map(e=>e.ticketTypeID)
            values.tickets.forEach((e,i) => {
                if(e.ticketType === ''){
                    errors.push(`Please provide a name for ticket ${i+1}`)
                } 
                if(e.numberOfTickets === ''){
                    errors.push(`Please fill out the number of tickets you wish to sell for ticket ${i+1}`)
                } 
                if(e.startSelling === ''){
                    errors.push(`Please fill out the time to start selling ticket ${i+1}`)
                }
                if(e.stopSelling === ''){
                    errors.push(`Please fill out the time to stop selling ticket ${i+1}`)
                }
                if(e.chargeForTicketsStatus === ''){
                    errors.push(`Please select whether ticket ${i+1} is a paid ticket or free ticket`)
                }
                if(e.chargeForTicketsStatus === 'freeTickets' && e.chargeForNoShows === ''){
                    errors.push(`Please fill out how much you want to fine customers who don't turn up for ticket ${i+1}`)
                }else if (e.chargeForTicketsStatus !== 'freeTickets' && e.price === ''){
                    errors.push(`Please fill out the price for ticket ${i+1}`)
                }

                if(e.chargeForTicketsStatus === 'freeTickets' && e.chargeForNoShows > 0 && e.hold === ''){
                    errors.push(`Please select how to fine customers who purchase ticket ${i+1} but don't turn up`)
                }

                if( e.startSelling!=="whenPreviousSoldOut" && !moment(e.stopSellingTime).isAfter(e.startSellingTime)){

                    errors.push(`You have chosen to stop selling ticket ${i+1} before the time you have chosen to start selling them`)
                }
                if(moment(e.stopSellingTime).isAfter(values.endDetails)){
                    errors.push(`You are continuing to sell ticket ${i+1} when the event is over. Please change your stop selling time`)
                }
                if(e.startSelling ==='whenPreviousSoldOut' && !validTicketTypeIDs.includes(Number(e.sellWhenTicketNumberSoldOut))){

                    console.log('validTicketTypeIDs', validTicketTypeIDs)
                    console.log('e.sellWhenTicketNumberSoldOut', e.sellWhenTicketNumberSoldOut);
                    
                    

                    errors.push(`You have chosen not to sell ticket ${i+1} until a ticket that doesn't exist sells out`)
                }
            })

            if(values.tickets.length > 1 && values.ticketTypesEquivalent === ''){
                errors.push(`Please select whether or not your ticket types are equivalent`)
            }

            return errors
        }

        let errors = checkForErrors(values)

        errors.length === 0 ? this.props.nextStep() : this.setState({errors})
        
    }

    goBack = (e) => {
        
     
        this.props.prevStep()
    }

    render() {
        const {values} = this.props

        let chargeForTicketsStatusColor = values.tickets.map(e => {
            if(e.chargeForTicketsStatus === ''){return 'rgb(118, 118, 118)'}else{return 'black'}
        })
        let holdColor = values.tickets.map(e => {
            if(e.hold === ''){return 'rgb(118, 118, 118)'}else{return 'black'}
        })
        let startSellingColor = values.tickets.map(e => {
            if(e.startSelling === ''){return 'rgb(118, 118, 118)'}else{return 'black'}
        })
        let stopSellingColor = values.tickets.map(e => {
            if(e.startSelling === ''){return 'rgb(118, 118, 118)'}else{return 'black'}
        })
        let sellWhenTicketNumberSoldOutColor = values.tickets.map(e => {
            if(e.sellWhenTicketNumberSoldOut=== ''){return 'rgb(118, 118, 118)'}else{return 'black'}
        })



        let startSelling = values.tickets.map((e,i) => {
            if(e.startSelling === 'whenPreviousSoldOut'){
                
                if(i===1){return(<div className="group"></div>)
                }else{
    
                    return(
                        <div className="group">
                            <select
                                required
                                value={values.tickets[i].sellWhenTicketNumberSoldOut}
                                onChange={(event) => {this.props.changeTicketDetails(event, 'sellWhenTicketNumberSoldOut', i)}}
                                style={{ color: sellWhenTicketNumberSoldOutColor[i] }}
                            >
                
                                <option value=''>When which ticket is sold out?</option>
                    
                                {values.tickets.filter((e, ind) => ind<i).map(	(e, index) => {
                                    return (
                                        <option key={index} value={e.ticketTypeID}>
                                            {e.ticketType}
                                        </option>
                                    )}	
                                )}
                            </select>   
                        </div>
                    )

                }
   
            } else if(e.startSelling == 'specific'){
                return(
                    <div className="group">                 
                        <DatePicker
                            timeIntervals={15}
                            onChange={event => this.props.changeTicketDetails(event, 'startSellingTime', i)}
                            selected={e.startSellingTime}
                            placeholderText='Select Date And Time'
                            showTimeSelect
                            dateFormat="Pp"
                            required
                            />
                    </div>
                )
            }else{return <div className="group"></div>}
        })



        


        return (
            <> 

                <Nav />
                <div className="grid center middle longForm">
                    <div></div>
                    <div className="wrapper">
                    {values.tickets.map((e, i) => {
                        return (
 
                                <div class ="content">
                                    <div 
                                        className="ticketNumber"
                                        style={{display: values.tickets.length === 1? 'none' : 'block' }}
                                    >
                                        {i+1}
                                    </div> 
                                    <form key={i}>
                                        
                                         
                                        <div className="group">
                                            <input
                                                required
                                                type="text"
                                                value={values.tickets[i].ticketType}
                                                onChange={event => this.props.changeTicketDetails(event, 'ticketType', i)}
                                                placeholder="Ticket Name eg. General Admission"
                                            />     
                                        </div>
                                        <div className="group">
                                            <textarea
                                                type="text"
                                                value={values.tickets[i].ticketDescription}
                                                onChange={event => this.props.changeTicketDetails(event, 'ticketDescription', i)}
                                                placeholder="Ticket Description (optional)"
                                            />          
                                        </div>


                                        <div className="group">					          
                                            <select
                                                required 
                                                value={values.tickets[i].chargeForTicketsStatus}			
                                                onChange={event => this.props.changeTicketDetails(event, 'chargeForTicketsStatus', i)}
                                                style={{ color: chargeForTicketsStatusColor[i] }}
                                            >
                                            <option value="" disabled>Select Ticket Type</option>
                                            <option value="chargeForTickets" disabled>Charge For Tickets</option>
                                            <option value="freeTickets">Free Tickets</option>
                                            
                                            </select>
                                        </div>


                                        {values.tickets[i].chargeForTicketsStatus === 'freeTickets' ?
                                            <div className="group">
                                                <input
                                                    required
                                                    type="number"
                                                    value={values.tickets[i].chargeForNoShows}
                                                    onChange={event => this.props.changeTicketDetails(event, 'chargeForNoShows', i)}
                                                    placeholder="Fine for customers who don't show up (€)"
                                                    min={0}
                                                />     
                                            </div>

                                            :

                                            <div className="group">
                                                <input
                                                    required
                                                    type="number"
                                                    value={values.tickets[i].price}
                                                    onChange={event => this.props.changeTicketDetails(event, 'price', i)}
                                                    placeholder="Price (€)"
                                                    min={1}
                                                />
                                            </div>
                                        
                                        }

                                        {values.tickets[i].chargeForNoShows > 0 ? 
                                        <div className="group">
                                            <select
                                                required 
                                                value={values.tickets[i].hold}			
                                                onChange={event => this.props.changeTicketDetails(event, 'hold', i)}
                                                style={{ color: holdColor[i] }}
                                            >
                                                <option value="" disabled>Select How To Fine Customers</option>
                                                <option value="hold">Place hold on customers' credit credit before event begins</option>
                                                <option value="noHold">Trust customers to provide chargable credit card (no hold placed)</option>
                                            </select>
                                        </div>
                                        : <div className="group"></div>        
                                        }	

                                        <div className="group">          
                                            <input
                                                required
                                                type="number"
                                                min={1}
                                                value={values.tickets[i].numberOfTickets}
                                                onChange={event => this.props.changeTicketDetails(event, 'numberOfTickets', i)}
                                                placeholder="Number of Tickets"
                                            />
                                        </div>

                                        <div className="group">       
                                            <select
                                                required 
                                                value={values.tickets[i].startSelling}
                                                onChange={event => this.props.changeSellingTimes(event, 'startSelling', i, 'startSellingTime', values.tickets.length)}
                                                style={{ color: startSellingColor[i] }}
                                            >
                                                <option value='' disabled>Start Selling Tickets</option>
                                                <option value="now">Now</option>
                                                <option value="specific">Specific Date and Time</option>
                                                {i===1 ? <option value="whenPreviousSoldOut">When {values.tickets[0].ticketType} Is Sold Out</option>:<option value="whenPreviousSoldOut" disabled={i==0}>When A Previous Ticket Is Sold Out</option>}  
                                            </select>
                                        </div>

                                        {startSelling[i]}



                                        <div className="group">
                                            <select
                                                required 
                                                value={values.tickets[i].stopSelling}
                                                onChange={event => this.props.changeSellingTimes(event, 'stopSelling', i, 'stopSellingTime')}
                                                style={{ color: stopSellingColor[i] }}
                                            >
                                                <option value='' disabled>Stop Selling Tickets</option>
                                                <option value="eventBegins">When Event Begins</option>
                                                <option value="eventEnds">When Event Ends</option>
                                                <option value="specific">At Specific Date and Time</option>
                                            </select>
                                        </div>


                                        {values.tickets[i].stopSelling == 'specific'  ?
                                            <div className="group">
                                                    <DatePicker
                                                        timeIntervals={15}
                                                        onChange={event => this.props.changeTicketDetails(event, 'stopSellingTime', i)}
                                                        selected={values.tickets[i].stopSellingTime}
                                                        placeholderText='Select Date And Time'
                                                        showTimeSelect
                                                        dateFormat="Pp"
                                                        required
                                                    />
                                            </div>
                                            : <div className = "group"></div>
                                        }

                                        {values.tickets.length > 1 &&
                                            <button
                                                className = "secondary" 
                                                onClick={event => this.props.deleteTicket(event, i) }>Delete Ticket
                                            </button>
                                        }
                                                        
                                    
                                    </form>
                            
                            
                                </div>
                
                        )
                    })}

                    
                        <button className="primary" onClick={(e) => this.props.addTicket(e)}>Create Another Ticket</button>
                    <div className="buttonContainer">
                        <button className="primary" onClick={event => this.continue(event, values)}>Continue</button>   
                        <button className="secondary rhsbutton" onClick={event => this.goBack(event)}>Go Back</button>
                    </div>

                    </div>

                    

                    {/* {values.tickets.length > 1 && 		

                        <div className="group">
                            <select
                                required
                                value={values.ticketTypesEquivalent}
                                onChange={event => this.props.changeField(event, 'ticketTypesEquivalent', true)}
                            >
                                <option value='' disabled>Are all ticket types equivalent to each other when customers enter the event?</option>
                                <option value={true}>Yes - eg. Early Bird, General Admission etc.</option>
                                <option value={false}>No - eg. Backstage Access, VIP Treatment etc.</option>
                            </select>

                        </div>
                     } */}

               
                  
                    <div></div>
                </div>
           
            {this.state.errors.map((e,i) => <div key={i}>{e}</div>)}
            </>
        )
    }
}

export default Test

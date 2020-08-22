import React, { Component } from 'react'
import Nav from "../Nav";
import DatePicker from "react-datepicker";
import moment from "moment";

export class Test extends Component {

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

        //copy values from parent state....if component updated for reason other than newTicketCreated...what about warnings?

        if(this.state.newTicketCreated){		
            document.getElementById(`ticket${this.state.tickets.length -1}`).scrollIntoView({behavior: "smooth"})
            let stateCopy = this.state
            stateCopy.newTicketCreated = false
            this.setState(stateCopy)
        }

        console.log('component did mount')
    }



    continue = (values) => {


        


   
        
        let errors = []

        values.tickets.forEach((e,i) => {

            console.log('e.startSelling', e.startSelling)
            console.log('i', i);
            console.log('---------');
            
            

            let ticketErrors = [i]

            ticketErrors.push( this.props.checkForErrors( 'ticketType', i, true)  )
            ticketErrors.push(  this.props.checkForErrors( 'chargeForTicketsStatus', i, true)  )
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
                console.log('else if triggered');
                
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
            console.log('ticket', `ticket${errors[0][0]}`);
            console.log('error', errors[0][1]);
            document.getElementById(`ticket${errors[0][0]}`).getElementsByClassName(errors[0][1])[0].scrollIntoView({behavior: "smooth"})
        } 


        
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
            if(e.stopSelling === ''){return 'rgb(118, 118, 118)'}else{return 'black'}
        })
        let sellWhenTicketNumberSoldOutColor = values.tickets.map(e => {
            if(e.sellWhenTicketNumberSoldOut=== ''){return 'rgb(118, 118, 118)'}else{return 'black'}
        })

        let numberOfTicketsColor = values.tickets.map(e => {
            if(e.numberOfTickets === ''){return 'rgb(118, 118, 118)'}else{return 'black'}
        })




        return (
            <> 

                <div className="pageGrid3Rows">

                    <div className="navBar"><Nav /></div>

                    <div id="centerTicketsInRow">

                        <div></div>
                        <div className="wrapper">
                 
                            {values.tickets.map((e, i) => {
                                return (
    
                                    <div className = "content threeRowGridToCenterContent" id={`ticket${i}`} >
                                        <div></div>
                                        <div>
   
                                            <div 
                                                className="ticketNumber"
                                                style={{display: values.tickets.length === 1? 'none' : 'block' }}
                                            >
                                                {i+1}
                                            </div> 

                                            <form key={i}>
                                                <p className="warning ticketType">{values.tickets[i].errors.ticketType}</p>
                                                <div className="group">
                                                    <input
                                                        required
                                                        type="text"
                                                        value={values.tickets[i].ticketType}
                                                        onBlur={() => this.props.checkForErrors('ticketType', i, false)}
                                                        onChange={event => this.props.changeTicketDetails(event, 'ticketType', i)}
                                                        onFocus={() => this.props.turnBorderOrange( 'ticketType', i)}
                                                        placeholder="Ticket Name eg. General Admission"
                                                        style={{borderColor: values.tickets[i].borderColors.ticketType}}
                                                    />     
                                                </div>

                                                <p className="warning" >{values.tickets[i].errors.ticketDescription}</p>
                                                <div className="group">
                                                    <textarea
                                                        type="text"
                                                        value={values.tickets[i].ticketDescription}
                                                        onBlur={() => this.props.checkForDescriptionErrors(i)}
                                                        onChange={event => this.props.changeTicketDetails(event, 'ticketDescription', i)}
                                                        onFocus={() => this.props.turnBorderOrange( 'ticketDescription', i)}
                                                        placeholder="Ticket Description (optional)"
                                                        style={{borderColor: values.tickets[i].borderColors.ticketDescription}}
                                                    />          
                                                </div>

                                                <p className="warning chargeForTicketsStatus" >{values.tickets[i].errors.chargeForTicketsStatus}</p>
                                                <div className="group">					          
                                                    <select
                                                        required 
                                                        value={values.tickets[i].chargeForTicketsStatus}
                                                        onBlur={() => this.props.checkForErrors('chargeForTicketsStatus', i)}
                                                        onChange={event => this.props.changeTicketDetails(event, 'chargeForTicketsStatus', i)}
                                                        onFocus={() => this.props.turnBorderOrange( 'chargeForTicketsStatus', i)}			
                                                        style={{ color: chargeForTicketsStatusColor[i], borderColor: values.tickets[i].borderColors.chargeForTicketsStatus }}
                                                    >
                                                    <option value="" disabled>Select Ticket Type</option>
                                                    <option value="chargeForTickets" disabled>Charge For Tickets</option>
                                                    <option value="freeTickets">Free Tickets</option>
                                                    
                                                    </select>
                                                </div>


                                                {values.tickets[i].chargeForTicketsStatus === 'freeTickets' ?
                                                    <div>
                                                        <p className="warning chargeForNoShows" >{values.tickets[i].errors.chargeForNoShows}</p>
                                                        <div className={values.tickets[i].chargeForNoShows === '' ? "group" : "group currencyInput"}>
                                                            <input
                                                                required
                                                                type="number"
                                                                value={values.tickets[i].chargeForNoShows}
                                                                onChange={event => this.props.changeTicketDetails(event, 'chargeForNoShows', i)}
                                                                onBlur={() => this.props.checkForErrors('chargeForNoShows', i)}
                                                                onFocus={() => this.props.turnBorderOrange( 'chargeForNoShows', i)}	
                                                                placeholder="Fine for customers who don't show up"
                                                                min={0}
                                                                style={{borderColor: values.tickets[i].borderColors.chargeForNoShows}}
                                                            />     
                                                        </div>
                                                    </div>

                                                    :
                                                    <div>
                                                        <p className="warning price">{values.tickets[i].errors.price}</p>
                                                        <div className="group">
                                                            <input
                                                                required
                                                                type="number"
                                                                value={values.tickets[i].price}
                                                                onChange={event => this.props.changeTicketDetails(event, 'price', i)}
                                                                onBlur={() => this.props.checkForErrors('price', i)}
                                                                onFocus={() => this.props.turnBorderOrange( 'price', i)}	
                                                                placeholder="Price"
                                                                min={0}
                                                                style={{borderColor: values.tickets[i].borderColors.price}}
                                                            />
                                                        </div>
                                                    </div>
                                                
                                                }

                                                {values.tickets[i].chargeForNoShows > 0 ? 
                                                <div>
                                                    <p className="warning hold">{values.tickets[i].errors.hold}</p>
                                                    <div className="group">
                                                        <select
                                                            required 
                                                            value={values.tickets[i].hold}			
                                                            onChange={event => this.props.changeTicketDetails(event, 'hold', i)}
                                                            onBlur={() => this.props.checkForErrors('hold', i)}
                                                            onFocus={() => this.props.turnBorderOrange( 'hold', i)}	
                                                            style={{ color: holdColor[i], borderColor: values.tickets[i].borderColors.hold }}          
                                                        >
                                                            <option value="" disabled>Place hold on customers' credit credit?</option>
                                                            <option value="hold"> Yes</option>
                                                            <option value="noHold">No</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                : <div className="group"></div>        
                                                }	

                                                <p className="warning numberOfTickets">{values.tickets[i].errors.numberOfTickets}</p>
                                                <div className="group">          
                                                    <input
                                                        required
                                                        type="number"
                                                        min={1}
                                                        value={values.tickets[i].numberOfTickets}
                                                        onChange={event => this.props.changeTicketDetails(event, 'numberOfTickets', i)}
                                                        onBlur={() => this.props.checkForErrors('numberOfTickets', i)}
                                                        onFocus={() => this.props.turnBorderOrange( 'numberOfTickets', i)}	
                                                        placeholder="Number of Tickets"
                                                        style={{ color: numberOfTicketsColor[i], borderColor: values.tickets[i].borderColors.numberOfTickets }}
                                                    />
                                                </div>

                                                <p className="warning startSelling">{values.tickets[i].errors.startSelling}</p>
                                                <div className="group">       
                                                    <select
                                                        required 
                                                        value={values.tickets[i].startSelling}
                                                        onBlur={() => this.props.checkForErrors('startSelling', i)}
                                                        onChange={event => this.props.changeSellingTimes(event, i, 'startSelling', 'startSellingTime', values)}
                                                        onFocus={() => this.props.turnBorderOrange( 'startSelling', i)}
                                                        style={{ color: startSellingColor[i], borderColor: values.tickets[i].borderColors.startSelling  }}
                                                    >
                                                        <option value='' disabled>Start Selling Tickets</option>
                                                        <option value="now">Now</option>
                                                        <option value="specific">Specific Date and Time</option>
                                                        {i===1 ? <option value="whenPreviousSoldOut">When {values.tickets[0].ticketType} Is Sold Out</option>:<option value="whenPreviousSoldOut" disabled={i==0}>When A Previous Ticket Is Sold Out</option>}  
                                                    </select>
                                                </div>

                                    

                                            
                    
            
        
        

                                                <p className="warning sellWhenTicketNumberSoldOut">{values.tickets[i].errors.sellWhenTicketNumberSoldOut}</p>
                                                {(values.tickets[i].startSelling === 'whenPreviousSoldOut' && i!==1) && 
                                                    <div className="group">
                                                        <select
                                                            required
                                                            value={values.tickets[i].sellWhenTicketNumberSoldOut}
                                                            onBlur={() => this.props.checkForErrors('sellWhenTicketNumberSoldOut', i)}
                                                            onChange={event => this.props.changeTicketDetails(event, 'sellWhenTicketNumberSoldOut', i)}
                                                            onFocus={() => this.props.turnBorderOrange( 'sellWhenTicketNumberSoldOut', i)}
                                                            style={{  borderColor: values.tickets[i].borderColors.sellWhenTicketNumberSoldOut, color: sellWhenTicketNumberSoldOutColor[i] }}
                                                        >
                                            
                                                            <option value='' disabled>When which ticket is sold out?</option>
                                                
                                                            {values.tickets.filter((e, ind) => ind<i).map(	(e, index) => {
                                                                return (
                                                                    <option key={index} value={e.ticketTypeID}>
                                                                        {e.ticketType}
                                                                    </option>
                                                                )}	
                                                            )}
                                                        </select>   
                                                    </div>
                                                }
                

            
    

                                                <p className="warning startSellingTime">{values.tickets[i].errors.startSellingTime}</p>
                                                {values.tickets[i].startSelling == 'specific' && 
                                                <div className="group datePickerDiv"
                                                    style={{ borderColor: values.tickets[i].borderColors.startSellingTime }}  
                                                >                 
                                                    <DatePicker
                                                        className="datePicker"
                                                        timeIntervals={15}
                                                        onBlur={() => this.props.startSellingSpecificTimeErrors (i, 'startSellingTime', values)}
                                                        onChange={event => this.props.setSpecificTime(event, i, 'startSellingTime', values)}
                                                        onFocus={() => this.props.turnBorderOrange( 'startSellingTime', i)}
                                                        selected={values.tickets[i].startSellingTime}
                                                        placeholderText='Select Date And Time'
                                                        showTimeSelect
                                                        dateFormat="Pp"
                                                        required
                                                        />
                                                </div>
                                                }


                                                <p className="warning stopSelling">{values.tickets[i].errors.stopSelling}</p>
                                                <div className="group">
                                                    <select
                                                        required 
                                                        value={values.tickets[i].stopSelling}
                                                        onBlur={() => this.props.checkForErrors('stopSelling', i)}
                                                        onChange={event => this.props.changeSellingTimes(event, i, 'stopSelling', 'stopSellingTime', values)}
                                                        onFocus={() => this.props.turnBorderOrange( 'stopSelling', i)}
                                                        style={{ color: stopSellingColor[i], borderColor: values.tickets[i].borderColors.stopSelling }}
                                                    >
                                                        <option value='' disabled>Stop Selling Tickets</option>
                                                        <option value="eventBegins">When Event Begins</option>
                                                        <option value="eventEnds">When Event Ends</option>
                                                        <option value="specific">At Specific Date and Time</option>
                                                    </select>
                                                </div>



                                                <p className="warning stopSellingTime">{values.tickets[i].errors.stopSellingTime}</p>
                                                {values.tickets[i].stopSelling == 'specific'  &&

                                                    <div className="group datePickerDiv"
                                                    style={{ borderColor: values.tickets[i].borderColors.stopSellingTime }}  
                                                    >  
                                                            <DatePicker
                                                                className="datePicker"
                                                                timeIntervals={15}
                                                                onChange={event => this.props.setSpecificTime(event, i, 'stopSellingTime', values)}
                                                                onBlur={()=> this.props.stopSellingSpecificTimeErrors(i, 'stopSellingTime', values)}
                                                                onFocus={() => this.props.turnBorderOrange( 'stopSellingTime', i)}
                                                                selected={values.tickets[i].stopSellingTime}
                                                                placeholderText='Select Date And Time'
                                                                showTimeSelect
                                                                dateFormat="Pp"
                                                                required
                                                            />
                                                    </div>
                                                }

                                                {values.tickets.length > 1 &&
                                                    <button
                                                        className = "secondary deleteTicketButton" 
                                                        onClick={(event)=> this.props.deleteTicket(event, i) }>Delete Ticket
                                                    </button>
                                                }

                                            </form>

                                        </div>

                                        <div></div>

                                    </div>
                                )
                            })}
                    

                    </div>    
                        <div></div>

                    </div>

                    <div className="tempThirdRow">
                        <div></div>

              
                    
                        
                        <div className="buttonContainer" id="firstButtonContainer">
                            <button className="primary" onClick={this.props.addTicket}>Create Another Ticket</button>
                        </div>

                        <div className="buttonContainer">
                            <button className="primary lhsbutton" onClick={event => this.continue(values)}>Continue</button>   
                            <button className="secondary rhsbutton" onClick={this.props.prevStep}>Go Back</button>
                        </div>

                        <div></div>
                    </div>

                </div>
                    

                {/* wrapper */}
                {/* grid center middle longForm */}

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

               
                  
                    {/* <div></div>
                </div> */}
           
            </>
        )
    }
}

export default Test

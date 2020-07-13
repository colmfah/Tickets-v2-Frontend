import React, { Component } from 'react'
import DatePicker from "react-datepicker";

export class Tickets extends Component {


    
    render() {
        return (
            <>
                <h1>Create Tickets</h1>
                {this.props.tickets.map((e, i) => {
                    return (
                        <div key={i}>
                            <div>Ticket Number {i+1}:</div>

                            <div>
                                <input
                                    required
                                    type="text"
                                    value={this.props.tickets[i].ticketType}
                                    onChange={event => this.props.changeTicketDetails(event, 'ticketType', i)}
                                    placeholder="Ticket Name: Early Bird, General Admission..."
                                />     
                            </div>

                            <div>
                                <input
                                    type="text"
                                    value={this.props.tickets[i].ticketDescription}
                                    onChange={event => this.props.changeTicketDetails(event, 'ticketDescription', i)}
                                    placeholder="Ticket Description (optional): Get backstage access..."
                                />          
                            </div>


                            <div>					          
                                <select
                                    required 
                                    value={this.props.tickets[i].chargeForTicketsStatus}			
                                    onChange={event => this.props.changeTicketDetails(event, 'chargeForTicketsStatus', i)}
                                >
                                <option value="" disabled>Select Ticket Type</option>
                                <option value="chargeForTickets" disabled>Charge For Tickets</option>
                                <option value="freeTickets">Free Tickets</option>
                                </select>
                            </div>


                            {this.props.tickets[i].chargeForTicketsStatus === 'freeTickets' ?
                                <div>
                                    €
                                    <input
                                        type="number"
                                        value={this.props.tickets[i].chargeForNoShows}
                                        onChange={event => this.props.changeTicketDetails(event, 'chargeForNoShows', i)}
                                        placeholder="Fine for customers who don't show up"
                                        min={0}
                                    />     
                                </div>

                                :

                                <div>
                                    €
                                    <input
                                        required
                                        type="number"
                                        value={this.props.tickets[i].price}
                                        onChange={event => this.props.changeTicketDetails(event, 'price', i)}
                                        placeholder="10"
                                        min={10}
                                    />
                                </div>
                            
                            }

                            {this.props.tickets[i].chargeForNoShows > 0 ? 
                            <div>
                                <select
                                    required 
                                    value={this.props.tickets[i].hold}			
                                    onChange={event => this.props.changeTicketDetails(event, 'hold', i)}
                                >
                                <option value="hold">Place hold on customers account before event begins</option>
                                <option value="noHold">Trust customers to provide chargable credit card (no hold placed)</option>
                                </select>
                            </div>
                            : <div></div>        
                            }	

                            <div>          
                                <input
                                    required
                                    type="number"
                                    min={1}
                                    value={this.props.tickets[i].numberOfTickets}
                                    onChange={event => this.props.changeTicketDetails(event, 'numberOfTickets', i)}
                                    placeholder="Number of Tickets"
                                />
                            </div>

                            <div>
                                <label>Start Selling Tickets:</label>
                                        
                                <select
                                    required value={this.props.tickets[i].startSelling}
                                    onChange={event => this.props.changeSellingTimes(event, 'startSelling', i, 'startSellingTime')}
                                >
                                    <option value="now">Now</option>
                                    <option value="specific">Specific Date and Time</option>
                                    <option value="whenPreviousSoldOut" disabled={i==0}>When A Previous Ticket Is Sold Out</option>
                                </select>
                            </div>

                            {this.props.tickets[i].startSelling === 'whenPreviousSoldOut' &&
                                <div>
                                    <label>When Which Ticket is sold out?</label>
                                    <select
                                        required
                                        value={this.props.tickets[i].sellWhenTicketNumberSoldOut}
                                        onChange={(event) => {this.props.changeTicketDetails(event, 'sellWhenTicketNumberSoldOut', i); this.props.validTicketCheck(event, i)}}
                                    >

                                    <option value=''>select ticket</option>

                                    {this.props.tickets.filter((e, ind) => ind<i).map(	(e, index) => {
                                        return (
                                            <option key={index} value={e.ticketTypeID}>
                                                {e.ticketType}
                                            </option>
                                        )}	
                                    )}

                                    </select>

                                {this.props.tickets[i].waitingForTicketThatDoesntExistToSellOut &&
                                    <div className='error'>
                                        Please select a valid ticket
                                    </div>}

                                </div>
                            }


                            {this.props.tickets[i].startSelling == 'specific' &&
                                <div>
                                    <label>
                                        <DatePicker
                                            timeIntervals={15}
                                            onChange={event => this.props.changeTicketDetails(event, 'startSellingTime', i)}
                                            onBlur={event => this.props.errorIfSecondTimeIsNotBeforeFirstTime(this.state.userEvent.startDetails, event.target.value, 'startSellingAfterEventBegins')}
                                            selected={this.props.tickets[i].startSellingTime}
                                            placeholderText='Select Date And Time'
                                            showTimeSelect
                                            dateFormat="Pp"
                                            required
                                            />
                                        </label>
                                </div>
                            }

                        {/*this.state.errors.startSellingAfterEventBegins === true && this.props.tickets[i].startSelling === 'specific' && <div className='warning'>{this.state.errorMsg.startSellingAfterEventBegins}</div>*/}


                            <div>
                                <label>
                                Stop Selling Tickets:
                                    <select
                                        required value={this.props.tickets[i].stopSelling}
                                        onChange={event => this.props.changeSellingTimes(event, 'stopSelling', i, 'stopSellingTime')}
                                    >
                                        <option value="eventBegins">When Event Begins</option>
                                        <option value="eventEnds">When Event Ends</option>
                                        <option value="specific">At Specific Date and Time</option>
                                    </select>
                                </label>
                            </div>

                            {this.props.tickets[i].stopSelling == 'specific'  &&
                                <div>
                                    <label>
                                        <DatePicker
                                            timeIntervals={15}
                                            onChange={event => this.props.changeTicketDetails(event, 'stopSellingTime', i)}
                                            onBlur={(event) =>{ this.props.errorIfSecondTimeIsNotBeforeFirstTime(this.state.userEvent.endDetails, event.target.value, 'sellingTicketsWhenEventIsOver'); this.errorIfSecondTimeIsNotBeforeFirstTime(this.props.tickets[i].stopSellingTime, this.props.tickets[i].startSellingTime, 'sellingStopsBeforeStarts') }}
                                            selected={this.props.tickets[i].stopSellingTime}
                                            placeholderText='Select Date And Time'
                                            showTimeSelect
                                            dateFormat="Pp"
                                            required
                                        />
                                    </label>
                                </div>
                            }

                        {/*this.state.errors.sellingTicketsWhenEventIsOver === true && this.props.tickets[i].stopSelling === 'specific' && <div className='warning'>{this.state.errorMsg.sellingTicketsWhenEventIsOver}</div>*/}

                        {/*this.state.errors.sellingStopsBeforeStarts === true && <div className='warning'>{this.state.errorMsg.sellingStopsBeforeStarts}</div>*/}


                            {this.props.tickets.length > 1 &&
                                <button 
                                    onClick={(event )=> {this.props.deleteTicket(event, i); this.props.waitingForTicketThatDoesntExistToSellOut()} }>Delete Ticket
                                </button>
                            }
                                            
                            <hr />
                    </div>
                    )
                })}

    <button onClick={(e) => this.props.addTicket(e, true)}>Create Another Ticket</button>

    {this.props.tickets.length > 1 && 		
    
    <div>
        <h4>Are all ticket types equivalent to each other when customers enter the event?</h4>
        <select
            required
            value={this.state.userEvent.ticketTypesEquivalent}
            onChange={event => this.props.handleBooleanChange(event, 'ticketTypesEquivalent')}
            >
            <option value={true}>Yes - eg. Early Bird, General Admission etc.</option>
            <option value={false}>No - eg. Backstage Access, VIP Treatment etc.</option>
        </select>

    </div>
    }
</>
        )
    }
}

export default Tickets

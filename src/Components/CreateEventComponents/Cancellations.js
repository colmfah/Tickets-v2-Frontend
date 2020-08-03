import React from 'react'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import moment from "moment";



class Cancellations extends React.Component {

    state = {
        errors: []
    }

    continue = (e, values, submit, fines) => {
        console.log('submit', submit);
        
        let errors = []
        if(fines.length > 0 && values.globalRefundOptions.optionSelected === ''){
            errors.push('Please select whether to allow customers to cancel their tickets')
        }

        if(values.globalRefundOptions.optionSelected === "untilSpecific" && values.globalRefundOptions.refundUntil ===''){
            errors.push('Please select the date cancellations are allowed until')
        }

        if(moment(values.globalRefundOptions.refundUntil).isAfter(values.endDetails)){
            errors.push('You are allowing cancellations after the event has ended')
        }

        this.setState({errors})

        if(errors.length === 0){
            submit(e)
        }
    }

	render() {
        const {values} = this.props
        let noFines = values.tickets.filter(e=>Number(e.chargeForNoShows) === 0).map(e=>e.ticketType)
        let fines = values.tickets.filter(e=>Number(e.chargeForNoShows) > 0).map(e=>e.ticketType)
        console.log('noFines', noFines)
        console.log('fines', fines)
        console.log('values.tickets', values.tickets)
        
        
        
        
	  	return (
			<>
                <h1>Cancellation Policy For Free Tickets</h1>

                {noFines.length > 0 && 
                <div>
                    <h5>Customers can cancel the following tickets at any time without penalty</h5>
                    <ul>
                        {noFines.map((e,i)=><li key={i}>{e}</li>)}
                    </ul>
                    <p>If you wish to change this, go back to the tickets page</p>
                </div>}

                
                {fines.length > 0 && 
                    <div>
                        <h5>Customers will be fined if they purchase one of the following tickets and do not check in or sucessfully cancel their ticket</h5>
                        <ul>
                            {fines.map((e,i)=><li key={i}>{e}</li>)}
                        </ul>
                        <div>
                            <select
                            required
                            value={values.globalRefundOptions.optionSelected}
                            onChange={event => this.props.handleRefundChange(event, 'optionSelected', 'not relevant')}
                            >
                                <option value='' disabled>Allow customers to cancel tickets?</option>
                                <option value="excessDemand">
                                    Allow cancellations if all tickets have sold out and new customers are waiting to buy
                                </option>

                                {values.tickets.length > 1 && 
                                    <option value="excessDemandTicketType">
                                    {`Allow cancellations for each specific ticket type (${values.tickets[0].ticketType}, ${values.tickets[1].ticketType} etc.) if it has sold out and new customers are waiting to buy`}
                                    </option>
                                }
                                <option value="untilSpecific">Allow cancellations until a specific date and time</option>
                                <option value="noRefunds">No cancellations allowed </option>
                            </select>
                        </div>


                        {values.globalRefundOptions.optionSelected === "untilSpecific" &&
                            <div>
                                <DatePicker
                                    timeIntervals={15}
                                    selected={values.globalRefundOptions.refundUntil}
                                    placeholderText="Select Date"
                                    onChange={event =>
                                        this.props.handleRefundChange(event, "refundUntil", 'not relevant')
                                    }
                                    showTimeSelect
                                    dateFormat="Pp"
                                    required
                                />
                            </div>
                        }
                    </div>

                }
                


                <div>
                    <button onClick={event => this.continue(event, values, this.props.submit, fines)}>Submit</button>   <button onClick={event => this.props.prevStep(event)}>Go Back</button>
                </div>

                {this.state.errors.map((e,i)=>{return(<div key={i}>{e}</div>)})}


			</>
		)
}
}

export default Cancellations

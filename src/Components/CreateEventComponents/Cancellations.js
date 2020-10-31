import React from 'react'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import moment from "moment";

import Nav from "../Nav";



class Cancellations extends React.Component {

    state = {
        borderColors: {
            ticketTypesEquivalent: 'none',
            optionSelected: 'none',
            untilSpecific: 'none'
        },
        errors: {
            ticketTypesEquivalent: '',
            optionSelected: '',
            refundUntil: ''
        }
    }

    checkForErrors = (field, data, values) => {
        let borderColors = this.state.borderColors
        let errors = this.state.errors
        let warning = ''
        

        if(data === ''){
            if(field === 'ticketTypesEquivalent'){
                warning = 'Are All Ticket Types Equivalent Once Customer Enters Event?'
            }else if (field === 'optionSelected'){
                warning = 'Please Select Cancellation Option'
            }else if(field === 'refundUntil'){
                warning = 'When Do You Want To Allow Cancellations Until?'
            } 
            borderColors[field] = 'tomato'
        }else{
            borderColors[field] = '#00988f' 
            }

        if(field === 'refundUntil'){
            if(moment(data).isAfter(moment(values.endDetails))){
                warning = `You Cannot Allow Cancellations After the Event Has Ended`
            }
            borderColors[field] = 'tomato'
        }

        errors[field] = warning
        this.setState({borderColors, errors})
    }

    continue = (e, values, submit, fines) => {
        e.preventDefault()

        if(fines.length > 0){
            this.checkForErrors('optionSelected', values.globalRefundOptions.optionSelected, values)
        }

        if(values.globalRefundOptions.optionSelected === "untilSpecific"){
            console.log('refundUntil triggered');
            
            this.checkForErrors('refundUntil', values.globalRefundOptions.refundUntil, values)
        }

        if(values.tickets.length > 1){
            this.checkForErrors('ticketTypesEquivalent', values.ticketTypesEquivalent, values)
        }
        
        if(this.state.errors.ticketTypesEquivalent === '' && this.state.errors.optionSelected === '' && this.state.errors.refundUntil === ''){

            submit(e)
        }
    }

    handleChange = (e, field, values) => {
        field ==='ticketTypesEquivalent' ? this.props.changeField(e, field) : this.props.handleRefundChange(e, field)
        field === 'refundUntil' ? this.checkForErrors(field, e, values) : this.checkForErrors(field, e.target.value)

    }

    turnBorderOrange(field){
        let borderColors = this.state.borderColors
        let errors = this.state.errors
        errors[field] = ''
        borderColors[field] = '#ff8c00'
        this.setState({borderColors})
    }

	render() {
        const {values} = this.props
        let fines = values.tickets.filter(e=>Number(e.chargeForNoShows) > 0).map(e=>e.ticketType)
        let ticketTypesEquivalentColor
        let optionSelectedColor

        values.ticketTypesEquivalent === '' ? ticketTypesEquivalentColor = 'rgb(118, 118, 118)' : ticketTypesEquivalentColor = 'black'
        values.globalRefundOptions.optionSelected === '' ? optionSelectedColor = 'rgb(118, 118, 118)' : optionSelectedColor = 'black'


        

	  	return (

            <>
            <div className="pageGrid2Rows">
              <div className="navBar" ><Nav /></div>
     
               
               <div className="formRowGrid">
                 <div></div>
     
     
     
                 <div className ="wrapper">
                   <div></div>
     
                   <div className="content threeRowGridToCenterContent">

                    <div></div>
                    <div>
     
                        <form>

                        {values.tickets.length > 1 &&
                            <div>
                                <p className='warning'>{this.state.errors.ticketTypesEquivalent}</p>
                                <div className="group">
                                    <select
                                        required
                                        value={values.ticketTypesEquivalent}
                                        onBlur={() => this.checkForErrors('ticketTypesEquivalent', values.ticketTypesEquivalent)}
                                        onChange={(event) =>  this.handleChange(event, 'ticketTypesEquivalent')}
                                        onFocus={() => this.turnBorderOrange( 'ticketTypesEquivalent')}	
                                        style={{ color: ticketTypesEquivalentColor, borderColor: this.state.borderColors.ticketTypesEquivalent}}
                                    >
                                        <option value='' disabled>Are all ticket types equivalent?</option>
                                        <option value={true}>Yes</option>
                                        <option value={false}>No</option>
                                    </select>
                                </div>
                            </div>
                        }

                        {fines.length > 0 && 
                            <div>
                                <p className='warning'>{this.state.errors.optionSelected}</p>
                                <div className="group">
                                    <select
                                        required
                                        value={values.globalRefundOptions.optionSelected}
                                        onBlur={() => this.checkForErrors('optionSelected', values.globalRefundOptions.optionSelected)}
                                        onChange={(event) =>  this.handleChange(event, 'optionSelected', values)}
                                        onFocus={() => this.turnBorderOrange( 'optionSelected')}	
                                        style={{ color: optionSelectedColor, borderColor: this.state.borderColors.optionSelected}}
                                    >
                                        <option value='' disabled>Allow Customers To Cancel Tickets?</option>
                                        <option value="excessDemand">Only If New Customers Are Waiting To Buy</option>
                                        <option value="untilSpecific">Until Specific Date And Time</option>
                                        <option value="noRefunds">No Cancellations Allowed </option>
                                    </select>
                                </div>
                            </div>
                        }


                            {values.globalRefundOptions.optionSelected === "untilSpecific" &&
                                <div>
                                    <p className='warning'>{this.state.errors.refundUntil}</p>
                                    <div className="group datePickerDiv"
                                    style={{ borderColor: this.state.borderColors.refundUntil }}  
                                    >
                                        <DatePicker
                                            className="datePicker"
                                            timeIntervals={15}
                                            selected={values.globalRefundOptions.refundUntil}
                                            placeholderText="Select Date"
                                            onBlur={() => this.checkForErrors('refundUntil', values.globalRefundOptions.refundUntil, values)}	
                                            onChange={(event) =>  this.handleChange(event, 'refundUntil', values)}
                                            onFocus={() => this.turnBorderOrange( 'refundUntil')}	
                                            showTimeSelect
                                            dateFormat="Pp"
                                            required
                                        />
                                    </div>
                                </div>
                            }

                            <div className="group buttonContainer">
                                <button className = "primary lhsbutton" onClick={event => this.continue(event, values, this.props.submit, fines)}>Submit Event</button>   
                                <button className = "secondary rhsbutton" onClick={event => this.props.prevStep(event)}>Go Back</button>
                            </div>
                        </form>

                    </div>
                   </div>
     
                   <div></div>
                 </div>
     
                 <div></div>
               </div>
             </div>
             </>









			// <>
            //     {/* <h1>Cancellation Policy For Free Tickets</h1> */}

            //     <div className="pageGrid2Rows">
            //         <div><Nav /></div>
            //         <div className="centerTicketsInRow">
            //             <div></div>
            // 	        <div className='content threeRowGridToCenterContent'>

            //         <form>
            //         {/* values.tickets.length > 0 &&  */}
            //             <div className="group">
            //                 <select
            //                     required
            //                     value={values.ticketTypesEquivalent}
            //                     onChange={event => this.props.changeField(event, 'ticketTypesEquivalent', true)}
            //                 >
            //                     <option value='' disabled>Are all ticket types equivalent to each other when customers enter the event?</option>
            //                     <option value={true}>Yes - eg. Early Bird, General Admission etc.</option>
            //                     <option value={false}>No - eg. Backstage Access, VIP Treatment etc.</option>
            //                 </select>
            //             </div>
                

            //             <div>
            //                 <select
            //                 required
            //                 value={values.globalRefundOptions.optionSelected}
            //                 onChange={event => this.props.handleRefundChange(event, 'optionSelected', 'not relevant')}
            //                 >
            //                     <option value='' disabled>Allow customers to cancel tickets?</option>
            //                     <option value="excessDemand">
            //                         Allow cancellations if all tickets have sold out and new customers are waiting to buy
            //                     </option>

            //                     {values.tickets.length > 1 && 
            //                         <option value="excessDemandTicketType">
            //                         {`Allow cancellations for each specific ticket type (${values.tickets[0].ticketType}, ${values.tickets[1].ticketType} etc.) if it has sold out and new customers are waiting to buy`}
            //                         </option>
            //                     }
            //                     <option value="untilSpecific">Allow cancellations until a specific date and time</option>
            //                     <option value="noRefunds">No cancellations allowed </option>
            //                 </select>
            //             </div>

            //             {values.globalRefundOptions.optionSelected === "untilSpecific" &&
            //                 <div>
            //                     <DatePicker
            //                         timeIntervals={15}
            //                         selected={values.globalRefundOptions.refundUntil}
            //                         placeholderText="Select Date"
            //                         onChange={event =>
            //                             this.props.handleRefundChange(event, "refundUntil", 'not relevant')
            //                         }
            //                         showTimeSelect
            //                         dateFormat="Pp"
            //                         required
            //                     />
            //                 </div>
            //             }

            //         <div>
            //             <button onClick={event => this.continue(event, values, this.props.submit, fines)}>Submit</button>   <button onClick={event => this.props.prevStep(event)}>Go Back</button>
            //         </div>

            //          {this.state.errors.map((e,i)=>{return(<div key={i}>{e}</div>)})}
            //     </form>
                
            //         </div>
            //     </div>

            //     {/* noFines.length > 0 &&  */}

            //     {/* {
            //     <div>
            //         <h5>Customers can cancel the following tickets at any time without penalty</h5>
            //         <ul>
            //             {noFines.map((e,i)=><li key={i}>{e}</li>)}
            //         </ul>
            //         <p>If you wish to change this, go back to the tickets page</p>
            //     </div>} */}

            //     {/* fines.length > 0 &&  */}
            //     {/* {
            //         <div>
            //             <h5>Customers will be fined if they purchase one of the following tickets but do not check in or sucessfully cancel their ticket</h5>
            //             <ul>
            //                 {fines.map((e,i)=><li key={i}>{e}</li>)}
            //             </ul>




            //         </div>

            //     } */}
                





			// </>
		)
}
}

export default Cancellations

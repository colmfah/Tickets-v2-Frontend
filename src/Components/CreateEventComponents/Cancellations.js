import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";



class Cancellations extends React.Component {
  state = {
    borderColors: {
      ticketTypesEquivalent: "none",
      optionSelected: "none",
      untilSpecific: "none",
      minimumPrice:"none",
    },
    errors: {
      ticketTypesEquivalent: "",
      optionSelected: "",
      untilSpecific: "",
      minimumPrice:''
    },
  };

  checkForErrors(values){
    this.checkForOptionSelectedError(values)
    this.checkForReSalePriceErrors(values)
    this.checkForRefundUntilErrors(values)
  };

  checkForRefundUntilErrors(values){
    if(values.globalRefundOptions.optionSelected!=='untilSpecific'){return}
    let borderColors = this.state.borderColors;
    let errors = this.state.errors;
    let warning = "";
    if(values.globalRefundOptions.refundUntil === ''){warning = "Please Select Date"} 
    if(moment(values.globalRefundOptions.refundUntil).isBefore(moment())){warning = "Date Must Be In The Future"}
    if(moment(values.globalRefundOptions.refundUntil).isAfter(moment(values.endDetails))){warning = "Date Must Be Before Event Ends"}
    borderColors.untilSpecific = "#00988f"
    if(warning !== ""){borderColors.untilSpecific = "red"}
    errors.untilSpecific = warning
    this.setState({ borderColors, errors })

  }

  checkForOptionSelectedError(values){
    let borderColors = this.state.borderColors;
    let errors = this.state.errors;
    let warning = "";
    if(values.globalRefundOptions.optionSelected === ''){warning = "Please Select Refund Option"} 
    borderColors.optionSelected = "#00988f"
    if(warning !== ""){borderColors.optionSelected = "red"}
    errors.optionSelected = warning
    this.setState({ borderColors, errors })
  }

  checkForSpecificTimeError(field, values){
    if (field !== "untilSpecific"){return}
    let borderColors = this.state.borderColors;
    let errors = this.state.errors;
    let warning = "";
    if(values.globalRefundOptions.untilSpecific = ''){warning = "When Do You Want To Allow Refunds Until?"} 
    if (moment(values.globalRefundOptions.untilSpecific).isAfter(moment(values.endDetails))){warning = `You Cannot Allow Cancellations After the Event Has Ended`}
    borderColors[field] = "#00988f"
    if(warning !== ''){borderColors[field] = "red"}
    errors[field] = warning
    this.setState({ borderColors, errors })
  }

  continue(e, values){
    e.preventDefault();
    this.checkForErrors(values)
    let errors = Object.values(this.state.errors).filter(e=> e!== '')
    if(errors.length > 0){return}
    if(this.props.amendingEvent){this.props.nextStep('refunds'); return}
    this.props.submit(e);
  };

  handleChange = (e, field, values) => {
    if(field === 'optionSelected'){this.checkForOptionSelectedError(values)}
    this.props.updateRefundData(e, field)
  };


  displaySpecificDateOption(values){
    if(values.globalRefundOptions.optionSelected !== "untilSpecific" ){return}
      return (
        <div>
          <p className="create-event-warning">{this.state.errors.untilSpecific}</p>
          <div
            className="datePickerDiv"
            style={{ borderColor: this.state.borderColors.untilSpecific,}}
          >
            <DatePicker
              className="datePicker"
              timeIntervals={15}
              selected={Date.parse(values.globalRefundOptions.refundUntil)}
              placeholderText="Select Date"
              onChange={(event) => this.handleChange(event, "refundUntil", values)}
              onCalendarClose={event => this.checkForRefundUntilErrors(values)}
              showTimeSelect
              dateFormat="d MMM yyyy, HH:mm"
              required
            />
          </div>
        </div>
      )
  }

  displaySpecificPriceOption(values){
    if(values.globalRefundOptions.optionSelected !== "excessDemand" ){return}
    return(
    <div>
      <p className="create-event-warning price">{this.state.errors.minimumPrice}</p>
      <input
          required
          type="number"
          value={values.globalRefundOptions.minimumPrice}
          onChange={(event) => {this.handleChange(event, "minimumPrice", values); this.checkForReSalePriceErrors(event)}}
          placeholder="Resale Price (€)"
          min={this.getHighestPrice()}
          style={{borderColor: this.state.borderColors.minimumPrice}}
      />
    </div>)
  }

  checkForReSalePriceErrors(){
    const { values } = this.props
    if(values.globalRefundOptions.optionSelected !== "excessDemand" ){return}
    let borderColors = this.state.borderColors;
    let errors = this.state.errors;
    let warning = ""
    if(values.globalRefundOptions.minimumPrice === ''){warning = "Resale Price Required"} 
    if(values.globalRefundOptions.minimumPrice < this.getHighestPrice()){warning = `You Can't Sell Refunded Tickets For Less Than Original Price (€${this.getHighestPrice()})`} 
    borderColors.minimumPrice = "#00988f"
    if(warning !== ''){borderColors.minimumPrice = "red"}
    errors.minimumPrice = warning
    this.setState({ borderColors, errors })
  }


  getHighestPrice(){
    return this.props.values.tickets.map(e=>e.price).sort((a,b) => b- a)[0]
  }

  spinnerVisibility(){
    if(this.props.displaySpinner ){return {'display': 'block'}}
    return {'display': 'none'}
  }

  getPageTitle(){
    if(this.props.amendingEvent){return 'Change Refund Policy'}
    return 'Refund Policy'
  }

  disableOrEnableButton(){
    if(this.props.updating){
        return 'create-event-button disable-button'
    }
    return 'create-event-button'
}





  getButtons(){
    if(this.props.amendingEvent){return (
      <button className={this.disableOrEnableButton()} onClick={(event) => this.continue(event, this.props.values)}>
        Update
      </button>)
      }

      return(  
        <>        
          <button className="create-event-button" onClick={(event) => this.props.prevStep(event)}>
            Go Back
          </button>
          <button className="create-event-button green-button" onClick={(event) => this.continue(event, this.props.values)}>
            Submit Event
          </button>
      </>)
  }




  render() {
    const { values } = this.props;
    if(values.globalRefundOptions === undefined){return null}
    return (
      <>
        <form className="create-event-form" >                           
          <div className="create-event-heading">
              <header>{this.getPageTitle()}</header>
              <hr />
          </div>    
          <p className="create-event-warning">{this.state.errors.optionSelected}</p>
          <div className="create-event-radio-container" style={{borderColor: this.state.borderColors.optionSelected  }} >
            <div>Select Refund Option</div> 
            <div className='create-event-radio-wrapper' >
                <div>
                    <input
                        type="radio"
                        checked={values.globalRefundOptions.optionSelected ==='excessDemand'}
                        value="excessDemand"
                        onChange={(event) => this.handleChange(event, "optionSelected", values)}
                    />
                    {` Only If New Customers Are Waiting To Buy`}
                </div>
                <div>
                <input
                        type="radio"
                        checked={values.globalRefundOptions.optionSelected ==='noRefunds'}
                        value="noRefunds"
                        onChange={(event) => this.handleChange(event, "optionSelected", values)}
                    />
                    {` No Refunds Allowed`}
                </div>
                <div>
                    <input
                        type="radio"
                        checked={values.globalRefundOptions.optionSelected ==='untilSpecific'}
                        value="untilSpecific"
                        onChange={(event) => this.handleChange(event, "optionSelected", values)}
                    />
                    {` Allow Refunds Until a Specific Time`}
                </div>
            </div>
          </div>

        {this.displaySpecificDateOption(values)}
    
        {this.displaySpecificPriceOption(values)}
        <p className="create-event-warning">{this.props.errorMessage}</p>
        <div style={this.spinnerVisibility()}   className ='ticket-spinner'>
                <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
        </div>
        <div>{this.props.message}</div>
          <div className="create-event-button-container">
            {this.getButtons()}
          </div>
        </form>

      </>



                  /* {fines.length > 0 && (
                      <div>
                        <p className="warning">
                          {this.state.errors.optionSelected}
                        </p>
                        <div className="group">
                          <select
                            required
                            value={values.globalRefundOptions.optionSelected}
                            onBlur={() =>
                              this.checkForErrors(
                                "optionSelected",
                                values.globalRefundOptions.optionSelected
                              )
                            }
                            onChange={(event) =>
                              this.handleChange(event, "optionSelected", values)
                            }
                            style={{
                              color: optionSelectedColor,
                              borderColor: this.state.borderColors
                                .optionSelected,
                            }}
                          >
                            <option value="" disabled>
                              Allow Customers To Cancel Tickets?
                            </option>
                            <option value="excessDemand">
                              Only If New Customers Are Waiting To Buy
                            </option>
                            <option value="untilSpecific">
                              Until Specific Date And Time
                            </option>
                            <option value="noRefunds">
                              No Cancellations Allowed{" "}
                            </option>
                          </select>
                        </div>
                      </div>
                    )} */


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
      //                     onChange={event => this.props.updateRefundData(event, 'ticketTypesEquivalent', true)}
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
      //                 onChange={event => this.props.updateRefundData(event, 'optionSelected', 'not relevant')}
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
      //                         selected={values.globalRefundOptions.untilSpecific}
      //                         placeholderText="Select Date"
      //                         onChange={event =>
      //                             this.props.handleRefundChange(event, "untilSpecific", 'not relevant')
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

      
    );
  }
}

export default Cancellations;

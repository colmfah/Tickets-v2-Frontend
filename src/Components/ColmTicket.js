import React, {useState, useEffect, useRef} from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
import "../Styles/ColmsTicket.css";
import DatePicker from "react-datepicker";


const ColmTicket = (props) =>{
  const [height, setHeight] = useState(0)
  const ref = useRef(null)
  let {changeQuantity, changeWaitListExpiration, displaySpecificDate, index, ticket, specificWaitListDateError, ticketsAvailable, waitListSpecificDate} = props
  let wordArray = ticket.ticketType.split(" ")
  let firstWord = wordArray[0]
  wordArray.shift()
  let restOfWord = wordArray.join(' ')
  useEffect(() => {setHeight(ref.current.clientHeight)})


  function getPriceCode(code){
    let price
    Number(price) === 0 ? price = 'Free' : price = `€${ticket.price}`
    code.push(
      <div key={code.length} className={'ticket-detail ticket-detail-price'}>
        <span>{'price'}</span>
        <h2>{price}</h2>
      </div>
    )
    return code
  }

  function getDescriptionCode(code){
    if(ticket.ticketDescription === ''){return code}
    code.push(
      <div key={code.length} className={'ticket-detail ticket-detail-description'}>
        <span>{'description'}</span>
        <h2>{ticket.ticketDescription}</h2>
      </div>
    )
    return code
  }

  function getRefundPolicyCode(code){

    if(Number(ticket.price) === 0){return code}

    let refundStatus
    let refundClassName
    
    if(ticket.refunds.optionSelected === 'excessDemand'){
        refundStatus = `Limited number of refunds available`
        refundClassName = `ticket-detail ticket-detail-refund ticket-detail-refund-excess-Demand`
    }else if(ticket.refunds.optionSelected === 'untilSpecific'){
        refundStatus = `Until ${moment(ticket.refunds.refundUntil).format('Do MMM HH:mm')}`
        refundClassName = `ticket-detail ticket-detail-refund`
    }else if(ticket.refunds.optionSelected === 'noRefunds'){
        refundStatus = 'No Refunds'
        refundClassName = `ticket-detail ticket-detail-refund`
    }

    code.push(
      <div key={code.length} className={refundClassName}>
      <span>{'refund policy'}</span>
      <h2>{refundStatus}</h2>
      </div>
    )
    return code
  }

  function getWaitListExpiryCode(code){
    code.push (
      <div key={code.length} className={`ticket-detail`}>
        <span>Latest time to receive tickets</span>
        <select
          required
          value={ticket.waitListExpires}
          onChange={event => changeWaitListExpiration(event, index)}
        >
          <option value="starts">When event starts</option>
          <option value="hourBeforeEnds">1 hour before event ends</option>
          <option value="specific">Set a specific date and time</option>
        </select>
      </div>
    )
    return code
  }

  function getDatePickerCode(code){
    code.push(
        <div key={999} className={`ticket-detail ticket-detail-date`}> 
        <div><span style={{color: '#e84c3d'}}>{specificWaitListDateError}</span></div>
          <DatePicker
            required
            timeIntervals={15}
            selected={waitListSpecificDate}
            onChange={event => displaySpecificDate(event, index)}
            showTimeSelect
            dateFormat="d MMM yyyy HH:mm"
            placeholderText='Enter Date'
          />
        </div>
 
    )
    return code
  }

  function getSpecificExpiryCode(code){
    if(ticket.waitListExpires !=='specific'){return code}
    getDatePickerCode(code)
    return code
  }

  function getLastMinuteTicketCode(code){
    if(!ticket.lastMinuteTicket){return code}
    getDescriptionCode(code)
    getPriceCode(code)
    getWaitListExpiryCode(code)
    getSpecificExpiryCode(code)
    return code
    }   
      
  function getPaidTicketCode(code){
    if(ticket.lastMinuteTicket){return code}
    getDescriptionCode(code)
    getPriceCode(code)
    getRefundPolicyCode(code)
    return code
  }

  function getTicketDetails(){
    let code = []
    getPaidTicketCode(code)
    getLastMinuteTicketCode(code)
    return code
  }

    //each func just spits out a bit of code. then another func puts together all the code it wants for each specific ticket


    return (
      <>
        <div className="event-card-wrap">
          <div className="event-card event-card-left">
            <h1 className="event-ticket-title" ref={ref}>{firstWord} <span>{restOfWord}</span></h1>
            <div className="ticket-details">{getTicketDetails()}</div>
          </div>
          <div className="event-card event-card-right">
            <div className="event-eye" style={{ height: height }}></div>
            <div className="event-number">
              <span>quantity:</span>
              <input
                type="number"
                max={ticketsAvailable}
                value={ticket.quantityRequested}
                onChange={(event) => changeQuantity(index,Number(event.target.value), true)}
                min="0"
              />
            </div>
          </div>
        </div>
      </>
    );

}

export default withRouter(ColmTicket);

import React, {useState, useEffect, useRef} from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
import "../Styles/ColmsTicket.css";
import axios from 'axios';
var QRCode = require('qrcode.react')



const ColmTicket = (props) =>{

    const [message, setMessage] = useState('')


    const [height, setHeight] = useState(0)
    const ref = useRef(null)
    let {ticket} = props


    ticket.creationTime = new Date (ticket.creationTime).getTime()


    //   
    let wordArray = ticket.userEvent.title.split(" ")
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

    function getTicketTypeCode(code){
        code.push(
        <div key={code.length} className={'ticket-detail ticket-detail-description'}>
            <span>{'ticket type'}</span>
            <h2>{ticket.ticketType}</h2>
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

    function getLastMinuteTicketCode(code){
        if(!ticket.lastMinuteTicket){return code}
        getTicketTypeCode(code)
        getPriceCode(code)
        return code
        }   
        
    function getPaidTicketCode(code){
        if(ticket.lastMinuteTicket){return code}
        getTicketTypeCode(code)
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

    function requestRefund(){
        
        setMessage('Please Wait...')
     
        axios.post(`${process.env.REACT_APP_API}/refundRequest`, {ticketID: ticket, minimumPrice: ticket.minimumPrice, token: localStorage.getItem("token")})
            .then(res => {
                console.log('res.data', res.data)
                setMessage(res.data.message)
            })
    }

    //each func just spits out a bit of code. then another func puts together all the code it wants for each specific ticket


    return (
      <>
        <div className="ticket-card-wrap">
          <div className="event-card event-card-left">
            <h1 className="event-ticket-title" ref={ref}>{firstWord} <span>{restOfWord}</span></h1>
            <div className="ticket-details">{getTicketDetails()}</div>
          </div>
          <div className="event-card event-card-right">
            <div className="event-eye" style={{ height: height }}></div>
            <div className="ticket-buttons">
            <QRCode 
                value={String([ticket._id, ticket.randomNumber, ticket.creationTime, ticket.userEvent._id])} 
                className='QR' 
                style={{'maxWidth': '100%', 'height': 'auto', 'marginBottom': '20px'}}/>
                <button onClick={event => requestRefund()}>Request Refund</button>
        
           
        
            </div>
          </div>
        </div>
        <div className='ticket-message'>{message}</div>
      </>
    );

}

export default withRouter(ColmTicket);

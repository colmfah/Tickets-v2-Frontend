import React, {useState, useEffect, useRef} from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import moment from "moment";
import "../Styles/ColmsTicket.css";
import axios from 'axios';
var QRCode = require('qrcode.react')



const PurchasedTicket = (props) =>{

    function cancelRefundRequest(){
        setDisplaySpinner(true)
        setMessage('Please Wait...')
        let objectToSend = {token: localStorage.getItem("token"),ticketID: ticket._id}
        axios.post(`${process.env.REACT_APP_API}/cancelRefundRequest`, objectToSend)
        .then(res => {
            setMessage(res.data.message)
            setDisplaySpinner(false)
            if(!res.data.error){setTicket(res.data.ticket)}  
        }
        
        )
    }

    function displayRefundButton(){
        if(ticket.refundRequested){return <button onClick={event => cancelRefundRequest()}>Cancel Refund Request</button>}
        return <button onClick={event => requestRefund()}>Request Refund</button> 
    }

    function getPaidTicketCode(code){
        getTicketTypeCode(code)
        getPriceCode(code)
        getRefundPolicyCode(code)
        return code
    }

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

    function getTicketDetails(){
        let code = []
        getPaidTicketCode(code)
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

    function requestRefund(){
        setDisplaySpinner(true)
        setMessage('Please Wait...')
        axios.post(`${process.env.REACT_APP_API}/refundRequest`, {ticketID: ticket, minimumPrice: ticket.minimumPrice, token: localStorage.getItem("token")})
        .then(res => {
            setMessage(res.data.message)
            setDisplaySpinner(false)
            if(!res.data.error){setTicket(res.data.ticket)}
        })
    }

    function spinnerVisibility(){
        if(displaySpinner ){return {'display': 'block'}}
        return {'display': 'none'}
    }

    //each func just spits out a bit of code. then another func puts together all the code it wants for each specific ticket

    const [message, setMessage] = useState('')
    const [height, setHeight] = useState(0)
    const [displaySpinner, setDisplaySpinner] = useState(false)
    props.ticket.creationTime = new Date (props.ticket.creationTime).getTime()
    const [ticket, setTicket] = useState(props.ticket)
    let qrCode = String([ticket._id, ticket.randomNumber, ticket.creationTime, ticket.userEvent._id])
    const ref = useRef(null)
    let wordArray = ticket.userEvent.title.split(" ")
    let firstWord = wordArray[0]
    wordArray.shift()
    let restOfWord = wordArray.join(' ')
    useEffect(() => {setHeight(ref.current.clientHeight)})

    return (
      <div className='ticket-container'>
        <div className="ticket-card-wrap">
          <div className="event-card event-card-left">
            <h1 className="event-ticket-title" ref={ref}>{firstWord} <span>{restOfWord}</span></h1>
            <div className="ticket-details">{getTicketDetails()}</div>
          </div>
          <div className="event-card event-card-right">
            <div className="event-eye" style={{ height: height }}>{moment(ticket.userEvent.startDetails).format('Do MMM')}</div>
            <div className="ticket-buttons">
                <Link to={`/qr/${qrCode}`} target="_blank" rel="noopener noreferrer">
                    <QRCode 
                        value={qrCode} 
                        className='QR' 
                        style={{'maxWidth': '95%', 'height': 'auto', 'marginBottom': '12px', 'marginTop': '5px'}}/>
                </Link>
                {displayRefundButton()}
            </div>
          </div>
        </div>
        <div className='ticket-message-container'>
            <div style={spinnerVisibility()}   className ='ticket-spinner'>
                <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            </div>
            <div className='ticket-message'>{message}</div>
        </div>
      </div>
    );
}

export default withRouter(PurchasedTicket);

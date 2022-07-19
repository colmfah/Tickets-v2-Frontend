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
        let objectToSend = {token: localStorage.getItem("token"), ticket: ticket}
        axios.post(`${process.env.REACT_APP_API}/cancelRefundRequest`, objectToSend)
        .then(res => {
            console.log('res.data - cancel request', res.data)
            setMessage(res.data.message)
            setDisplaySpinner(false)
            if(!res.data.error){setTicket(res.data.ticket)}  
        }
        
        )
    }

    function displayCancelRefundButton(){
        if(ticket.refunded){return}
        if(ticket.refunds.optionSelected==='noRefunds'){return}
        if(!ticket.refundRequested){return}
        if(ticket.refunds.optionSelected!=='excessDemand'){return}
        return <button onClick={event => cancelRefundRequest()}>Cancel Refund Request</button>
    }

    function displayRequestRefundButton(){
        if(ticket.refundRequested){return}
        if(ticket.refunded){return}
        if(ticket.refunds.optionSelected==='noRefunds'){return}
        if(displaySpinner){return}
        if(moment().isAfter(ticket.refunds.refundUntil)){return}
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
        let priceToArray = price.split('.')
        if(priceToArray.length === 2){
            //converts €10.5 to €10.50
            
            price = `${priceToArray[0]}.${priceToArray[1]}0`  
        }
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
            refundStatus = `A limited number of refunds will be available if this event sells out`
            refundClassName = `ticket-detail ticket-detail-refund ticket-detail-refund-excess-Demand`
        }else if(ticket.refunds.optionSelected === 'untilSpecific'){
            refundStatus = `Refunds available until ${moment(ticket.refunds.refundUntil).format('Do MMMM [at] HH:mm')}`
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
        axios.post(`${process.env.REACT_APP_API}/refundRequest`, {ticket: ticket, minimumPrice: ticket.minimumPrice, token: localStorage.getItem("token")})
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
                {displayRequestRefundButton()}
                {displayCancelRefundButton()}
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

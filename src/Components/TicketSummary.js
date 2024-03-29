import React, {useState, useEffect, useRef} from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import moment from "moment";
import "../Styles/ColmsTicket.css";
import "../Styles/MyEvent.css";
import axios from 'axios';



const TicketSummary = (props) =>{



    

    function convertCamelCaseToWords(camelCaseCode){
        let array = camelCaseCode.split('')
        array.map((letter, index)=>{if(letter === letter.toUpperCase()){array.splice(index, 0, ' ')}})
        return array.join('')
    }


    function getTicketDetails(){
        let code = []
        let ticketClone = {...ticket}
        delete ticketClone.ticketType
        delete ticketClone.revenue
        delete ticketClone.creationTime
        delete ticketClone.ticketTypeID
        for (var key in ticketClone) {
            let keyInWords = convertCamelCaseToWords(key)
            code.push(            
            <div className={'my-event-ticket-detail'}>
            <span>{keyInWords}</span>
            <h2>{ticketClone[key]}</h2>
        </div>)
            
        }

        return code
        return (
            <>


         
      
            {ticket.capacity === undefined ? <></> : <div className={'my-event-ticket-detail'}><span>{'capacity'}</span>
            <h2>{ticket.capacity}</h2></div>}
         
            <div className={'my-event-ticket-detail'}>
                <span>{'purchased'}</span>
                <h2>{ticket.purchased}</h2>
            </div>
            <div className={'my-event-ticket-detail'}>
                <span>{'refunded'}</span>
                <h2>{ticket.refunded}</h2>
            </div>

            <div className={'my-event-ticket-detail'}>
                <span>{'refund requests'}</span>
                <h2>{ticket.refundRequests}</h2>
            </div>

            {ticket.waitList === undefined ? <div className={'my-event-ticket-detail'}><span>{'wait list'}</span>
             <h2>{0}</h2></div>: <div className={'my-event-ticket-detail'}><span>{'wait list'}</span>
            <h2>{ticket.waitList}</h2></div>}


            {ticket.profit === undefined ? <></> : <div className={'my-event-ticket-detail'}><span>{'resale profit'}</span>
            <h2>€{ticket.profit}</h2></div>}




            </>
            
        )
    }





    function spinnerVisibility(){
        if(displaySpinner ){return {'display': 'block'}}
        return {'display': 'none'}
    }

    function currencyToTwoDecimals(amount){

        let amountToArray = String(amount).split('.')
        if(amountToArray.length === 2){
            //converts 10.5 to 10.50
            
            amount = `${amountToArray[0]}.${amountToArray[1]}0`  
        }
        return amount
    }

    //each func just spits out a bit of code. then another func puts together all the code it wants for each specific ticket
        const ref = useRef(null)
    const [message, setMessage] = useState('')
    const [height, setHeight] = useState(0)
    const [displaySpinner, setDisplaySpinner] = useState(false)
    props.ticket.creationTime = new Date (props.ticket.creationTime).getTime()
    const [ticket, setTicket] = useState(props.ticket)
    let wordArray = ticket.ticketType.split(" ")
    let firstWord = wordArray[0]
    wordArray.shift()
    let restOfWord = wordArray.join(' ')
    useEffect(() => {setHeight(ref.current.clientHeight)})

    return (
      <div className='ticket-container'>
        <div className="ticket-card-wrap">
          <div className="event-card event-card-left">
            <h1 className="event-ticket-title" ref={ref}>{firstWord} <span>{restOfWord}</span></h1>
            <div className="my-event-ticket-details">{getTicketDetails()}</div>
          </div>
          <div className="event-card event-card-right">
            <div className="event-eye" style={{ height: height }}></div>
            <div className="my-event-ticket-buttons">
                <div className={'my-event-ticket-detail'}>
                    <span>{'revenue'}</span>              
                    <h2>€{currencyToTwoDecimals(ticket.revenue)}</h2>
                </div>
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

export default withRouter(TicketSummary);

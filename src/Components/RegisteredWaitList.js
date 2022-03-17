import React, {useState, useEffect, useRef} from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import moment from "moment";
import "../Styles/ColmsTicket.css";
import DatePicker from "react-datepicker";
import axios from 'axios';
var QRCode = require('qrcode.react')



const RegisteredWaitList = (props) =>{
  
  function cancelWaitList(){
      setDisplaySpinner(true)
      setMessage('Please Wait...')
      let objectToSend = {token: localStorage.getItem("token"),waitListID: waitList._id}
      axios.post(`${process.env.REACT_APP_API}/cancelWaitList`, objectToSend)
      .then(res => {
          setMessage(res.data.message)
          setDisplaySpinner(false)
      }
      )
  }
  
  function getPriceCode(code){
    let price = `€${waitList.maxPrice}`
    code.push(
    <div key={code.length} className={'ticket-detail ticket-detail-price'}>
        <span>{'price'}</span>
        <h2>{price}</h2>
    </div>
    )
    return code
  }

  function getTicketDetails(){
  let code = []
  getPriceCode(code)
  getWaitListExpiryCode(code)
  return code
  }

  function getWaitListExpiryCode(code){
    code.push (
      <div key={code.length} className={`ticket-detail`}>
        <span>Latest time to receive tickets</span>
        <h2>{moment(waitList.expires).format('Do MMMM [at] HH:mm')}</h2>
      </div>
    )
    return code
  }

  function spinnerVisibility(){
        if(displaySpinner ){return {'display': 'block'}}
        return {'display': 'none'}
  }

  //each func just spits out a bit of code. then another func puts together all the code it wants for each specific ticket

  const [message, setMessage] = useState('')
  const [height, setHeight] = useState(0)
  const [displaySpinner, setDisplaySpinner] = useState(false)
  const [waitList, setWaitList] = useState(props.waitList)
  console.log('waitList', waitList)
  const ref = useRef(null)
  let wordArray = waitList.userEvent.title.split(" ")
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
          <div className="event-eye" style={{ height: height }}>{moment(waitList.userEvent.startDetails).format('Do MMM')}</div>
          <div className="event-number">
              <span>quantity:</span>
              <input type="number" value={waitList.quantity}/>
            </div>
          <div className="ticket-buttons">

            <button onClick={event => cancelWaitList()} >Cancel</button> 
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

export default withRouter(RegisteredWaitList);

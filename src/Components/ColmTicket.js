import React, {useState, useEffect, useRef} from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
import "../Styles/ColmsTicket.css";


const ColmTicket = (props) =>{

  const [height, setHeight] = useState(0)
  const ref = useRef(null)

  

  useEffect(() => {
    setHeight(ref.current.clientHeight)
  })

    let firstWord = props.ticketType.split(" ")[0];
    let restOfWord = props.ticketType.split(" ").pop();

    
    function getTicketDetails(){

      let array = []

      console.log('props.description', props)

      if(props.description !== ''){
          array.push({
              title: 'description',
              value: props.description,
              className: `ticket-detail ticket-detail-description`
            })
      }
      if(props.price === 0){

        let refundStatus
        let refundClassName

        if(props.refunds.optionSelected === 'excessDemand'){
            refundStatus = `Limited number of cancellations available`
            refundClassName = `ticket-detail ticket-detail-refund ticket-detail-cancel-excess-Demand`
        }else if(props.refunds.optionSelected === 'untilSpecific'){
            refundStatus = `Until ${moment(props.refunds.refundUntil).format('Do MMM HH:mm')}`
            refundClassName = `ticket-detail ticket-detail-refund`
        }else if(props.refunds.optionSelected === 'noRefunds'){
            refundStatus = 'No Cancellations'
            refundClassName = `ticket-detail ticket-detail-refund`
        }

        if(props.chargeForNoShows > 0){
        array.push({
            title: 'cancellation policy',
            value: refundStatus,
            className: refundClassName
        })
        }

          array.push({
              title: 'price',
              value: 'Free',
              className: `ticket-detail ticket-detail-price`
          })

      }else {
        let refundStatus
        let refundClassName
        

        if(props.refunds.optionSelected === 'excessDemand'){
            refundStatus = `Limited number of refunds available`
            refundClassName = `ticket-detail ticket-detail-refund ticket-detail-refund-excess-Demand`
        }else if(props.refunds.optionSelected === 'untilSpecific'){
            refundStatus = `Until ${moment(props.refunds.refundUntil).format('Do MMM HH:mm')}`
            refundClassName = `ticket-detail ticket-detail-refund`
        }else if(props.refunds.optionSelected === 'noRefunds'){
            refundStatus = 'No Refunds'
            refundClassName = `ticket-detail ticket-detail-refund`
        }

        array.push({
            title: 'refund policy',
            value: refundStatus,
            className: refundClassName
        })

          array.push({
              title: 'price',
              value: `€${props.price}`,
              className: `ticket-detail ticket-detail-price`
          })
      }

      let ticketDetails = array.map((e,i) => {
        if(e.title === 'price' && props.chargeForNoShows>0){
          let fineClassName
          props.hold ? fineClassName = `ticket-detail ticket-detail-fine-hold` : fineClassName = `ticket-detail ticket-detail-fine-no-hold`
          return(
            <div key={i} className="ticket-price-fine">

              <div className={e.className}>
                <span>{e.title}</span>
                <h2>{e.value}</h2>
              </div>

              <div className={fineClassName}>
                <span>no show fine</span>
                <h2>{`€${props.chargeForNoShows}`}</h2>
              </div>
            </div>
        )
        }else{

        
        
        return(
            <div key={i} className={e.className}>
            <span>{e.title}</span>
            <h2>{e.value}</h2>
            </div>
        )
        }
        
        })

        return ticketDetails

    }

    return (
      <>
        <div className="event-card-wrap">
          <div className="event-card event-card-left">
            <h1 className="event-ticket-title" ref={ref}>
              {firstWord} <span>{restOfWord}</span>
            </h1>

            <div className="ticket-details">
            {getTicketDetails()}

            </div>
          </div>

          <div className="event-card event-card-right">
            <div
              className="event-eye"
              style={{ height: height }}
            ></div>

          {/* I will need to change this input to a request refund button on the tickets page. Use prop to determine which page component is being displayed on. Eventpage = true. Toggle display: none depending on value */}

            <div className="event-number">
              <span>quantity:</span>
              <input
                type="number"
                value={props.quantity}
                onChange={(event) =>
                  props.changeQuantity(props.i, event.target.value)
                }
                min="0"
              />
            </div>
          </div>
        </div>

      </>
    );

}

export default withRouter(ColmTicket);

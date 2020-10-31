import React from "react"
import {Link} from 'react-router-dom'
import { withRouter } from 'react-router-dom'

import '../Styles/Global.css'


class BuyTicket extends React.Component {





  render() {
      let firstWord = this.props.ticketType.split(' ')[0]
      let restOfWord = this.props.ticketType.split(' ').pop()
    return (

        // eventTitle={this.state.userEvent.title}
        // ticketType={e.ticketType}
        // description={e.description}
        // price={e.price}
        // fine={e.chargeForNoShows}

        <>

                <div className="cardWrap">
                    <div className="buyTicket cardLeft">
                        {/* <h1>{firstWord} <span>{restOfWord}</span></h1> */}
                        <h1>lorem</h1>

                        <div>
                            {this.props.description!==undefined && <div className="title">
                            <span>description</span>
                            <h2>{this.props.description}</h2>
                            </div>}
                            <div className="seat">
                            <span>price</span>
                            <h2>€{this.props.price}</h2>
                            </div>
                            <div className="time">
                            <span>fine if you don't attend</span>
                            <h2>€{this.props.fine}</h2>
                            {this.props.description===undefined && <div class="barcode"></div>}
                            </div> 
                        </div>

                    </div>

                    <div className="buyTicket cardRight">
                        <div class="eye"></div>
                        <div class="number">
                        
                        {/* <h3>156</h3> */}
                        <input
                        type="number"
                        value={this.props.quantity}
                        onChange={event => this.props.changeQuantity(this.props.i, event.target.value)}
                         />
                        <span>Select Quantity</span>
                        </div>
                        
                    </div>
                </div>

        </>

    )
  }
}

export default withRouter(BuyTicket)

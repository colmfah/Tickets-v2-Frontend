import React from "react"
import {Link} from 'react-router-dom'
import { withRouter } from 'react-router-dom'

import '../Styles/ColmsTicket.css'


class ColmTicket extends React.Component {





  render() {
    //   let firstWord = this.props.ticketType.split(' ')[0]
    //   let restOfWord = this.props.ticketType.split(' ').pop()
    return (



        <>

            <div className='colmTicket'>

                    <div>
                    <div id='ticketHeader'>
                            <h1>Early <span>Bird</span></h1>
                        </div>
                        <div id='ticketBody'>

                            <div id='colmTicketLHS'>
                                <div>
                                    <span>Description</span>
                                    <h3>Limited Tickets: Bag a bargain now!</h3>

                                    <span>Price</span>
                                    <h3>Free</h3>

                                    <span>Fine if you don't attend</span>
                                    <h3>€3</h3>
                                </div>
                            </div>

                            <div id='colmTicketRHS'>
                                <div id='rhsChild'>

                                    <div>Select Quantity:</div>   
                                    <input
                                        type="number"
                                        value={this.props.quantity}
                                        onChange={event => this.props.changeQuantity(this.props.i, event.target.value)}
                                        />


                                </div>

                            </div>


                        </div>

                    </div>



              

          
            </div>


                {/* <div>
                    <div>
                        <h1>Colm's<span>Tickets</span></h1>
                        

                        <div>
                            <div className="title">
                                <span>description</span>
                                <h2>Ticket Description</h2>
                            </div>
                            <div className="seat">
                                <span>price</span>
                                <h2>€5</h2>
                            </div>
                            <div className="time">
                                <span>fine if you don't attend</span>
                                <h2>€4</h2>
                                <div class="barcode"></div>
                            </div> 
                        </div>

                    </div>

                    <div className="buyTicket cardRight">
                        <div class="eye"></div>
                        <div class="number">
                        
                        <input
                        type="number"
                        value={this.props.quantity}
                        onChange={event => this.props.changeQuantity(this.props.i, event.target.value)}
                         />
                        <span>Select Quantity</span>
                        </div>
                        
                    </div>
                </div> */}

        </>

    )
  }
}

export default withRouter(ColmTicket)

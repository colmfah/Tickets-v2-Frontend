import React, { Component } from 'react'

import '../Styles/Test.css'

import moment from "moment";
import DatePicker from "react-datepicker";


export class EventDetails extends Component {

    state = {
        tickets: [{}]
    }

    createNewTicket(e){
        e.preventDefault()
        let tickets = this.state.tickets
        tickets.push({})
        this.setState({tickets})
    }

    deleteTicket(e, ticketNumber){
        e.preventDefault()
        e.preventDefault()
		let tickets = this.state.tickets
		tickets.splice(ticketNumber, 1)
		this.setState({ tickets})
    }

    
    render() {


        return (
            <>
                <div id="ticketPageGrid">

                    <div className="navBar">Nav</div>

                    <div id="tickets">Tickets

                        {this.state.tickets.map((e,i)=> <div className="ticket" key={i}>
                            Ticket
                            <button onClick={event => this.deleteTicket(event, i)}    >Delete</button>
                        </div>)}
  
                    </div>

                    <div id="buttons">
                        <button onClick={event => this.createNewTicket(event)}>Create New Ticket</button>
                    
                    </div>

                </div>

            </>
  
        )
    }
}

export default EventDetails

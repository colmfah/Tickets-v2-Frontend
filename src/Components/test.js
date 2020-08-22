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


            </>
  
        )
    }
}

export default EventDetails

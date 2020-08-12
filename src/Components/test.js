import React, { Component } from 'react'

import moment from "moment";
import DatePicker from "react-datepicker";


export class EventDetails extends Component {

    state = {
        startDetails: ''
    }


    changeStartDetails(e){
         let startDetails = e
         console.log('moment(e)', moment(e).format('DD MM YY HH:mm'))
         this.setState({startDetails})
     }


    
    render() {

        return (
            <>
                <form>
                <DatePicker
                    className="datePicker"
                    timeIntervals={15}
                    selected={this.state.startDetails}
                    // onBlur = {(event)=> this.changeStartDetails(event)}
                    onChange={event => this.changeStartDetails(event)}
                    showTimeSelect
                    dateFormat="d MMM yyyy HH:mm"
                    required
                    placeholderText={'Date & Time Event Starts'}
                />
                </form>
          

            </>
  
        )
    }
}

export default EventDetails

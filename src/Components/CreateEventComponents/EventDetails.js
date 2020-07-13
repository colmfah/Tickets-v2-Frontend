import React, { Component } from 'react'

import moment from "moment";
import DatePicker from "react-datepicker";

export class EventDetails extends Component {

    state = {
        errors: []
    }

    continue = (e, values) => {

        const checkForErrors = (values) => {
            let errors = []
            if(moment(values.startTime).isAfter(moment(values.endTime))){
                errors.push(`Your event ends before it starts! Correct your start and end dates`)
            }
            if(moment(values.startTime).isBefore(moment())){
                console.log('condition', moment(values.startTime).isBefore(moment()))
                console.log('now', moment().format('DD MM YYYY HH:mm'))
                console.log('start time', moment(values.startTime).format('DD MM YYYY HH:mm'));
                
                
                
                errors.push(`Your event must start in the future! Correct your start date`)
            }
            if(moment(values.endTime).isBefore(moment())){
                errors.push(`Your event must end in the future! Correct your end date`)
                console.log('condition', moment(values.endTime).isBefore(moment()))
                console.log('now', moment().format('DD MM YYYY HH:mm'))
                console.log('end time', moment(values.endTime).format('DD MM YYYY HH:mm'));
            }
            if(values.title === ''){
                errors.push(`You must give your event a title`)
            }
            if(values.description === ''){
                errors.push(`You must give your event a description`)
            }
            if(values.region === ''){
                errors.push(`You must select a region`)
            }
            if(values.venue === ''){
                errors.push(`You must enter a venue`)
            }
            if(values.address1 === ''){
                errors.push(`You must fill in the first line of the address`)
            }
            if(values.address2 === ''){
                errors.push(`You must fill in the second line of the address`)
            }
            if(values.startDetails === ''){
                errors.push(`You must provide a start time`)
            }
            if(values.address1 === ''){
                errors.push(`You must provide an end time`)
            }
            if(values.eventPassword.length < 8){
                errors.push(`Event password must be at least 8 characters`)
            }

            return errors
        }

        e.preventDefault()

        let errors = checkForErrors(values)
        this.setState({errors})
   
        if(errors.length === 0){
            this.props.getLatLng(e)
            this.props.nextStep()
        }   
    }

    


    render() {
        const {values} = this.props
        return (
            <>
                <h2>Event Details</h2>
                <div>
                <input
                    required
                    value={values.title}
                    onChange={(event) => this.props.changeField(event, 'title')}
                    type='text'
                    placeholder='Event Name'
                    />
                </div>
        
                <div>
                    <textarea
                        value={values.description}
                        required
                        onChange={event => this.props.changeField(event, 'description')}
                        type='text'
                        placeholder='Describe the event'
                    />
                </div>
        
                <div>
                    <select
                        required		
                        value={values.region}
                        onChange={event=>this.props.changeField(event, 'region')}
                    >
                        <option value="" disabled>Select your Region</option>
                        <option value="dublin">Dublin</option>
                        <option value="cork">Cork</option>
                        <option value="other">Other</option>
                    </select>
                </div>
        
                <div>
                    <input
                        required
                        value={values.venue}
                        onChange={event => this.props.changeField(event, 'venue')}
                        type='text'
                        placeholder='Name of Venue'
                    />
                </div>
        
        
                <div>
                    <input
                        required
                        value={values.address1}
                        onChange={event => this.props.changeField(event, 'address1')}
                        type='text'
                        placeholder='Street Address'
                    />
                </div>
        
                <div>
                    <input
                        required
                        value={values.address2}
                        onChange={(event) => this.props.changeField(event, 'address2')}
                        type='text'
                        placeholder='Address Line 2'
                    />
                </div>
        
                <div>
                    <input
                        value={values.address3}
                        onChange={(event) => this.props.changeField(event, 'address3')}
                        type='text'
                        placeholder='Address Line 3 (optional)'
                    />
                </div>
        
                <div>
                    <input
                        value={values.address4}
                        onChange={event => this.props.changeField(event, 'address4')}
                        type='text'
                        placeholder='Address Line 4 (optional)'
                    />
                </div>
        
                <div>
                    <DatePicker
                        timeIntervals={15}
                        selected={values.startDetails}
                        onChange={(event) => this.props.changeField(event, "startDetails")}
                        showTimeSelect
                        dateFormat="Pp"
                        required
                        placeholderText={'Date & Time Event Starts'}
                    />
                </div>
        
               
        
                <div>
                    <DatePicker
                        timeIntervals={15}
                        selected={values.endDetails}
                        onChange={event => this.props.changeField(event, "endDetails")}
                        showTimeSelect
                        dateFormat="Pp"
                        required
                        placeholderText={'Date & Time Event Ends'}
                    />
                </div>
        
                <div>
                    <input
                        value={values.eventPassword}
                        required
                        onChange={event => this.props.changeField(event, 'eventPassword')}
                        type='password'
                        placeholder='password to check customers in'
                    />
                </div>

                <button onClick={event => this.continue(event, values)}>Continue</button>

                {this.state.errors.map((e,i)=> {return (
                    <div key={i}>
                        <div>{e}</div>
                    </div>
                
                )})}
            </>
  
        )
    }
}

export default EventDetails

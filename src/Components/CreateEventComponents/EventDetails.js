import React, { Component } from 'react'

import moment from "moment";
import DatePicker from "react-datepicker";

export class EventDetails extends Component {

    state= {errors: []}

    continue = (e, values) => {    
        const checkForErrors = (values) => {            
            let errors = []

            if(values.title === ''){
                errors.push(`Please name your event`)
            }
            if(values.description === ''){
                errors.push(`Please provide a description for your event`)
            }
            if(values.region === ''){
                errors.push(`Please select a region`)
            }
            if(values.venue=== ''){
                errors.push(`Please name the venue in which your event is taking place`)
            }
            if(values.address1 === ''){
                errors.push(`Please fill out the first line of the address of the venue`)
            }
            if(values.address2 === ''){
                errors.push(`Please fill out the second line of the address of the venue`)
            }
            if(values.startDetails === ''){
                errors.push(`Please provide a start time`)
            }
            if(values.startDetails === ''){
                errors.push(`Please provide an end time`)
            }
            if(values.eventPassword.length < 6){
                errors.push(`Please provide a password with at least 6 characters`)
            }
            if(!moment(values.endDetails).isAfter(values.startDetails)){
                errors.push(`You have chosen an end time that is before your start time`)
            }

            return errors
        }

        let errors = checkForErrors(values)

        if(errors.length === 0 ){
            // this.props.getLatLng()
            this.props.nextStep() 
        }else{
            this.setState({errors})
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
                        onBlur={this.props.getLatLng}
                    />
                </div>
        
                <div>
                    <input
                        required
                        value={values.address2}
                        onChange={(event) => this.props.changeField(event, 'address2')}
                        type='text'
                        placeholder='Address Line 2'
                        onBlur={this.props.getLatLng}
                    />
                </div>
        
                <div>
                    <input
                        value={values.address3}
                        onChange={(event) => this.props.changeField(event, 'address3')}
                        type='text'
                        placeholder='Address Line 3 (optional)'
                        onBlur={this.props.getLatLng}
                    />
                </div>
        
                <div>
                    <input
                        value={values.address4}
                        onChange={event => this.props.changeField(event, 'address4')}
                        type='text'
                        placeholder='Address Line 4 (optional)'
                        onBlur={this.props.getLatLng}
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

                {this.state.errors.map((e,i) => <div key={i}>{e}</div>)}

            </>
  
        )
    }
}

export default EventDetails

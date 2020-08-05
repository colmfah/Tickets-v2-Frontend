import React, { Component } from 'react'
import Nav from "../Nav";
import moment from "moment";
import DatePicker from "react-datepicker";
import '../../Styles/Grid.css'
import '../../Styles/Cards.css'
import '../../Styles/Forms.css'
import '../../Styles/Buttons.css'
import '../../Styles/Global.css'
import '../../Styles/Nav.css'

export class EventDetails extends Component {

    state= {errors: []}

    continue = (e, values) => { 
        e.preventDefault()   
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
        let selectColor
        values.region === '' ? selectColor = 'rgb(118, 118, 118)' : selectColor = 'black'
        return (
            <>

                <Nav />

                <div className="grid center tall middle">
                    <div></div>
                    <div className="card">
                        <div class ="content">

                            <form>
                       
                                <div className="group">
                                    <input
                                        required
                                        value={values.title}
                                        onChange={(event) => this.props.changeField(event, 'title')}
                                        type='text'
                                        placeholder='Event Name'
                                        />
                                </div>
                        
                                <div className="group">
                                    <textarea
                                        value={values.description}
                                        required
                                        onChange={event => this.props.changeField(event, 'description')}
                                        type='text'
                                        placeholder='Describe The Event'
                                    />
                                </div>
                        
                                <div className="group">
                                    <select
                                        required		
                                        value={values.region}
                                        onChange={event=>this.props.changeField(event, 'region')}                                 
                                        style={{ color: selectColor }}
                                    >
                                        <option value="" disabled>Select your Region</option>
                                        <option value="dublin">Dublin</option>
                                        <option value="cork">Cork</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                        

                        
                        
                                <div className="group">
                                    <DatePicker
                                        className="datePicker"
                                        timeIntervals={15}
                                        selected={values.startDetails}
                                        onChange={(event) => this.props.changeField(event, "startDetails")}
                                        showTimeSelect
                                        dateFormat="Pp"
                                        required
                                        placeholderText={'Date & Time Event Starts'}
                                    />
                                </div>
                        
                            
                        
                                <div className="group datepicker">
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
                        
                                <div className="group">
                                    <input
                                        value={values.eventPassword}
                                        required
                                        onChange={event => this.props.changeField(event, 'eventPassword')}
                                        type='password'
                                        placeholder='Password To Check Customers In'
                                    />
                                </div>

                                <button className="primary" onClick={event => this.continue(event, values)}>Continue</button>

                            </form>

                            <div className="warning">
                                <ul>
                                {this.state.errors.map((e,i) => <li  key={i}>{e}</li>)}
                                </ul>
                            </div>

                            
                        </div>
                    </div>
                    <div></div>
                </div>

            </>
  
        )
    }
}

export default EventDetails

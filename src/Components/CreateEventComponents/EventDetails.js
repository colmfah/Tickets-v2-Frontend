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

    state= {
        errors: [],
        borderColors:{
            title: 'none',
            description: 'none',
            region: 'none',
            startDetails: 'none',
            endDetails: 'none',
            eventPassword: 'none',  
        }
    }

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

    borderColor = (e, field) => {
        e.preventDefault()
        let borderColors = this.state.borderColors
        e.target.value === '' ? borderColors[field] = 'tomato' : borderColors[field] = '#00988f'
        if(field ==='description'){borderColors[field] = '#00988f'}

        this.setState({borderColors})
    }

    
    render() {
        const {values} = this.props
        let selectColor
        values.region === '' ? selectColor = 'rgb(118, 118, 118)' : selectColor = 'black'
        return (
            <>
                <div className="pageGrid2Rows">
                
                    <div className="navBar"><Nav /></div>
                        
                    <div className="formColumnGrid">
                        
                        <div></div>
                            <div className ="formRowGrid">
                                <div></div>
                                <div className="theForm card">
                                    <div class ="content">

                                        <form>
                                
                                            <div className="group">
                                                <input
                                                    required
                                                    value={values.title}
                                                    onChange={(event) => this.props.changeField(event, 'title')}
                                                    onBlur = {event => this.borderColor(event, 'title')}
                                                    type='text'
                                                    placeholder='Event Name'
                                                    style={{borderColor: this.state.borderColors.title}}
                                                    
                                             
                                                    />
                                            </div>
                                    
                                            <div className="group">
                                                <textarea
                                                    value={values.description}
                                                    required
                                                    onBlur = {event => this.borderColor(event, 'description')}
                                                    onChange={event => this.props.changeField(event, 'description')}
                                                    type='text'
                                                    placeholder='Describe The Event'
                                                    style={{borderColor: this.state.borderColors.description}}
                                                />
                                            </div>
                                    
                                            <div className="group">
                                                <select
                                                    required		
                                                    value={values.region}
                                                    onBlur = {event => this.borderColor(event, 'region')}
                                                    onChange={event=>this.props.changeField(event, 'region')}                                 
                                                    style={{ color: selectColor, borderColor: this.state.borderColors.region }}
                                                 
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
                                                    onBlur = {event => this.borderColor(event, 'startDetails')}
                                                    onChange={(event) => this.props.changeField(event, "startDetails")}
                                                    showTimeSelect
                                                    dateFormat="d MMM yyyy HH:mm"
                                                    required
                                                    placeholderText={'Date & Time Event Starts'}
                                                    style={{borderColor: this.state.borderColors.startDetails}}
                                                />
                                            </div>
                                    
                                        
                                    
                                            <div className="group datepicker"   style={{border: 'solid 1px green', borderRadius: '6px'}}>
                                                <DatePicker
                                                    timeIntervals={15}
                                                    selected={values.endDetails}
                                                    onBlur = {event => this.borderColor(event, 'endDetails')}
                                                    onChange={event => this.props.changeField(event, "endDetails")}
                                                    showTimeSelect
                                                    dateFormat="d MMM yyyy HH:mm"
                                                    required
                                                    placeholderText={'Date & Time Event Ends'}
                                                    style={{borderColor: this.state.borderColors.endDetails}}
                                                    
                                                />
                                            </div>
                                    
                                            <div className="group">
                                                <input
                                                    value={values.eventPassword}
                                                    required
                                                    onBlur = {event => this.borderColor(event, 'eventPassword')}
                                                    onChange={event => this.props.changeField(event, 'eventPassword')}
                                                    type='password'
                                                    placeholder='Password To Check Customers In'
                                                    style={{borderColor: this.state.borderColors.eventPassword}}
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
                        <div></div>
                        
                    </div>
                
                </div>
            </>
  
        )
    }
}

export default EventDetails

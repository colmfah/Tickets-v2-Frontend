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

    constructor(){
        super()
        this.changeStartDetails= this.changeStartDetails.bind(this)
        }

    state= {
        errors: [],
        borderColors:{
            title: 'none',
            description: 'none',
            region: 'none',
            startDetails: '#e2e2e2',
            endDetails: '#e2e2e2',
            eventPassword: 'none',  
        },
        region: '',
        title: '',
        description: '',
        startDetails: '',
        endDetails: '',
        eventPassword: '',



        titleErrors: [],
        regionErrors: [],
        startDetailsErrors: [],
    }
    componentDidMount(){
        //initialise state to the values from props (in case user 'goes back')
    }

    changeField = (e, field) => {
        
        e.preventDefault()
        let stateCopy = this.state
        let value 
        if (field === "startDetails" || field === "endDetails") {value = e}
        else{value = e.target.value }
        stateCopy[field] = value
        if(field === 'description' || e.target.value !== ''){
            stateCopy.borderColors[field] = '#00988f'
        }else{
            stateCopy.borderColors[field] = 'tomato'  
        }
        this.setState(stateCopy)
      
    }

    changeRegion = (e) => {
        e.preventDefault()
        let region = e.target.value
        let borderColors = this.state.borderColors
        let regionErrors = []
        if(e.target.value === ''){
            regionErrors.push('Please Select A Region')
            borderColors.title = 'tomato'  
        }else{
            borderColors.region = '#00988f'  
        }
        this.setState({region, borderColors, regionErrors})
    }

    changeTitle = (e) => {
        e.preventDefault()
        let title = e.target.value
        let borderColors = this.state.borderColors      
        let titleErrors = []
        if(e.target.value === ''){
            titleErrors.push('Please Name Your Event')
            borderColors.title = 'tomato'  
        }else{
            borderColors.title = '#00988f'  
        }
        this.setState({title, borderColors, titleErrors})
    }

    changeDescription = (e) => {
        e.preventDefault()
        let description = e.target.value
        let borderColors = this.state.borderColors
        borderColors.description = '#00988f' 
        this.setState({borderColors, description})
    }

    changeStartDetails = (e) => {
    
        e.preventDefault()
        let borderColors = this.state.borderColors
        let startDetails = this.state.startDetails
        let startDetailsErrors = []

        console.log('moment(e)', moment(e).format('DD MM YY HH:mm'))
        console.log('moment()', moment().format('DD MM YY HH:mm'));
        console.log('!moment(e).isAfter(moment())', !moment(e).isAfter(moment()));
        
        
        

        if(!moment(e).isAfter(moment())){
            startDetailsErrors.push('Your Event Must Start In The Future')
            borderColors.startDetails = 'tomato'
        }else{
            startDetails = e
            borderColors.startDetails = '#00988f'       
        }
        this.setState({startDetails, borderColors, startDetailsErrors})
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

    //  

    borderColor = (e, field) => {
        e.preventDefault()
        let value 
        if (field === "startDetails" || field === "endDetails") {value = e}
        else{value = e.target.value }
        
        let borderColors = this.state.borderColors
        value === '' ? borderColors[field] = 'tomato' : borderColors[field] = '#00988f'
        if(field ==='description'){borderColors[field] = '#00988f'}

        this.setState({borderColors})
    }

    
    render() {
        const {values} = this.props
        let selectColor
        this.state.region === '' ? selectColor = 'rgb(118, 118, 118)' : selectColor = 'black'




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
                                            {this.state.titleErrors.map((e,i)=><p className='warning' key={i}>{e}</p>)} 
                                            <div className="group">
                                                <input
                                                    required
                                                    value={this.state.title}
                                                    onChange={event => this.changeTitle(event)}
                                                    onBlur = {event => this.changeTitle(event)}
                                                    type='text'
                                                    placeholder='Event Name'
                                                    style={{borderColor: this.state.borderColors.title}}
                                                />
                                                
                                                
                                            </div>
                                    
                                            <div className="group">
                                                <textarea
                                                    value={this.state.description}
                                                    required
                                                    onBlur = {event => this.changeDescription(event)}
                                                    onChange={event => this.changeDescription(event)}
                                                    type='text'
                                                    placeholder='Describe The Event'
                                                    style={{borderColor: this.state.borderColors.description}}
                                                />
                                            </div>
                                            
                                            {this.state.regionErrors.map((e,i)=><p className='warning'>{e}</p>)}
                                            <div className="group">
                                                <select
                                                    required		
                                                    value={this.state.region}
                                                    onBlur = {event => this.changeRegion(event)}
                                                    onChange={event => this.changeRegion.bind(this, event)}                               
                                                    style={{ color: selectColor, borderColor: this.state.borderColors.region }}
                                                >
                                                    <option value="" disabled>Select your Region</option>
                                                    <option value="dublin">Dublin</option>
                                                    <option value="cork">Cork</option>
                                                    <option value="other">Other</option>
                                                </select>
                                                
                                            </div>
                                    

                                    
                                            {this.state.startDetailsErrors.map((e,i)=><p className='warning' key={i}>{e}</p>)}
                                            <div className="group datePickerDiv" style={{borderColor: this.state.borderColors.startDetails }}>
                                                <DatePicker
                                                    className="datePicker"
                                                    timeIntervals={15}
                                                    selected={this.state.startDetails}
                                                    onBlur = {(event)=> this.changeStartDetails(event)}
                                                    onChange={(event)=> this.changeStartDetails(event)}
                                                    showTimeSelect
                                                    dateFormat="d MMM yyyy HH:mm"
                                                    required
                                                    placeholderText={'Date & Time Event Starts'}
                                                    style={{borderColor: this.state.borderColors.startDetails}}
                                                />
                                            </div>
                                            
                                    
                                        
                                    
                                            <div className="group datePickerDiv" style={{borderColor: this.state.borderColors.endDetails }}>
                                                <DatePicker
                                                    className="datePicker"
                                                    timeIntervals={15}
                                                    selected={this.state.endDetails}
                                                    onBlur = {event => this.borderColor(event, 'endDetails')}
                                                    onChange={event => this.changeField(event, "endDetails")}
                                                    showTimeSelect
                                                    dateFormat="d MMM yyyy HH:mm"
                                                    required
                                                    placeholderText={'Date & Time Event Ends'}
                                                />
                                            </div>
                                    
                                            <div className="group">
                                                <input
                                                    value={this.state.eventPassword}
                                                    required
                                                    onBlur = {event => this.borderColor(event, 'eventPassword')}
                                                    onChange={event => this.changeField(event, 'eventPassword')}
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

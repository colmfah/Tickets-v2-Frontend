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
        errors: {        
            title: '',
            region: '',
            startDetails: '',
            endDetails: ''
        },
        borderColors:{
            title: 'none',
            description: 'none',
            region: 'none',
            startDetails: 'none',
            endDetails: 'none',
            eventPassword: 'none',  
        }
    }

    componentDidMount(){
        
        const {values} = this.props

        this.setState({
            region: values.region,
            title: values.title,
            description: values.description,
            startDetails: values.startDetails,
            endDetails: values.endDetails,
            eventPassword: values.eventPassword
        })
    }

    changeDescription(e){
        let description = e.target.value
        let borderColors = this.state.borderColors
        borderColors.description = '#00988f' 
        this.setState({borderColors, description})
    }

    checkDescriptionError(){
        let borderColors = this.state.borderColors
        borderColors.description = '#00988f'  
        this.setState({ borderColors})
    }

    changeEndDetails(e){
        let endDetails = e
        let errors = this.state.errors
        errors.endDetails = ''
        this.setState({endDetails, errors})
    }

    changePassword(e){
        let eventPassword = e.target.value
        let errors = this.state.errors
        errors.eventPassword = ''      
        this.setState({eventPassword, errors})
    }

    changeRegion(e){
        this.props.changeField(e, 'region')
        let region = e.target.value
        let errors = this.state.errors
        errors.region = ''   
        this.setState({errors}) 
        this.checkRegionError(region)       
    }

    changeTitle(e){
        let title = e.target.value
        let errors = this.state.errors
        errors.title = ''      
        this.setState({title, errors})
        this.checkTitleError(title)
    }

    changeStartDetails(e){
        let startDetails = e
        let errors = this.state.errors
        errors.startDetails = ''
        this.setState({startDetails, errors})
    }

    checkEndDetailsError(values){        
        let borderColors = this.state.borderColors
        let errors = this.state.errors
        if(values.endDetails === ''){
            errors.endDetails = 'Please Provide An End Time'
            borderColors.endDetails = 'tomato'
        }else if(!moment(values.endDetails).isAfter(moment(values.startDetails))){
            errors.endDetails ='Your Event Must End After It Starts'
            borderColors.endDetails = 'tomato'
        }else{
            errors.endDetails = ''
            borderColors.endDetails = '#00988f'       
        }

        this.setState({ borderColors, errors})
        
    }

    checkPasswordError(values){
        let borderColors = this.state.borderColors
        let errors = this.state.errors
        if(values.eventPassword.length < 6){
            errors.eventPassword = 'Your Password Must Be At Least 6 Characters'
            borderColors.eventPassword = 'tomato'
        }
        else{
            errors.eventPassword = ''
            borderColors.eventPassword = '#00988f'       
        }
        this.setState({ borderColors, errors})
    }

    checkRegionError(region){   
        
        let borderColors = this.state.borderColors
        let errors = this.state.errors
        
        if(region === ''){
            errors.region = 'Please Select Your Region'
            borderColors.region = 'tomato'
        }else{
            errors.region = ''
            borderColors.region = '#00988f' 
        }
        this.setState({errors, borderColors})
    }

    checkStartDetailsError(values){    
        let borderColors = this.state.borderColors
        let startDetails = values.startDetails
        let errors = this.state.errors
        if(startDetails === ''){
            errors.startDetails = 'Please Provide A Start Time'
            borderColors.startDetails = 'tomato'
        }
        else if(!moment(startDetails).isAfter(moment())){
            errors.startDetails = 'Your Event Must Start In The Future'
            borderColors.startDetails = 'tomato'
        }else{
            errors.startDetails = ''
            borderColors.startDetails = '#00988f'       
        }
        this.setState({borderColors, errors})
    }

    checkTitleError(title){
        let borderColors = this.state.borderColors
        let errors = this.state.errors
        if(title === ''){
            errors.title = 'Please Name Your Event'
            borderColors.title = 'tomato'
        }
        else{
            errors.title = ''
            borderColors.title = '#00988f'       
        }
        this.setState({ borderColors, errors})
    }

    continue(values){ 
        
        this.checkTitleError(values.title)
        this.checkRegionError(values.region)
        this.checkStartDetailsError(values)
        this.checkEndDetailsError(values)
        this.checkPasswordError(values)


        let errors = Object.entries(this.state.errors)
        let elementsWithErrors = []

        errors.forEach(e => {
            if(e[1]!==''){
                elementsWithErrors.push(e[0])
            }
        })

        if(elementsWithErrors.length > 0 ){
            document.getElementById(elementsWithErrors[0]).scrollIntoView({behavior: "smooth"})
        }else{
 
            this.props.nextStep() 
        }
    }

    turnBorderOrange(e, field){
        e.preventDefault()
        console.log('border orange');
        

        let borderColors = this.state.borderColors
        borderColors[field] = '#ff8c00'
        console.log(borderColors);
        
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
                                            <p className='warning' id="title">{this.state.errors.title}</p>
                                            <div className="group">
                                                <input
                                                    required
                                                    value={values.title}
                                                    onChange={event => this.props.changeField(event, 'title')}
                                                    onFocus={event => this.turnBorderOrange(event, 'title')}
                                                    onBlur={event => this.checkTitleError(values.title)}
                                                    type='text'
                                                    placeholder='Event Name'
                                                    style={{borderColor: this.state.borderColors.title}}
                                                />
                                                
                                                
                                            </div>
                                    
                                            <div className="group">
                                                <textarea
                                                    value={values.description}
                                                    required
                                                    onChange={event => this.props.changeField(event, 'description')}
                                                    onFocus={event => this.turnBorderOrange(event, 'description')}
                                                    onBlur={event => this.checkDescriptionError(event)}
                                                    type='text'
                                                    placeholder='Describe The Event'
                                                    style={{borderColor: this.state.borderColors.description}}
                                                />
                                            </div>
                                            
                                            <p className='warning' id="region">{this.state.errors.region}</p>
                                            <div className="group">
                                                <select
                                                    required		
                                                    value={values.region}
                                                    onChange={event => this.changeRegion(event)}
                                                    onFocus={event => this.turnBorderOrange(event, 'region')}
                                                    onBlur={event => this.checkRegionError(values.region)}                           
                                                    style={{ color: selectColor, borderColor: this.state.borderColors.region }}
                                                >
                                                    <option value="" disabled>Select your Region</option>
                                                    <option value="dublin">Dublin</option>
                                                    <option value="cork">Cork</option>
                                                    <option value="other">Other</option>
                                                </select>
                                                
                                            </div>
                                    

                                            <p className='warning' id="startDetails">{this.state.errors.startDetails}</p>
                                            <div className="group datePickerDiv" style={{borderColor: this.state.borderColors.startDetails }}>
                                                <DatePicker
                                                    className="datePicker"
                                                    timeIntervals={15}
                                                    selected={values.startDetails}
                                                    onChange={event => this.props.changeField(event, 'startDetails')}
                                                    onFocus={event => this.turnBorderOrange(event, 'startDetails')}
                                                    onBlur={() =>this.checkStartDetailsError(values)}
                                                    showTimeSelect
                                                    dateFormat="d MMM yyyy HH:mm"
                                                    required
                                                    placeholderText={'Date & Time Event Starts'}
                                                    style={{borderColor: this.state.borderColors.startDetails}}
                                                />
                                            </div>
                                            
                                    
                                        
                                            <p className='warning' id="endDetails">{this.state.errors.endDetails}</p>
                                            <div className="group datePickerDiv" style={{borderColor: this.state.borderColors.endDetails }}>
                                                <DatePicker
                                                    className="datePicker"
                                                    timeIntervals={15}
                                                    selected={values.endDetails}
                                                    onChange={event => this.props.changeField(event, 'endDetails')}
                                                    onBlur={() =>this.checkEndDetailsError(values)}
                                                    onFocus={event => this.turnBorderOrange(event, 'endDetails')}
                                                    showTimeSelect
                                                    dateFormat="d MMM yyyy HH:mm"
                                                    required
                                                    placeholderText={'Date & Time Event Ends'}
                                                />
                                            </div>

                                            <p className='warning' id="eventPassword">{this.state.errors.eventPassword}</p>
                                            <div className="group">
                                                <input
                                                    value={values.eventPassword}
                                                    required
                                                    onChange={event => this.props.changeField(event, 'eventPassword')}
                                                    onBlur={() =>this.checkPasswordError(values)}
                                                    onFocus={event => this.turnBorderOrange(event, 'eventPassword')}
                                                    type='password'
                                                    placeholder='Password To Check Customers In'
                                                    style={{borderColor: this.state.borderColors.eventPassword}}
                                                />
                                            </div>

                                            <button className="primary" onClick={() => this.continue(values)}>Continue</button>

                                        </form>
                                        
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

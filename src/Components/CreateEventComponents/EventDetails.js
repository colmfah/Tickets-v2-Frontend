import React, { Component } from 'react'
import Nav from "../Nav";
import Footer from "../Footer";
import moment from "moment";
import DatePicker from "react-datepicker";
import '../../Styles/CreateEvent.css'


export class EventDetails extends Component {

    state= {
        errors: {        
            title: '',
            region: '',
            startDetails: '',
            endDetails: '',
            description: ''
        },
        borderColors:{
            title: 'none',
            description: 'none',
            region: 'none',
            startDetails: 'none',
            endDetails: 'none',
            eventPassword: 'none',  
        },
        textAreaHeight: '100px',
        message: ''
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
        let errors = this.state.errors
        if(this.props.values.description === ''){
            errors.description = 'Please Provide A Description'
            borderColors.description = 'red'
        }
        else{
            errors.description = ''
            borderColors.description = '#00988f'       
        }
        this.setState({ borderColors, errors})
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
        if(moment(values.startDetails).isValid() && values.endDetails === ''){
            errors.endDetails = 'Please Provide An End Time'
            borderColors.endDetails = 'red'
        }
        else if(moment(values.startDetails).isValid() && !moment(values.endDetails).isAfter(moment(values.startDetails))){
         
            errors.endDetails ='Your Event Must End After It Starts'
            borderColors.endDetails = 'red'
        }
        else if(!moment(values.endDetails).isAfter(moment())){
            errors.endDetails = 'Your Event Must End In The Future'
            borderColors.endDetails = 'red'
        }
        else{
            errors.endDetails = ''
            borderColors.endDetails = '#00988f'       
        }

        this.setState({ borderColors, errors})
        
    }

    checkPasswordError(values){
        let borderColors = this.state.borderColors
        let errors = this.state.errors
        errors.eventPassword = ''
        borderColors.eventPassword = '#00988f'  
        if(this.props.amendingEvent && (values.eventPassword === undefined || values.eventPassword.length === 0)){this.setState({ borderColors, errors}); return}
        if(values.eventPassword.length < 6){
            errors.eventPassword = 'Your Password Must Be At Least 6 Characters'
            borderColors.eventPassword = 'red'
        }
     
        this.setState({ borderColors, errors})
    }

    checkRegionError(region){   
        
        let borderColors = this.state.borderColors
        let errors = this.state.errors
        
        if(region === ''){
            errors.region = 'Please Select Your Region'
            borderColors.region = 'red'
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
            borderColors.startDetails = 'red'
        }
        else if(!moment(startDetails).isAfter(moment())){
            console.log('moment(startDetails)', moment(startDetails).format('DD MM YY'))
            console.log('moment()', moment().format('DD MM YY'))
            errors.startDetails = 'Your Event Must Start In The Future'
            borderColors.startDetails = 'red'
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
            borderColors.title = 'red'
        }
        else{
            errors.title = ''
            borderColors.title = '#00988f'       
        }
        this.setState({ borderColors, errors})
    }

    continue(event, values){ 
        event.preventDefault()
        this.checkTitleError(values.title)
        this.checkStartDetailsError(values)
        this.checkEndDetailsError(values)
        this.checkPasswordError(values)
        this.checkDescriptionError(values.title)


        let errors = Object.entries(this.state.errors)
        let elementsWithErrors = []

        errors.forEach(e => {
            if(e[1]!==''){
                elementsWithErrors.push(e[0])
            }
        })

        if(elementsWithErrors.length > 0 ){
            document.getElementsByClassName('create-event-container')[0].scrollIntoView({behavior: "smooth"})
        }else{
 
            this.props.nextStep('eventDetails') 
        }
    }



      handleTextAreaChange(e){
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`; 
        this.handleFieldChange(e, 'description')
      }

      checkForDateErrors(){
        this.checkStartDetailsError(this.props.values)
        if(this.props.values.endDetails === ''){return}
        this.checkEndDetailsError(this.props.values)
      }

      resetError(field){
          let errors = this.state.errors
          let borderColors = this.state.borderColors
          errors[field]=''
          borderColors[field] = 'none' 
          this.setState({ borderColors, errors})
      }

      handleFieldChange(event, field){
        this.resetError(field)
        this.props.changeField(event, field)
      }

      spinnerVisibility(){
          if(this.props.spin){return {'display': 'block'}} 
          return {'display': 'none'}       
    }
    
    disableOrEnableButton(){
        if(this.props.updating){
            return 'create-event-button disable-button'
        }
        return 'create-event-button'
    }



    
    render() {
        const {values} = this.props

        return (
            <>
                <form className="create-event-form">
                <div className="create-event-heading">
                    <header>Event Details</header>
                    <hr />
                </div>    

                <p className='create-event-warning' id="title">{this.state.errors.title}</p>
                    <input
                        required
                        value={values.title}
                        onChange={event => this.handleFieldChange(event, 'title')}
                        onBlur={event => this.checkTitleError(values.title)}
                        type='text'
                        placeholder='Event Name'
                        style={{borderColor: this.state.borderColors.title}}
                        
                    />
                    <p className='create-event-warning' id="startDetails">{this.state.errors.startDetails}</p>
                    <div className="datePickerDiv" style={{borderColor: this.state.borderColors.startDetails }}>
                        <DatePicker
                            id="datePicker"
                            timeIntervals={15}
                            selected={Date.parse(values.startDetails)}
                            onChange={event => this.handleFieldChange(event, 'startDetails')}    
                            onCalendarClose={(event) => this.checkForDateErrors()}
                            showTimeSelect
                            dateFormat="d MMM yyyy, HH:mm"
                            required
                            placeholderText={'Date & Time Event Starts'}
                            style={{borderColor: this.state.borderColors.startDetails}}
                            autoComplete="off"
                        />
                    </div>
                    <p className='create-event-warning' id="endDetails">{this.state.errors.endDetails}</p>
                    <div className="datePickerDiv" style={{borderColor: this.state.borderColors.endDetails }}>
                        <DatePicker
                            id="datePicker"
                            timeIntervals={15}
                            selected={Date.parse(values.endDetails)}
                            onChange={event => this.handleFieldChange(event, 'endDetails')}
                            onCalendarClose={event => this.checkForDateErrors()}
                            showTimeSelect
                            dateFormat="d MMM yyyy, HH:mm"
                            required
                            placeholderText={'Date & Time Event Ends'}
                            style={{borderColor: 'purple'}}
                            autoComplete="off"
                        />
                    </div>
                    <p className='create-event-warning' id="eventPassword">{this.state.errors.eventPassword}</p>
                    <input
                        value={values.eventPassword}                  
                        onChange={event => this.handleFieldChange(event, 'eventPassword')}
                        onBlur={() =>this.checkPasswordError(values)}
                        type='password'
                        placeholder='Password To Check Customers In'
                        style={{borderColor: this.state.borderColors.eventPassword}}
                    />          
                    <p className='create-event-warning' id="description">{this.state.errors.description}</p>
                    <textarea
                        value={values.description}
                        required
                        minLength="6"
                        onChange={event => this.handleTextAreaChange(event)}
                        onFocus={event => this.handleTextAreaChange(event)}
                        onBlur={event => this.checkDescriptionError(event)}
                        type='text'
                        placeholder='Describe The Event'
                        style={{borderColor: this.state.borderColors.description, height: this.state.textAreaHeight}}
                    />
                    <br />
                <div style={this.spinnerVisibility()}   className ='ticket-spinner'>
                    
                    <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
                </div>
                <div>{this.props.message}</div>
                    <button className={this.disableOrEnableButton()} onClick={(event) => this.continue(event, values)}>{this.props.buttonText}</button>
                </form>
            </>
        )
    }
}

export default EventDetails

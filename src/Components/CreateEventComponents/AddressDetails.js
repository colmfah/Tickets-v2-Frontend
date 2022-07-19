
import React from 'react'
import Map from "./Map"
import '../../Styles/Cards.css'
import '../../Styles/Forms.css'
import '../../Styles/Buttons.css'
import '../../Styles/Global.css'
import '../../Styles/Nav.css'




class AddressDetails extends React.Component {

    state = {
        borderColors: {
            address1: 'none',
            address2: 'none',
            address3: 'none',
            address4: 'none',
            venue: 'none',
        },
        errors: {  
            address1: '',
            address2: '',
            address3: '',
            address4: '',
            venue: '',
        }
    }

    componentDidMount(){
        
        const {values} = this.props

        this.setState({
            venue: values.venue,
            address1: values.address1,
            address2: values.address2,
            address3: values.address3,
            address4: values.address4,
            lat: values.lat,
            lng: values.lng
        })
    }

    continue = (event, values) => { 
        event.preventDefault()
        this.checkForError(values.venue, 'venue')
        this.checkForError(values.address1, 'address1')
        this.checkForError(values.address2, 'address2')

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

            this.props.nextStep('addressDetails') 
        }

    }

    checkForError(data, field){
        let borderColors = this.state.borderColors
        let errors = this.state.errors
        if(data === ''){
            let warning
            if(field==='venue'){
                warning = 'Please Name The Venue'
            }else if(field === 'address1'){
                warning = 'Please Provide First Line Of Address'
            }else if(field === 'address2'){
                warning = 'Please Provide Second Line Of Address'
            }
            errors[field] = warning
            borderColors[field] = 'tomato'
        }
        else{
            errors[field]= ''
            borderColors[field] = '#00988f'       
        }
        this.setState({ borderColors, errors})
    }

    checkForErrorOptionalField(field){
        let borderColors = this.state.borderColors
        borderColors[field] = '#00988f'       
        this.setState({ borderColors})
    }

    
    goBack = (e) => {
        e.preventDefault()
        this.props.prevStep()
    }

 

    updateData(e, field){
        this.props.changeField(e, field)
        let stateCopy = this.state
        stateCopy.errors[field] = ''
        this.setState(stateCopy)
    }

    displayGoBackButton(){
        if(this.props.amendingEvent){return}
        return (<button className="create-event-button" onClick={event => this.goBack(event)}>Go Back</button>)
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
                    <header>Address Details</header>
                    <hr />
                </div>    
                <p className='create-event-warning' id="venue">{this.state.errors.venue}</p>
                <input
                    required
                    value={values.venue}
                    onChange={event => this.updateData(event, 'venue')}
                    onBlur={event => this.checkForError(values.venue, 'venue')}
                    type='text'
                    placeholder='Name of Venue'
                    style={{borderColor: this.state.borderColors.venue}}
                />
                <p className='create-event-warning' id="address1">{this.state.errors.address1}</p>
                <input
                    required
                    value={values.address1}
                    onChange={event => this.updateData(event, 'address1')}
                    onBlur={event => {this.checkForError(values.address1, 'address1'); this.props.getLatLng(event)}}
                    type='text'
                    placeholder='Street Address'
                    style={{borderColor: this.state.borderColors.address1}}
                />
                <p className='create-event-warning' id="address2">{this.state.errors.address2}</p>     
                <input
                    required
                    value={values.address2}
                    onChange={event => this.updateData(event, 'address2')}
                    onBlur={event => {this.checkForError(values.address2, 'address2'); this.props.getLatLng(event)}}
                    type='text'
                    placeholder='Address Line 2'
                    style={{borderColor: this.state.borderColors.address2}}
                />
                <p className='create-event-warning'></p> 
                <input
                    value={values.address3}
                    onChange={event => this.updateData(event, 'address3')}
                    onBlur={event => {this.checkForErrorOptionalField('address3'); this.props.getLatLng(event)}}
                    type='text'
                    placeholder='Address Line 3 (optional)'
                    style={{borderColor: this.state.borderColors.address3}}
                />
                <p className='create-event-warning'></p> 
                <input
                    value={values.address4}
                    onChange={event => this.updateData(event, 'address4')}
                    onBlur={event => {this.checkForErrorOptionalField('address4'); this.props.getLatLng(event)}}
                    type='text'
                    placeholder='Address Line 4 (optional)'
                    style={{borderColor: this.state.borderColors.address4}}
                />
                <Map
                    google={this.props.google}
                    center={{lat: values.lat, lng: values.lng}}
                    height='300px'
                    zoom={15}
                    getLatLngAfterDrag={this.props.getLatLngAfterDrag}
                />
                <br />
                <div style={this.spinnerVisibility()}   className ='ticket-spinner'>
                    <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
                </div>
                <div>{this.props.message}</div>
                <div className="create-event-button-container">
                    {this.displayGoBackButton() }
                    <button className={this.disableOrEnableButton()} onClick={(event)=> this.continue(event, values)}>{this.props.buttonText}</button>   
                </div>
            </form>
	    </>
		)
}
}

export default AddressDetails

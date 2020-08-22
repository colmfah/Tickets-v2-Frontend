
import React from 'react'
import Geocode from "react-geocode"
import Map from "./Map"
import Nav from "../Nav"
import '../../Styles/Grid.css'
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
        },
       
        address1: '',
        address2: '',
        address3: '',
        address4: '',
		lat: 53.34723555464459,
        lng: -6.258907671241786,
        venue: ''
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

    continue = (values) => { 
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

            this.props.nextStep() 
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
        this.props.saveDataToParent({
            venue: this.state.venue,
            address1: this.state.address1,
            address2: this.state.address2,
            address3: this.state.address3,
            address4: this.state.address4,
            lat: this.state.lat,
            lng: this.state.lng
        })
        this.props.prevStep()
    }

    turnBorderOrange(e, field){
        e.preventDefault()
        let borderColors = this.state.borderColors
        borderColors[field] = '#ff8c00'
        console.log(borderColors);
        
        this.setState({borderColors})
    }

    updateData(e, field){
        this.props.changeField(e, field)
        let stateCopy = this.state
        stateCopy.errors[field] = ''
        this.setState(stateCopy)
    }


	render() {

        const {values} = this.props

	  return (
			<>
                <div className="pageGrid2Rows">
                    <div className="navBar"><Nav /></div>
        
                    <div className="formColumnGrid">
                        <div></div>

                        <div className ="formRowGrid">

                            <div></div>

                            <div className="theForm card">
                                <div className ="content">
                                    <form>
                                        <p className='warning' id="venue">{this.state.errors.venue}</p>
                                        <div className="group">
                                            <input
                                                required
                                                value={values.venue}
                                                onChange={event => this.updateData(event, 'venue')}
                                                onFocus={event => this.turnBorderOrange(event, 'venue')}
                                                onBlur={event => this.checkForError(values.venue, 'venue')}
                                                type='text'
                                                placeholder='Name of Venue'
                                                style={{borderColor: this.state.borderColors.venue}}
                                            />
                                        </div>

                                        <p className='warning' id="address1">{this.state.errors.address1}</p>
                                        <div className="group">
                                            <input
                                                required
                                                value={values.address1}
                                                onChange={event => this.updateData(event, 'address1')}
                                                onFocus={event => this.turnBorderOrange(event, 'address1')}
                                                onBlur={event => this.checkForError(values.address1, 'address1')}
                                                type='text'
                                                placeholder='Street Address'
                                                style={{borderColor: this.state.borderColors.address1}}
                                            />
                                        </div>

                                        <p className='warning' id="address2">{this.state.errors.address2}</p>     
                                        <div className="group">
                                            <input
                                                required
                                                value={values.address2}
                                                onChange={event => this.updateData(event, 'address2')}
                                                onFocus={event => this.turnBorderOrange(event, 'address2')}
                                                onBlur={event => {this.checkForError(values.address2, 'address2'); this.props.getLatLng(event)}}
                                                type='text'
                                                placeholder='Address Line 2'
                                                style={{borderColor: this.state.borderColors.address2}}
                                            />
                                        </div>
                                                
                                        <div className="group">
                                            <input
                                                value={values.address3}
                                                onChange={event => this.updateData(event, 'address3')}
                                                onFocus={event => this.turnBorderOrange(event, 'address3')}
                                                onBlur={event => {this.checkForErrorOptionalField('address3'); this.props.getLatLng(event)}}
                                                type='text'
                                                placeholder='Address Line 3 (optional)'
                                                style={{borderColor: this.state.borderColors.address3}}
                                            />
                                        </div>
                                                
                                        <div className="group">
                                            <input
                                                value={values.address4}
                                                onChange={event => this.updateData(event, 'address4')}
                                                onFocus={event => this.turnBorderOrange(event, 'address4')}
                                                onBlur={event => {this.checkForErrorOptionalField('address4'); this.props.getLatLng(event)}}
                                                type='text'
                                                placeholder='Address Line 4 (optional)'
                                                style={{borderColor: this.state.borderColors.address4}}
                                            />
                                        </div>
                                        <Map
                                            google={this.props.google}
                                            center={{lat: values.lat, lng: values.lng}}
                                            height='300px'
                                            zoom={15}
                                            getLatLngAfterDrag={this.props.getLatLngAfterDrag}
                                        />
                                        <div className="buttonContainer">
                                            <button className="primary" onClick={()=> this.continue(values)}>Continue</button>   
                                            <button className="primary rhsbutton" onClick={event => this.goBack(event)}>Go Back</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div></div>

                        </div>


                    <div></div>
                </div>
                <div></div>
                    
                </div>
                    

			</>
		)
}
}

export default AddressDetails

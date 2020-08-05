
import React from 'react'
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
        errors: []
    }

    continue = (e, values) => { 
        e.preventDefault()     
        let errors = []
        if(values.venue=== ''){
            errors.push(`Please name the venue in which your event is taking place`)
        }
        if(values.address1 === ''){
            errors.push(`Please fill out the first line of the address of the venue`)
        }
        if(values.address2 === ''){
            errors.push(`Please fill out the second line of the address of the venue`)
        }
        if(errors.length === 0 ){
            this.props.nextStep() 
        }else{
            this.setState({errors})
        }
    }





	render() {
        const {values} = this.props

	  return (
			<>
                <Nav />
                <form className="longForm">
         
                    <div className="grid center middle">
                        <div></div>
                        <div className="card">
                            <div className ="content">
                                <div className="group">
                                    <input
                                        required
                                        value={values.venue}
                                        onChange={event => this.props.changeField(event, 'venue')}
                                        type='text'
                                        placeholder='Name of Venue'
                                    />
                                </div>

                                <div className="group">
                                    <input
                                        required
                                        value={values.address1}
                                        onChange={event => this.props.changeField(event, 'address1')}
                                        type='text'
                                        placeholder='Street Address'
                                        onBlur={this.props.getLatLng}
                                    />
                                </div>
                                        
                                <div className="group">
                                    <input
                                        required
                                        value={values.address2}
                                        onChange={(event) => this.props.changeField(event, 'address2')}
                                        type='text'
                                        placeholder='Address Line 2'
                                        onBlur={this.props.getLatLng}
                                    />
                                </div>
                                        
                                <div className="group">
                                    <input
                                        value={values.address3}
                                        onChange={(event) => this.props.changeField(event, 'address3')}
                                        type='text'
                                        placeholder='Address Line 3 (optional)'
                                        onBlur={this.props.getLatLng}
                                    />
                                </div>
                                        
                                <div className="group">
                                    <input
                                        value={values.address4}
                                        onChange={event => this.props.changeField(event, 'address4')}
                                        type='text'
                                        placeholder='Address Line 4 (optional)'
                                        onBlur={this.props.getLatLng}
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
                                    <button className="primary" onClick={event => this.continue(event, values)}>Continue</button>   
                                    <button className="primary rhsbutton" onClick={event => this.goBack(event)}>Go Back</button>
                                </div>
                                <ul className="warning">{this.state.errors.map((e,i) => <li key={i}>{e}</li>)}</ul>
                                
                            </div>
                        </div>
                        <div></div>
                    </div>
                    <div></div>
                </form>
				

			</>
		)
}
}

export default AddressDetails

import React, { Component } from 'react'
import Nav from "../Nav";
import Footer from "../Footer";
import '../../Styles/Cards.css'
import '../../Styles/Forms.css'
import '../../Styles/Buttons.css'
import '../../Styles/Global.css'
import '../../Styles/Nav.css'

export class Image extends Component {

    state = {
        errorMessage: '',
        fileName: ''
    }

    continue = (e, values) => {
        e.preventDefault()
        let stateCopy = this.state
        if(stateCopy.errorMessage === '' && values.image !== ''){
            this.props.nextStep()
        }   
        else if(values.image === '' && stateCopy.errorMessage === ''){
            stateCopy.errorMessage = `You must upload an image`
            stateCopy.borderColor = 'red'
            this.setState(stateCopy)
        }
    }

    goBack = (e) => {
        e.preventDefault()
        this.props.prevStep()
    }

    fileUploaded = (event) => {

        let stateCopy = this.state
        let fileType = event.target.files[0].type
        let fileSize = event.target.files[0].size        
        let validFile = false
  
        if(fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/gif'){ 
            validFile = true      
        }

        if(!validFile){
            stateCopy.errorMessage = 'Please upload a jpeg, gif or png file'
            stateCopy.borderColor = 'red'
        }else if(fileSize > 30000000){
            stateCopy.errorMessage = 'Please upload a file that is under 30 MB' 
            stateCopy.borderColor = 'red'   
        }else{
            stateCopy.errorMessage = ''
        }

        if(stateCopy.errorMessage === '') {
            stateCopy.borderColor = '#00988f'  
            this.props.changeField(event, 'image')
            stateCopy.fileName = event.target.files[0].name
        }

        this.setState(stateCopy)
    }  


    render() {
        const {values} = this.props
        return (
            <div className="create-event-container">
                <Nav />
                <form className="create-event-form">
                <div className="create-event-heading">
                    <header>Create Event</header>
                    <hr />
                </div>   
                <label className="custom-file-input">
                    <input
                        required
                        type="file"
                        onChange={this.fileUploaded}
                        title="Upload Image"
                        placeholder="Upload Image"
                        style={values.image === '' ?  {borderColor: this.state.borderColor} : {borderColor: this.state.borderColor, color: 'transparent'}}
                    />
                </label>
                <p className='create-event-warning' id="error">{this.state.errorMessage}</p>
                <div id="fileUploadText">   {values.image === '' ? '' : `${this.state.fileName} successfully uploaded` }</div>
                <div className="create-event-button-container">
                    <button className="create-event-button" onClick={event => this.goBack(event)}>Go Back</button>
                    <button className="create-event-button" onClick={event => this.continue(event, values)}>Continue</button>   
                </div>   
                </form> 
                <Footer />
            </div>
        )
    }
}

export default Image


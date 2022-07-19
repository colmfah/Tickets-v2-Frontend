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
        fileName: '',
    }


    continue = (e) => {
        let stateCopy = this.state
        if(stateCopy.errorMessage === '' && this.props.values.image !== ''){
            this.props.nextStep('image')
        }   
        else if(this.props.values.image === '' && stateCopy.errorMessage === ''){
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
        this.setState(stateCopy)
          
        if(stateCopy.errorMessage === '') {
            this.props.changeField(event, 'image')
            if(this.props.amendingEvent){
                this.continue(event)
                return
            }  
            stateCopy.borderColor = '#00988f'  
            stateCopy.fileName = event.target.files[0].name   
            this.setState(stateCopy)      
        }

        

        
    }  

    displayButtons(){
        if(this.props.amendingEvent){return}
        return (<div className="create-event-button-container">
        <button className="create-event-button" onClick={event => this.goBack(event)}>Go Back</button>
        <button className="create-event-button" onClick={event => this.continue(event, this.props.values)}>Continue</button>   
    </div>   )
    }

    spinnerVisibility(){
        if(this.props.spin){return {'display': 'block'}} 
        return {'display': 'none'}       
    }

    resetEditMessages(event){
        if(!this.props.amendingEvent){return}
        this.props.resetEditMessages()
    }

    displayTitle(){
        if(this.props.amendingEvent){return (
            <div className="create-event-heading">
                <header>Change Image</header>
                <hr />
            </div>   
         )}
    }

    displayImagePreview(){
        if(this.props.amendingEvent){return (<img src={this.props.imageURL} className='create-event-image-preview'></img>)}
    }

    disableOrEnableButton(){
        if(this.props.updating){
            return true
        }
        return false
    }

    disableOrEnableButton2(){
        if(this.props.updating){
            return 'custom-file-input disable-button'
        }
        return 'custom-file-input'
    }

    displayUploadButton(){

        if(this.props.updating){
            return 'none'
        }
        return 'block'
    }
    
 


    render() {
        const {values} = this.props
        return (
            <>
                <form className="create-event-form">
                {this.displayTitle()}

                {this.displayImagePreview()}
                <label className={'custom-file-input'} style={{display: this.displayUploadButton()}}>
                    <input
                        required
                        type="file"
                        onChange={event => this.fileUploaded(event)}
                        // disabled={this.disableOrEnableButton()}
                        onClick={event => this.resetEditMessages(event)}
                        style={values.image === '' ?  {borderColor: this.state.borderColor} : {borderColor: this.state.borderColor, color: 'transparent'}}
                    />
                </label>
                <p className='create-event-warning' id="error">{this.state.errorMessage}</p>
                <br />
                <div style={this.spinnerVisibility()}   className ='ticket-spinner'>
                    <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
                </div>
                <div id="fileUploadText">   {values.image === '' || this.state.fileName === '' ? '' : `${this.state.fileName} successfully uploaded` }</div>
                <div>{this.props.message}</div>
                {this.displayButtons()}
                </form> 
            </>
        )
    }
}

export default Image


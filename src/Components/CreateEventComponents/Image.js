import React, { Component } from 'react'
import Nav from "../Nav";
import '../../Styles/Grid.css'
import '../../Styles/Cards.css'
import '../../Styles/Forms.css'
import '../../Styles/Buttons.css'
import '../../Styles/Global.css'
import '../../Styles/Nav.css'

export class Image extends Component {

    state = {
        errorMessage: '',
        borderColor: 'none',
    }

    continue = (e, values) => {
        e.preventDefault()
        let stateCopy = this.state
        if(stateCopy.errorMessage === '' && values.image !== ''){
            this.props.nextStep()
        }   
        else if(values.image === '' && stateCopy.errorMessage === ''){
            stateCopy.errorMessage = `You must upload an image`
            stateCopy.borderColor = 'tomato'
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
        let errorMessage = ''
        let validFile = false

        if(fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/gif'){ 
            validFile = true      
        }

        if(!validFile){
            stateCopy.errorMessage = 'Please upload a jpeg, gif or png file'
            stateCopy.borderColor = 'tomato'
        }else if(fileSize > 30000000){
            stateCopy.errorMessage = 'Please upload a file that is under 30 MB' 
            stateCopy.borderColor = 'tomato'   
        }else{
            stateCopy.errorMessage = ''
        }

        if(stateCopy.errorMessage === '') {
            stateCopy.borderColor = '#00988f'  
            this.props.changeField(event, 'image')
        }

        this.setState(stateCopy)
    }  

    turnBorderOrange(e){
        e.preventDefault()
        let stateCopy = this.state
        stateCopy.borderColor = '#ff8c00'
        stateCopy.errorMessage = ''       
        this.setState(stateCopy)
    }

    render() {
        const {values} = this.props
        return (
            
            <> 
                <div className="pageGrid2Rows">
                
                    <div className="navBar"><Nav /></div>
               
                    <div className ="formRowGrid">  
                        <div></div>
                        <div className="formColumnGrid">
                            <div></div>


                            <div className="theForm card">
                                <div class ="content">
                                
                                    <div id="fileUploadText">Upload Image</div>
                                    <form>  
                                        <div id="fileUpload">
                                            <p className='warning' id="error">{this.state.errorMessage}</p>
                                            <input
                                                required
                                                type="file"
                                                onChange={this.fileUploaded}
                                                title="Upload Image"
                                                placeholder="Upload Image"
                                                onFocus={event => this.turnBorderOrange(event)}
                                                style={{borderColor: this.state.borderColor}}
                                            />
                                        </div>
                                        <div className="buttonContainer">
                                            <button className="primary" onClick={event => this.continue(event, values)}>Continue</button>   
                                            <button className="primary rhsbutton" onClick={event => this.goBack(event)}>Go Back</button>
                                        </div>
                                        
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

export default Image

{/*onChange={event => this.props.changeField(event, 'image')}*/}

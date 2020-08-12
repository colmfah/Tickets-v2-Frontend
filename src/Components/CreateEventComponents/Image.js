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
        errorMessage: ''
    }

    continue = (e, values) => {
        e.preventDefault()
        let stateCopy = this.state
        if(values.image === ''){
            stateCopy.errorMessage = `You must upload an image`
        }
        this.setState(stateCopy)
        if(stateCopy.errorMessage === ''){
            this.props.nextStep()
        }    
    }

    goBack = (e) => {
        e.preventDefault()
        this.props.prevStep()
    }

    fileUploaded = (event) => {

        let fileType = event.target.files[0].type
        let fileSize = event.target.files[0].size        
        let errorMessage = ''
        let validFile = false

        if(fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/gif'){ 
            validFile = true      
        }

        if(!validFile){
            errorMessage = 'Please upload a jpeg, gif or png file'
        }

        if(fileSize > 30000000){
            errorMessage = 'Please upload a file that is under 30 MB'    
        }

        this.setState({errorMessage})

        if(errorMessage === '') {
            this.props.changeField(event, 'image')
        }
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
                                <p className='warning' id="error">{this.state.errorMessage}</p>
                                    <div id="fileUploadText">Upload Image</div>
                                    <form>  
                                        <div id="fileUpload">
                                            <input
                                                required
                                                type="file"
                                                onChange={this.fileUploaded}
                                                title="Upload Image"
                                                placeholder="Upload Image"
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

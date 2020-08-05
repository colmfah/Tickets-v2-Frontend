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
        errors: []
    }

    continue = (e, values) => {
        e.preventDefault()
        let errors = this.state.errors
        if(values.image === ''){
            errors.push(`You must upload an image`)
        }
        this.setState({errors})
        if(errors.length === 0){
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
        let errors = []
        let validFile = false

        if(fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/gif'){ 
            validFile = true      
        }

        if(!validFile){
            errors.push('Please upload a jpeg, gif or png file')
        }

        if(fileSize > 30000000){
            errors.push('Please upload a file that is under 30 MB')    
        }

        this.setState({errors})

        if(errors.length === 0){
            this.props.changeField(event, 'image')
        }
    }  

    render() {
        const {values} = this.props
        return (
            
            <> 
                <Nav />

                <div className="grid center middle tall">
                    <div></div>
                    <div className="card">
                        <div class ="content">

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
                                
                                <ul className="warning">{this.state.errors.map((e,i) => <li key={i}>{e}</li>)}</ul>
                            </form> 
                        </div>
                    </div>
                    <div></div>
                </div>  
            </>
        )
    }
}

export default Image

{/*onChange={event => this.props.changeField(event, 'image')}*/}

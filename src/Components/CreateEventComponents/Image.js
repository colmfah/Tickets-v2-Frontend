import React, { Component } from 'react'

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

        console.log('fileuploadedtriggered');
        

        let fileType = event.target.files[0].type
        let fileSize = event.target.files[0].size        
        let errors = []
        let validFile = false

        if(fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/gif'){ 
            validFile = true      
        }

        if(!validFile){
            errors.push('Please upload a jpeg gif or png file')
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
            <div> 
                <div>Upload Image</div>           
                <input
                    required
                    type="file"
                    onChange={this.fileUploaded}
                />
                <br />
                <button onClick={event => this.continue(event, values)}>Continue</button>   <button onClick={event => this.goBack(event)}>Go Back</button>
                {this.state.errors.map((e,i)=> {return (
                    <div key={i}>
                        <div>{e}</div>
                    </div>
                
                )})}
            </div>
        )
    }
}

export default Image

{/*onChange={event => this.props.changeField(event, 'image')}*/}

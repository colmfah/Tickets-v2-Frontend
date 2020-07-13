import React, { Component } from 'react'

export class test extends Component {




    render() {
        return (
            <div> 
                <div>Upload Image</div>           
                <input
                    required
                    type="file"
                    onChange={this.fileUploaded}
                />
            </div>
        )
    }
}

export default test

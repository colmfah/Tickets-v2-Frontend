import React from 'react'
import "../Styles/QRCode.css";
import axios from 'axios';
import {Link} from 'react-router-dom'
import { withRouter } from 'react-router-dom'
var QRCode = require('qrcode.react')



class confirmEmail extends React.Component {

	state = {
        message: 'Please Wait....',
        success: false,
        sell: false,
        name: ''
    }

    componentDidMount(){
        axios.post(`${process.env.REACT_APP_API}/confirmEmail`, {code: this.props.match.params.id}).then(res => {
            this.setState({message: res.data.message})
            if(res.data.success){
                localStorage.setItem("token", res.data.token)
                this.setState({success: true})
            }
        })
    }
    
    changeField = (e, field) => {
        let stateCopy = this.state
        stateCopy[field] = e.target.value
        this.setState(stateCopy)
    }

    submit = () => {
        if(!this.state.sell){
            this.props.history.push({pathname: "/events"})
        }
        else {

            this.props.history.push({pathname: "/stripeConnectSignUp"})

            {/*let token = localStorage.getItem("token");
            axios.patch(`${process.env.REACT_APP_API}/updateUser`, {name: this.state.name, token: token}).then(res => {
                
            }).catch(err => {  
                console.log('axios err', err)  
            })*/}
        }
    }


	render() {

	  return (
			<>
				<div>{this.state.message}</div>

                {this.state.success ? 
                    <form onSubmit={this.submit}>

                        <div>
                            <div>Do you want to connect your Stripe account to sell tickets?</div> 
                            <div>You do not need to connect your Stripe account if you are selling free tickets</div>
                            <select required value={this.state.sell} onChange={event => this.changeField(event, 'sell')}>
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        </div>

                        <button>Submit</button>

                    </form>
                    :
                    <Link to={`/signup`}>Sign Up</Link>
                }

                

			</>
		)
}
}

export default withRouter(confirmEmail)


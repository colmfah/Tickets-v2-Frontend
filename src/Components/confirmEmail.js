import React from 'react'
import axios from 'axios';
import Nav from "./Nav";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import { withRouter } from 'react-router-dom'

import '../Styles/ConfirmEmail.css'



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
    
    toggleSell = (value) =>{
        console.log('value', value)
        console.log('value', typeof(value))

        let sell = value
        this.setState({sell})
    }

    submit = () => {
        !this.state.sell ? this.props.history.push({pathname: "/events"}) : this.props.history.push({pathname: "/stripeConnectSignUp"})
    }



	render() {

	  return (
        <div className="check-in-container">
            <Nav />
            <div className="check-in-form confirm-email-box">
				<div className="log-in-links">{this.state.message}</div>
                {this.state.success ? 
                    <form onSubmit={this.submit}>

                        <div>Do you want to enable your account to sell tickets?</div> 
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    checked={this.state.sell}
                                    onClick={() => this.toggleSell(true)}
                                />
                                {` Yes`}
                            </label>  

                            <label>
                                <input
                                    type="radio"
                                    checked={!this.state.sell}
                                    onClick={() => this.toggleSell(false)}
                                />
                                {` No`}
                            </label>   
                        </div>                  
                        
                            

                        <button id="log-in-button">Submit</button>

                    </form>
                    :
                    <Link to={`/signup`}><button id="log-in-button">Sign Up</button></Link>
                }
            </div>
            <Footer />
		</div>
		    )
    }
}

export default withRouter(confirmEmail)


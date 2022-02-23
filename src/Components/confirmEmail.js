import React from 'react'
import axios from 'axios';
import {Link} from 'react-router-dom'
import { withRouter } from 'react-router-dom'



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
        !this.state.sell ? this.props.history.push({pathname: "/events"}) : this.props.history.push({pathname: "/stripeConnectSignUp"})
    }


	render() {

	  return (
			<>
				<div>{this.state.message}</div>

                {this.state.success ? 
                    <form onSubmit={this.submit}>

                        <div>Do you want to connect your Stripe account to sell tickets?</div> 
                        <select required value={this.state.sell} onChange={event => this.changeField(event, 'sell')}>
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                        <div>You do not need to connect your Stripe account if you are selling free tickets</div>
                            

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


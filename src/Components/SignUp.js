import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Nav from "./Nav";


class SignUp extends React.Component {
  state = {
    formFields: [
      { label: "Name", type: "text", value: "name" },
      { label: "Email", type: "email", value: "email" },
      { label: "Password", type: "password", value: "password" },
      { label: "Location", type: "text", value: "location" }
    ],

    user: {
      name: "",
      email: "",
      password: "",
      location: "",
			sell: false
    },

    errorMsg: "Already have an account?"
  };

  changeField = (e, field) => {
    let user = this.state.user;
    user[field] = e.target.value;
    this.setState({ user });
  };

  signup = e => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_API}/users`, this.state.user)
      .then(res => {
        if (res.data === "You already registered") {
          console.log(res.data);
          this.setState({ errorMsg: "You have already registered" });
        } else {
					localStorage.setItem("token", res.data)
					if(this.state.user.sell === false){
						this.props.history.push({
							pathname: "/events"
						})
					}
					else {
						this.props.history.push({
							pathname: "/stripeConnectSignUp"
						})
					}


        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <>
      	<Nav />
					<form onSubmit={this.signup}>
						<h1>Sign up</h1>
						{this.state.formFields.map((e, i) => (
							<div key={i}>
								<label>{e.label}</label>
								<input
									value={this.state.user[e.value]}
									required
									onChange={event => this.changeField(event, e.value)}
									type={e.type}
									/>
								</div>
							))}

							<div>
							<label>
							Do you want to sell tickets?
							</label>
							<select
								required
								value={this.state.user.sell}
								onChange={event => this.changeField(event, 'sell')}
							>
								<option value="false">No</option>
								<option value="true">Yes</option>
							</select>
							</div>

							<button>Signup</button>

                  <p>
                    {this.state.errorMsg}
                    <Link to="/login">
                      Login
                    </Link>
                  </p>
				</form>
      </>
    );
  }
}

export default SignUp;

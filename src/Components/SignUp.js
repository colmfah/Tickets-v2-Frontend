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
      location: ""
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
          localStorage.setItem("token", res.data);
          this.props.history.push({
            pathname: "/events"
          });
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

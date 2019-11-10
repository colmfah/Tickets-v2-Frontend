import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import DatePicker from "react-datepicker";
import Nav from "./Nav";
import "react-datepicker/dist/react-datepicker.css";

class CreateEvent extends React.Component {
  state = {
    formFields: [
      { label: "Title", type: "text", value: "title" },
      { label: "Location", type: "text", value: "location" },
      { label: "Number of Tickets", type: "number", value: "ticketNo" },
      { label: "Description", type: "text", value: "description" },
      { label: "Price", type: "number", value: "price" }
    ],

    eventToSend: {},

    userEvent: {},
    errorMsg: ""
  };

  componentDidMount() {
    let token = localStorage.getItem("token");
    let objectToSend = {
      token: token
    };

    axios.post(`${process.env.REACT_APP_API}/auth`, objectToSend).then(res => {
      let userEvent = {
        title: "",
        location: "",
        ticketNo: "",
        price: "",
        description: "",
        startDetails: "",
        endDetails: "",
        organiser: res.data._id,
        currency: "EUR"
      };
      this.setState({
        userEvent: userEvent
      });
    });
  }

  changeField = (e, field) => {
    let userEvent = this.state.userEvent;

    if (field === "image") {
      let data = new FormData();
      data.append("file", e.target.files[0]);
      this.setState({
        eventToSend: data
      });
    } else if (field === "startDetails" || field === "endDetails") {
      if (field === "startDetails" && moment().isAfter(e)) {
        this.setState({
          errorMsg: "Start date & time must be in the future"
        });
      } else if (
        field === "endDetails" &&
        moment(e).isBefore(this.state.startDetails)
      ) {
        this.setState({
          errorMsg: "Event must end after it starts!"
        });
      } else {
        userEvent[field] = e;
        this.setState({
          errorMsg: ""
        });
      }
    } else {
      userEvent[field] = e.target.value;
    }
    this.setState({ userEvent });
  };

  createEvent = e => {
    e.preventDefault()
		this.setState({
			errorMsg:'Creating Event. Please Wait...'
		})

    let data = this.state.eventToSend;

    data.append("title", this.state.userEvent.title)
    data.append("location", this.state.userEvent.location)
    data.append("ticketNo", this.state.userEvent.ticketNo)
    data.append("price", this.state.userEvent.price)
    data.append("description", this.state.userEvent.description)
    data.append("startDetails", this.state.userEvent.startDetails)
    data.append("endDetails", this.state.userEvent.endDetails)
    data.append("organiser", this.state.userEvent.organiser)
    data.append("currency", this.state.userEvent.currency)
    axios
      .post(`${process.env.REACT_APP_API}/image`, data)
      .then(res => {
        this.props.history.push({
          pathname: `/events/${res.data._id}`
        })
      })
      .catch(err => {
        console.log("imgerr", err)
      })
  }

  logout = () => {
    localStorage.removeItem("token")
    this.props.history.push({
      pathname: "/events"
    });
  };

  render() {
    return (
      <>
				<Nav />
				<form
					onSubmit={this.createEvent}>
					<h2>Create Event</h2>
					<div>
						{this.state.formFields.map((e, i) => (
							<div key={i}>
							<input
								value={this.state.userEvent[e.value]}
								required
								onChange={event => this.changeField(event, e.value)}
								type={e.type}
								placeholder={e.label}
								/>
							</div>
							))}

							<select
								required
								value={this.state.userEvent.currency}
								onChange={event => this.changeField(event, "currency")}
              >
								<option value="EUR">EUR</option>
								<option value="USD">USD</option>
								<option value="NZD">NZD</option>
							</select>

              <div required>
								Date & Time Event Starts:
								<DatePicker
									timeIntervals={15}
									selected={this.state.userEvent.startDetails}
									onChange={event =>
									this.changeField(event, "startDetails")
  								}
									showTimeSelect
									dateFormat="Pp"
									required
								/>
								</div>

								<div>
									Date & Time Event Ends:
									<DatePicker
										timeIntervals={15}
										selected={this.state.userEvent.endDetails}
										onChange={event =>
											this.changeField(event, "endDetails")
										}
										showTimeSelect
										dateFormat="Pp"
										required
										/>
                    </div>
                    <input
                      type="file"
                      onChange={event => this.changeField(event, "image")}
                    />
                    Upload an image

                    <div>{this.state.errorMsg}</div>
                    <button>Create</button>
                  </div>

            </form>
      </>
    );
  }
}

export default withRouter(CreateEvent);

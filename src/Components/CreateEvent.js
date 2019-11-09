import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import DatePicker from "react-datepicker";
import Nav from "./Nav";
import "react-datepicker/dist/react-datepicker.css";
import colourfulBground from "../images/colourfulBground.jpg";
// import "../Styles/Form.css";

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
        <div
          className="b-ground"
          style={{
            backgroundImage: `url(${colourfulBground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100%",
            minHeight: "100vh"
          }}
        >
          <div
            className="page-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr "
            }}
          >
            <Nav />

            <form
              onSubmit={this.createEvent}
              style={{ fontFamily: "Varela Round" }}
            >
              <div className="content">
                <h2 className="h2">Create Eventzilla Event</h2>
                <div className="group logo3">
                  <i className="fas fa-ticket-alt logo group logo3 ticket-form"></i>

                  <div className="form-info">
                    {this.state.formFields.map((e, i) => (
                      <div className="group2" key={i}>
                        <input
                          value={this.state.userEvent[e.value]}
                          required
                          onChange={event => this.changeField(event, e.value)}
                          type={e.type}
                          placeholder={e.label}
                          style={{ fontFamily: "Varela Round" }}
                        />
                      </div>
                    ))}

                    <select
                      className="group2"
                      required
                      style={{
                        textAlign: "left",
                        backgroundColor: "#888888",
                        border: "none",
                        color: "#282526"
                      }}
                      value={this.state.userEvent.currency}
                      onChange={event => this.changeField(event, "currency")}
                    >
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                      <option value="NZD">NZD</option>
                    </select>
                    <div
                      required
                      className="group2"
                      style={{ color: "#282526" }}
                    >
                      Date & Time Event Starts:{" "}
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
                    <div className="group2" style={{ color: "#282526" }}>
                      Date & Time Event Ends:{" "}
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
                      id="picUpload"
                      type="file"
                      onChange={event => this.changeField(event, "image")}
                    />
                    <label for="picUpload">Upload an image</label>

                    <div>{this.state.errorMsg}</div>
                    <button className="primary group logo3">
                      <strong>Create</strong>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(CreateEvent);

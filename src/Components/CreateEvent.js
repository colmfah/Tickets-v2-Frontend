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
      { label: "Description", type: "text", value: "description" }
    ],

		ticketFields: [
			{ name: 'Ticket Type', label: "Early Bird, General Admission...", type: "text", value: "ticketType" },
			{ name: 'Currency', label: "€", type: "text", value: "currency" },
			{ name: 'Price', label: "15", type: "number", value: "price" },
			{ name: 'Number of Tickets', label: "100", type: "number", value: "numberOfTickets" },
			{ name: 'Start Selling Tickets', label: "Now", type: "Date", value: "startSelling" },
			{ name: 'Number of Tickets', label: "100", type: "number", value: "numberOfTickets" },
		],

    eventToSend: {},
    userEvent: {
			title: "",
			location: "",
			ticketNo: "",
			price: "",
			description: "",
			startDetails: "",
			endDetails: "",
			organiser: "",
			currency: "EUR",
			tickets: []
		},
    errorMsg: "",
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
        currency: "EUR",
				tickets: []
      };
      this.setState({
        userEvent: userEvent
      });
    });
  }

	changeTicketDetails = (e, field, ticketNumber) => {
		console.log('field', field)
		console.log('ticketNumber', ticketNumber)
		console.log('Date?', e instanceof Date)
		let userEvent = this.state.userEvent
		if(e instanceof Date){
			userEvent.tickets[ticketNumber][field] = e
		}else{
			userEvent.tickets[ticketNumber][field] = e.target.value
		}
		this.setState({ userEvent })
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
  }


	addTicket = (e) => {
		e.preventDefault()
		let tickets = this.state.userEvent.tickets
		tickets.push({
			ticketType: '',
			price: '',
			numberOfTickets: '',
			startSelling: '',
			stopSelling: ''
		})
		this.setState({
			tickets: tickets
		})
	}





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
				<h1>Event Details</h1>
				<form
					onSubmit={this.createEvent}>

					<h2>Event Details</h2>
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

										<select
											required
											value={this.state.userEvent.currency}
											onChange={event => this.changeField(event, "currency")}
										>
											<option value="EUR">EUR</option>
											<option value="USD">USD</option>
											<option value="NZD">NZD</option>
										</select>

										<h1>Create Tickets</h1>

										<button onClick={this.addTicket}>Add Ticket</button>


										{this.state.userEvent.tickets.map((e, i) => {
											return (
												<div key={i}>
												Ticket Number {i}:
													<label>
									          Ticket Type:
									          <input
															type="text"
															value={this.state.userEvent.tickets[i].ticketType}
															onChange={event => this.changeTicketDetails(event, 'ticketType', i)}
															placeholder="Early Bird, General Admission..."/>
									        </label>



													<label>
														{`Price (${this.state.userEvent.currency})`}
														<input
															type="number"
															value={this.state.userEvent.tickets[i].price}
															onChange={event => this.changeTicketDetails(event, 'price', i)}
															placeholder="10"/>
													</label>

													<label>
														Number of Tickets
														<input
															type="number"
															value={this.state.userEvent.tickets[i].numberOfTickets}
															onChange={event => this.changeTicketDetails(event, 'numberOfTickets', i)}
															placeholder="100"/>
													</label>

													<label>
									          Start Selling Tickets:
									          <select
														required value={(this.state.userEvent.tickets[i].startSelling instanceof Date) ? 'specific' : this.state.userEvent.tickets[i].startSelling}onChange={event => this.changeTicketDetails(event, 'startSelling', i)} >
									            <option value="now">Now</option>
									            <option value="specific">Specific Date & Time</option>
									            <option value="whenPreviousSoldOut" disabled={i=0}>When Previous Tickets Are Sold Out</option>
									          </select>
									        </label>


													{(this.state.userEvent.tickets[i].startSelling == 'specific' || this.state.userEvent.tickets[i].startSelling instanceof Date) &&
													<label>
														Start Selling Tickets at:
														<DatePicker
															timeIntervals={15}
															onChange={event => this.changeTicketDetails(event, 'startSelling', i)}
															selected={(this.state.userEvent.tickets[i].startSelling instanceof Date) ? this.state.userEvent.tickets[i].startSelling : this.state.userEvent.startDetails}
															showTimeSelect
															dateFormat="Pp"
															required
															/>
														</label>
													}


													<label>
														Stop Selling Tickets:
														<select
														required value={this.state.userEvent.tickets[i].stopSelling}onChange={event => this.changeTicketDetails(event, 'stopSelling', i)} >
															<option value="eventBegins">When Event Begins</option>
															<option value="eventEnds">When Event Ends</option>
															<option value="specific">At Specific Date and Time</option>
														</select>
													</label>

													{(this.state.userEvent.tickets[i].stopSelling == 'specific' || this.state.userEvent.tickets[i].stopSelling instanceof Date) &&
													<label>
														Stop Selling Tickets at:
														<DatePicker
															timeIntervals={15}
															onChange={event => this.changeTicketDetails(event, 'stopSelling', i)}
															selected={(this.state.userEvent.tickets[i].stopSelling instanceof Date) ? this.state.userEvent.tickets[i].stopSelling : this.state.userEvent.startDetails}
															showTimeSelect
															dateFormat="Pp"
															required
															/>
														</label>
													}

													<button>Remove</button>
													<hr />

												</div>)

										})}


										{/*ticketFields: [
											{ name: 'Ticket Type', label: "Early Bird, General Admission...", type: "text", value: "ticketType" },
											{ name: 'Currency', label: "€", type: "text", value: "currency" },
											{ name: 'Price', label: "15", type: "number", value: "price" },
											{ name: 'Number of Tickets', label: "100", type: "number", value: "numberOfTickets" },
											{ name: 'Start Selling Tickets', label: "Now", type: "Date", value: "startSelling" },
											{ name: 'Number of Tickets', label: "100", type: "number", value: "numberOfTickets" },
										],*/}

										<h1>Refund Policy</h1>







                    <div>{this.state.errorMsg}</div>
                    <button>Publish</button>
            </form>
      </>
    );
  }
}

export default withRouter(CreateEvent);

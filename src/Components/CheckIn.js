import React from "react";
import Nav from "./Nav";
import UsersUpcomingEvents from './UsersTickets'
import { Link } from "react-router-dom";
import QrReader from "react-qr-reader";
import axios from "axios";
import moment from "moment";


class CheckIn extends React.Component {
  state = {

    eventRequested: '',
    password: '',
    message: '',
    userEvent: {},
    showCheckIn: false,
    checkIn: false
  }

  componentDidMount() {
  }

  checkInLogIn = (e) => {
      e.preventDefault()

      axios.post(`${process.env.REACT_APP_API}/checkInLogIn`, {userEvent: this.state.eventRequested, password: this.state.password}).then(res => {
              
        this.setState({message: res.data.message, userEvent: res.data.userEvent, showCheckIn: res.data.success})
    
    }).catch(err => console.log(err));

  }

  eventDetails = (e, field) => {
      let stateCopy = this.state
      stateCopy[field]=e.target.value
      this.setState(stateCopy)
  }

  handleScan = (data, userEvent) => {
    if (data) {

      this.turnScannerOnOff()
      this.setState({message: "QR code scanned. Checking database for match..."})

      axios.post(`${process.env.REACT_APP_API}/checkIn`, {qrcode: data, userEvent: userEvent, password: this.state.password}).then(res => {

        this.setState({message: res.data.message})
        }).catch(err => {console.log(err)})
    }
  }

  logOut = () => {
    this.setState({
      message: '',
      showCheckIn: false,
      checkIn: false,
      eventRequested: '',
      password: '',
      userEvent: {}
    })

  }

  turnScannerOnOff = () => {
    let stateCopy = this.state
    stateCopy.checkIn = !stateCopy.checkIn
    this.setState({checkIn: stateCopy.checkIn})
  }



  render() {
    return (
<>
  <Nav />




	<h2>Check In</h2>



    {!this.state.showCheckIn ? 

      <form onSubmit={this.checkInLogIn}>

      <div>
          <input
              value={this.state.eventRequested}
              required
              onChange={event => this.eventDetails(event, 'eventRequested')}
              type='text'
              placeholder='Event ID'
          />
      </div>

      <div>
          <input
              value={this.state.password}
              required
              onChange={event => this.eventDetails(event, 'password')}
              type='password'
              placeholder='Password'
          />
      </div>

      <button>Submit</button>

      </form>
    :
      <div>
          
          <h3>{this.state.userEvent.title}</h3>
          <div>From: {moment(this.state.userEvent.startDetails).format("ddd, Do MMM YYYY, HH:mm ")} Until: {moment(this.state.userEvent.endDetails).format("ddd, Do MMM YYYY, HH:mm ")}</div>
          <div>Venue: {this.state.venue}</div>

          {this.state.checkIn ? 
            <div>
              <button onClick={this.turnScannerOnOff}>
                Turn Off Check In
              </button>
              <QrReader
                delay={300}
                onError={this.handleError}
                onScan={event => this.handleScan(event, this.state.userEvent._id)}
              />
            </div>
          : 
            <button onClick={this.turnScannerOnOff}>
              Check In Ticket
            </button>
          } 

          <button onClick={this.logOut}>Log Out of Event</button>
      
      
      </div>}
        
        

        
  <div>{this.state.message}</div>

    


</>
		    )
		  }
		}

export default CheckIn;

import React from "react";
import Nav from "./Nav";
import QrReader from "react-qr-reader";
import axios from "axios";
import moment from "moment";
import Footer from "./Footer";
import "../Styles/CheckIn.css";


class CheckIn extends React.Component {
  state = {

    eventRequested: '',
    password: '',
    message: '',
    userEvent: {},
    showCheckIn: false,
    checkIn: false,
    displaySpinner: false,
    messageColor: 'black'
  }

  componentDidMount() {
  }

  checkInLogIn = (e) => {
      e.preventDefault()
      let message = `Checking Details. Please Wait...`
      let displaySpinner = true
      this.setState({message, displaySpinner})

      axios.post(`${process.env.REACT_APP_API}/checkInLogIn`, {userEvent: this.state.eventRequested, password: this.state.password}).then(res => {
        displaySpinner = false   
        this.setState({message: res.data.message, userEvent: res.data.userEvent, showCheckIn: res.data.success, displaySpinner: false})
    
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
        let messageColor = this.state.color
        res.data.checkedIn === true ? messageColor = 'green' : messageColor = 'red'
        this.setState({message: res.data.message, messageColor})
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

  spinnerVisibility(){
    if(this.state.displaySpinner ){return {'display': 'block'}}
    return {'display': 'none'}
  }

  displayLogInForm(){
    return(
      <div>
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
       <div className="check-in-spinner-message">
        <div style={this.spinnerVisibility()} className ='ticket-spinner'>
          <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div> 
        </div>
        <div className="check-in-message">{this.state.message}</div>
      </div>
      <div className="check-in-button-container">
        <button onClick={this.checkInLogIn}>Submit</button>
      </div>
    </div>
    )
  }

  displayCheckInForm(){
    return(
      <div>
        <h3>{this.state.userEvent.title}</h3>
        <div className="check-in-event-details">{moment(this.state.userEvent.startDetails).format("Do MMM YYYY [at] HH:mm ")}</div>
        {this.state.checkIn ? <button onClick={this.turnScannerOnOff}> Turn Scanner Off</button> : <button onClick={this.turnScannerOnOff}> Check In Ticket</button>} 
        <button onClick={this.logOut}>Log Out of Event</button>
        <div>{this.state.message}</div>
        {this.state.checkIn ? 
          <QrReader
            delay={300}
            onError={this.handleError}
            onScan={event => this.handleScan(event, this.state.userEvent._id)}
            style={{ maxWidth: '500px', marginTop: '50px' }}
          />
        : 
        <> </>} 
      </div>
      
    )
  }



  render() {
    return (
<>
  <div className="check-in-container">
    <Nav />
    <div className="check-in-form">
      <div className="check-in-heading">
        <h2>Check In</h2>
        <hr />
        {this.state.showCheckIn ? this.displayCheckInForm()  :  this.displayLogInForm()}
      </div>
    </div>
    
    <Footer />
  </div>
</>
		    )
		  }
		}

export default CheckIn;

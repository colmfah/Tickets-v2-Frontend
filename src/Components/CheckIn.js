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
    messageColor: 'black',
    image: '',
    displayImage: false
  }

  componentDidMount() {    
    let eventRequested = this.props.match.params.id 
    this.setState({eventRequested})

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

      this.turnScannerOnOff(data, true)
      this.setState({message: "QR code scanned. Checking database for match...", displayImage: false})

      axios.post(`${process.env.REACT_APP_API}/checkIn`, {qrcode: data, userEvent: userEvent, password: this.state.password}).then(res => {
        let message = res.data.message
        let messageColor = this.state.color
        let image = this.state.image
        let displayImage = true
        if(res.data.checkedIn === true){
          messageColor = 'green'
          image = `${process.env.REACT_APP_API}/greenTick.png`
        }else{
          messageColor = 'red'
          image = `${process.env.REACT_APP_API}/redx.png`
        }
        if(res.data.tryAgain){
          messageColor = '#d8420b'
          image = `${process.env.REACT_APP_API}/caution.png`
        }
        this.setState({message, messageColor, image, displayImage})
        }).catch(err => {console.log(err)})
    }
  }

  logOut = (event) => {
    event.preventDefault()
    this.setState({
      message: '',
      showCheckIn: false,
      checkIn: false,
      password: '',
      userEvent: {},
      image: ''
    })

  }

  turnScannerOnOff = (event, scanInProgress = false) => {
    if(!scanInProgress){event.preventDefault()}
    let stateCopy = this.state
    stateCopy.checkIn = !stateCopy.checkIn
    stateCopy.displayImage = false
    stateCopy.message = ''
    this.setState(stateCopy)
  }

  spinnerVisibility(){
    if(this.state.displaySpinner ){return {'display': 'block'}}
    return {'display': 'none'}
  }

  displayImage(){
    if(this.state.displayImage ){return {'display': 'block'}}
    return {'display': 'none'}
  }

  displayLogInForm(){
    return(
      <div className="check-in-container">
        <form className="check-in-form">
          <div className="check-in-heading">
            <header>Check In</header>
            <hr />
          </div>
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
          <div>{this.state.image}</div>
        </div>
        <div className="check-in-button-container">
          <button onClick={this.checkInLogIn}>Submit</button>
        </div>
      </form>
    </div>
    )
  }

  displayQRReader(){
    if(!this.state.checkIn){return}
    return (
            <QrReader
              delay={300}
              onError={this.handleError}
              onScan={event => this.handleScan(event, this.state.userEvent._id)}
              style={{ width: '100vw', maxWidth: '600px', margin: '10px auto'}}
              
            />)
  }


  displayCheckInForm(){
    return(
      <div className='check-in-container'>
      <div className='check-in-scan'>
        
        <div className="check-in-event-details">
          <header>{this.state.userEvent.title}</header>
          <div className="check-in-date">{moment(this.state.userEvent.startDetails).format("Do MMM YYYY [at] HH:mm ")}</div>
          <img src={this.state.image} alt={'log in response'} style={this.displayImage()}  className='check-in-image'/>
          <p style={{color: this.state.messageColor}}>{this.state.message}</p>
        </div>
        <div>{this.displayQRReader()}</div>

        <div className="check-in-button-wrapper">
          <button onClick={(event) => this.turnScannerOnOff(event)}> {this.getButtonText()}</button>
          <button onClick={event => this.logOut(event)}>Log Out of Event</button>
        </div>
      </div>
      </div>
      
    )
  }

  getButtonText(){
    if(this.state.checkIn){return 'Turn Scanner Off'}
    return 'Check In Ticket'
  }


  render() {
    return (
<>
  
    <Nav />
    {this.state.showCheckIn ? this.displayCheckInForm()  :  this.displayLogInForm()}
    <Footer />
 
</>
		    )
		  }
		}

export default CheckIn;

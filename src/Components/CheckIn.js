import React from "react";
import Nav from "./Nav";
import UsersUpcomingEvents from './UsersUpcomingEvents'
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

      this.turnScannerOnOff(userEvent)

      let stateCopy = this.state.yourEvents
      stateCopy.map(e => {
        if (e.userEvent === userEvent) {
          e.message = "QR code scanned. Checking database for match..."
          return e
        }
      })
      this.setState({yourEvents: stateCopy})

      let token = localStorage.getItem("token")

      axios.post(`${process.env.REACT_APP_API}/checkIn`, {qrcode: data, userEvent: userEvent, creatorToken: token}).then(res => {
          let stateCopy = this.state.yourEvents
          stateCopy = stateCopy.map(e => {
            if (e.userEvent === userEvent) {
              e.message = res.data.message
              return e
            }
          });
          this.setState({usersEvents: stateCopy})
        }).catch(err => {console.log(err)})
    }
  }

  turnScannerOnOff = userEvent => {
    let stateCopy = this.state.yourEvents
    stateCopy.map(e => {

      console.log('e.userEvent', e.userEvent)
      console.log('userEvent', userEvent);
      
      
      
      if (e.userEvent === userEvent) {
        e.checkIn = !e.checkIn
        return e
      }
    })

    this.setState({usersEvents: stateCopy})
  }



  render() {
    return (
<>
  <Nav />




	<h2>Check In</h2>

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

    {this.state.showCheckIn ? 
        <div>
            
            <h3>{this.state.userEvent.title}</h3>

            {this.state.checkIn ? 
                    <div>
                      <button onClick={() => this.turnScannerOnOff()}>
                        Turn Off Check In
                      </button>
                      <QrReader
                        delay={300}
                        onError={this.handleError}
                        onScan={event => this.handleScan(event, this.state.userEvent._id)}
                      />
                    </div>
                    : 
                    <button onClick={() => this.turnScannerOnOff()}>
                      Check In Tickets
                    </button>
            } 
        
        
        </div> 
        
        
        
        : 
        
        <div>{this.state.message}</div>}

    




      
        {/*this.state.yourEvents.map((e,i) => {return(

            <div key={i}>

                <p>{e.title}</p>
                <p>Net Tickets Sold: {(e.ticketsSold - e.ticketsRefunded)} out of {e.capacity}</p>
                <p>Total Tickets Sold (including cancelled tickets): {e.ticketsSold}</p>
                <p>Cancelled Tickets: {e.ticketsRefunded}</p>
                <br />

                {(e.ticketTypes.length > 0 && e.ticketsSold > 0)&& 
                
                <div>
                  <p>Ticket Types</p>
                  {e.ticketTypes.map((f,j) => {return(
                    <div key={j}>
                      <p>{f.ticketType}</p>
                      <p>Net Tickets Sold: {(f.ticketsSold - f.ticketsRefunded)} out of {f.capacity}</p>
                      <p>Total Tickets Sold (including cancelled tickets): {f.ticketsSold}</p>
                      <p>Cancelled Tickets: {f.ticketsRefunded}</p>
                      <br />
                    </div>
                  )})}
                </div>
                }

                {e.checkIn ? 
                    <div>
                      <button onClick={() => this.turnScannerOnOff(e.userEvent)}>
                        Turn Off Check In
                      </button>
                      <QrReader
                        delay={300}
                        onError={this.handleError}
                        onScan={event => this.handleScan(event, e.userEvent)}
                      />
                    </div>
                    : 
                    <button onClick={() => this.turnScannerOnOff(e.userEvent)}>
                      Check In Tickets
                    </button>
                  }  
                  <div>{e.message}</div>



                <hr />

            </div>

        )
                 
                
        })
        */}


</>
		    )
		  }
		}

export default CheckIn;

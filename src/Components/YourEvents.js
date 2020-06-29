import React from "react";
import Nav from "./Nav";
import UsersUpcomingEvents from './UsersUpcomingEvents'
import { Link } from "react-router-dom";
import QrReader from "react-qr-reader";
import axios from "axios";
import moment from "moment";


class YourEvents extends React.Component {
  state = {
    yourEvents: [{
      userEvent: '',
      title: '',
      capacity: 0,
      ticketsSold: 0,
      ticketsRefunded: 0,
      ticketTypes: [ {}, {} ]
    }]
  }

  componentDidMount() {

    let token = localStorage.getItem("token");
    axios.post(`${process.env.REACT_APP_API}/yourEvents`, {token: token}).then(res => {this.setState({yourEvents: res.data})}).catch(err => console.log(err));
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

      axios.post(`${process.env.REACT_APP_API}/checkIn`, {qrcode: data, userEvent: userEvent}).then(res => {
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



  render() {
    return (
<>
  <Nav />




	<h2>Events you are organising</h2>


      
        {this.state.yourEvents.map((e,i) => {return(

            <div key={i}>

                <p>{e.title}</p>
                <p>Net Tickets Sold: {(e.ticketsSold - e.ticketsRefunded)} out of {e.capacity}</p>
                <p>Total Tickets Sold (including cancelled tickets): {e.ticketsSold}</p>
                <p>Cancelled Tickets: {e.ticketsRefunded}</p>
                <br />

                {e.ticketTypes.length > 0 && 
                
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
        }


</>
		    )
		  }
		}

export default YourEvents;

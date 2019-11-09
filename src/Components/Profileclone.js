import React from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import moment from "moment"
import {Link} from 'react-router-dom'
import QrReader from 'react-qr-reader'
import Nav from './Nav'

class Profile extends React.Component {

state = {
		user: {
			email: '',
			location: '',
			name: '',
			_id: '',
			ticketsBought: [],
			usersEvents: []
		}
}

componentDidMount(){

	let token = localStorage.getItem('token')
	let objectToSend = {
		token: token
		}
	axios.post(`${process.env.REACT_APP_API}/profile`, objectToSend)
		.then( res => {
				this.setState({
					user: res.data
				})
			})
		.catch(err => console.log(err))
}


click = () => {
	console.log('I have been clicked')
}


turnScannerOnOff = (usersEvent) =>{

	let stateCopy = this.state.user.usersEvents
	console.log('stateCopyb4map', stateCopy)
	stateCopy.map(	e => {
		if(e._id === usersEvent._id){
			e.checkIn = (!e.checkIn)
			return e
		}
	}	)

	this.setState({
		usersEvents: stateCopy
	})
}

handleScan = (data, usersEvent) => {

if (data) {
this.turnScannerOnOff(usersEvent)

let stateCopy = this.state.user.usersEvents
stateCopy.map(	e => {
	if(e._id === usersEvent._id){
		e.message = 'QR code scanned. Checking database for match...'
		return e
	}
	this.setState({
		usersEvents: stateCopy
	})
}	)

axios.post(`${process.env.REACT_APP_API}/checkIn`, {
	qrcode: data,
	eventid: usersEvent._id
})
	.then(res => {

		let stateCopy = this.state.user.usersEvents
		stateCopy = stateCopy.map(	e => {
			if(e._id === usersEvent._id){
				e.message = res.data
				return e
			}

		}	)
		this.setState({
			usersEvents: stateCopy
		})
	}
)
	.catch(err => {console.log(err)})


}
}

handleError = err => {
console.error(err)
}

	render() {

	  return (
			<>

			<div>{this.state.user.name}</div>
			<div>{this.state.user.location}</div>
			<div>{this.state.user.email}</div>
			<h2>Tickets Purchased for Upcoming Events</h2>






			<h2>Events you are organising</h2>


			{this.state.user.usersEvents.map(	(e,i) => { return (<div key={i}>
				<div>{i+1}</div>
				<div>{e.title}</div>
				<div>{e.location}</div>
				<div>Begins: {moment(e.startDetails).format('DD MMMM YYYY HH:mm')}</div>
				<div>Ends: {moment(e.endDetails).format('DD MMMM YYYY HH:mm')}</div>
				<div>Tickets Sold: {e.ticketsSold.length}</div>
				<div>Tickets Remaining: {e.ticketNo - e.ticketsSold.length}</div>

				<div>{e.message}</div>

					{e.checkIn ? (
						<div>
							<button onClick={() =>this.turnScannerOnOff(e)}>Turn Check In On/Off</button>
							<QrReader
							delay={300}
							onError={this.handleError}
							onScan={(event) => this.handleScan(event, e)}
							style={{ width: '100%' }}
							/>
						</div>

					) : (
						<button onClick={() =>this.turnScannerOnOff(e)}>Turn Check In On/Off</button>
					)}



				<hr />

				</div>)}		)}


			</>
		)
}
}
export default withRouter(Profile)



<div>


	<h3 className="title1" style={{ color: "black" }}>
		Tickets Sold
	</h3>
	<p className="title1">Not enough</p>
	<h3 className="title1" style={{ color: "black" }}>
		Tickets Remaining
	</h3>
	<p className="title1">Too many</p>
</div>




{this.state.user.usersEvents.map(	(e,i) => { return (<div key={i}>

	<h2 className="title1" style={{ color: "black" }}>
		Your Eventzilla Event
	</h2>
	<h3 className="title1" style={{ color: "black" }}>
		Event Title
	</h3>
	<p className="title1">{e.title}</p>

	<h3 className="title1" style={{ color: "black" }}>
		Tickets Sold
	</h3>
	<p className="title1">{e.ticketsSold.length}</p>
	<h3 className="title1" style={{ color: "black" }}>
		Tickets Remaining
	</h3>
	<p className="title1">{e.ticketNo - e.ticketsSold.length}</p>

	<div>{e.message}</div>

		{e.checkIn ? (
			<div>
				<button onClick={() =>this.turnScannerOnOff(e)}>Turn Check In On/Off</button>
				<QrReader
				delay={300}
				onError={this.handleError}
				onScan={(event) => this.handleScan(event, e)}
				style={{ width: '100%' }}
				/>
			</div>

		) : (
			<button onClick={() =>this.turnScannerOnOff(e)}>Turn Check In On/Off</button>
		)}


	</div>)}		)}

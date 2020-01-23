import React from 'react'
import DatePicker from "react-datepicker";
import { Elements, StripeProvider } from "react-stripe-elements";
import SaveCardForm from "./SaveCardForm";



class LastMinuteTickets extends React.Component {

	state = {

}

componentDidMount(){

}

	render() {

	  return (
			<>
			<h5>{this.props.ticketType}</h5>

			<p>A small number of tickets will be sold shortly. You can bid for these tickets here. If there excess demand, the tickets will sell to the highest bidder</p>


			<div>
			<label>How Many Tickets?</label>
				<input
					required
					type="number"
					min={1}
					max={10}
					value={this.props.waitListData.quantity}
					onChange={(event) => {this.props.waitListChange(event, 'quantity', this.props.placeInOriginalArray); this.props.calculateTotals({lastMinuteTicket: true})}}
					/>
			</div>

			<div>
			<label>
				{`How much are your prepared to pay?: ${this.props.currency}`}
			</label>
				<input
					required
					type="number"
					min={this.props.minimumPrice}
					value={this.props.waitListData.maximumPrice}
					onChange={(event) => {this.props.waitListChange(event, 'maximumPrice', this.props.placeInOriginalArray);this.props.calculateTotals({lastMinuteTicket: true})}}
					/>
			</div>



			<div>
			<label>
				When is the latest you are willing your receive your tickets?
			</label>
			<select
				required
				value={this.props.waitListData.expires}
				onChange={event => this.props.waitListChange(event, 'expires', this.props.placeInOriginalArray)}
			>
				<option value="starts">When Event Starts</option>
				<option value="hourBeforeEnds">1 Hour Before Event Ends</option>
				<option value="specific">Let me set a specific date and time</option>
			</select>
			</div>

			{this.props.waitListData.expires ==='specific' && <div>
			<DatePicker
				required
				timeIntervals={15}
				selected={this.props.waitListData.specificDate}
				onChange={event =>
				this.props.waitListChange(event, "specificDate", this.props.placeInOriginalArray)
				}
				showTimeSelect
				dateFormat="Pp"
				placeholderText='Enter Date'
			/>

								</div>}

			<hr />
			</>
		)
}
}

export default LastMinuteTickets

import React from 'react'
import DatePicker from "react-datepicker";
import { Elements, StripeProvider } from "react-stripe-elements";
import SaveCardForm from "./SaveCardForm";
import ColmTicket from "./ColmTicket";



class LastMinuteTickets extends React.Component {

	state = {}

componentDidMount(){}

	render() {
	  return (
<>
	<p>More tickets may become available shortly. You can reserve your ticket here.</p> 
	<p>Your card will only be charged if a ticket is available for you.</p>


			
        return (
          <div >
            <ColmTicket
              ticketType={this.props.ticketType}
              description={this.props.ticketDescription}
              price={this.props.price}
              refunds={this.props.refunds}
              chargeForNoShows={this.props.chargeForNoShows}
              hold={this.props.hold}
            //   quantity={this.props.buy.numTicketsSought}
              changeQuantity={this.changeQuantity}
            />
          </div>
        );
  
				
	  


			{/* <div>
			<label>How Many Tickets?</label>
				<input
					required
					type="number"
					min={1}
					max={10}
					value={this.props.waitListData.quantity}
					onChange={(event) => {this.props.waitListChange(event, 'numTicketsSought', this.props.placeInOriginalArray); this.props.calculateTotals({lastMinuteTicket: true})}}
					/>
			</div> */}



			{/* {this.props.refundOption === 'auction' ? 

				<div>
					<label>{`How much are your prepared to pay?: ${this.props.currency}`}</label>
					<input
						required
						type="number"
						min={this.props.minimumPrice}
						value={this.props.waitListData.maximumPrice}
						onChange={(event) => {this.props.waitListChange(event, 'price', this.props.placeInOriginalArray);this.props.calculateTotals({lastMinuteTicket: true})}}
					/>
				</div>
				: 
	  			<div>Price: {this.props.minimumPrice}</div>
			} */}





			{/* <div>
			<label>
				When is the latest you are willing your receive your tickets?
			</label>
			<select
				required
				value={this.props.waitListData.expires}
				onChange={event => this.props.waitListChange(event, 'waitListExpires', this.props.placeInOriginalArray)}
			>
				<option value="starts">When Event Starts</option>
				<option value="hourBeforeEnds">1 Hour Before Event Ends</option>
				<option value="specific">Let me set a specific date and time</option>
			</select>
			</div> */}

			{/* {this.props.waitListData.expires ==='specific' && <div>
			<DatePicker
				required
				timeIntervals={15}
				selected={this.props.waitListData.specificDate}
				onChange={event =>
				this.props.waitListChange(event, "waitListSpecificDate", this.props.placeInOriginalArray)
				}
				showTimeSelect
				dateFormat="Pp"
				placeholderText='Enter Date'
			/>

								</div>} */}

{/* {this.props.waitListData.quantity > 1 &&<div>
		<label>
			How do you want to receive your tickets?
		</label>
		<select
			required
			value={this.props.waitListData.deliverTogether}
			onChange={event => this.props.waitListChange(event, 'waitListDeliverTogether', this.props.placeInOriginalArray)}
		>
			<option value="false">1 by 1 as they become available (more likely to receive tickets)</option>
			<option value="true">Only when {this.props.waitListData.quantity} tickets are available</option>
		</select>
		</div>} */}

			<hr />
			</>
		)
}
}

export default LastMinuteTickets

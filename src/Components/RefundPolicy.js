import React from 'react'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"



class RefundPolicy extends React.Component {

	state = {
		message: {
			excessDemand: 'When the event is sold out customers can provide their credit card details to join the wait list. Their cards will be charged as tickets become available through refunds',
			untilSpecific: 'You are missing out on an opportunity to make additional money from your event. When your event is sold out, customers can bid for tickets that become available through refunds. The ticket is sold to the higgest bidder. Select the first option if you would like to avail of this',
			noRefunds: 'You are missing out on an opportunity to make additional money from your event. When your event is sold out, customers can bid for tickets that become available through refunds. The ticket is sold to the higgest bidder. Select the first option if you would like to avail of this'
		}
	}


componentDidMount(){

}

	render() {



	  return (
			<>

			<div>
			<select
			required
			value={this.props.selectedRefundOption}
			onChange={event => this.props.handleRefundChange(event, 'optionSelected', this.props.i)}
			>
				<option
					value="excessDemand"
					>Refund if tickets are sold out and new customers are waiting to buy</option>
				<option value="untilSpecific">Refund until a specific date & time</option>
				<option value="noRefunds">No Refunds</option>
			</select>
			</div>



			{this.props.selectedRefundOption === "untilSpecific" &&
					<div>
					<DatePicker
						timeIntervals={15}
						selected={this.props.refundUntil}
						placeholderText="Select Date"
						onChange={event =>
							this.props.handleRefundChange(event, "refundUntil", this.props.i)
						}
						showTimeSelect
						dateFormat="Pp"
						required
						/>
					</div>
				}



		<div>{this.state.message[this.props.selectedRefundOption]}</div>



	{this.props.selectedRefundOption !== "noRefunds" &&
	<div>
	<h4>How to ReSell {this.props.ticketName}</h4>


		<select
		required
		value={this.props.howToResell}
		onChange={event => this.props.handleRefundChange(event, 'howToResell', this.props.i)}
		>
			<option
				value="auction"
				disabled={this.props.selectedRefundOption !== "excessDemand"}
				>Auction to Highest Bidder</option>
				<option value="originalPrice">Charge Original Price</option>
				<option value="specific">Charge Specific Price</option>
		</select>

		{this.props.howToResell === "auction" &&
				<div>
				<div>{this.props.textForAuctionAndSpecific} {this.props.currencySymbol} {this.props.highestPricedTicket}</div>
				<input
					value={this.props.minimumPrice}
					required
					min={this.props.highestPricedTicket}
					type='number'
					onChange={event => this.props.handleRefundChange(event, 'minimumAuctionPrice', this.props.i)}
					placeholder='Enter Minimum Auction Price Here'
					/>
				</div>
			}

		{this.props.howToResell === "specific" &&
				<div>
				<div>{this.props.textForAuctionAndSpecific} {this.props.highestPricedTicket}</div>
				<input
					value={this.props.resellAtSpecificPrice}
					required
					min={this.props.highestPricedTicket}
					type='number'
					onChange={event => this.props.handleRefundChange(event, 'resellAtSpecificPrice', this.props.i)}
					placeholder='Enter ReSale Price Here'
					/>
				</div>
			}





		{this.props.numberOfTickets >1 &&
			<div>
					<h4>What to name tickets when re-selling</h4>
						<select
						required
						value={this.props.nameOfResoldTickets}
						onChange={event => this.props.handleRefundChange(event, 'nameOfResoldTickets', this.props.i)}
						>
							<option
								value="original"
								>{this.props.originalNames}</option>
								<option value="lastMinuteTickets">Sell as 'Last Minute Tickets'</option>
						</select>
						</div>}

	</div>
	}


			</>
		)
}
}

export default RefundPolicy

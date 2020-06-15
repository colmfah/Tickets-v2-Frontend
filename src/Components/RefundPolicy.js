import React from 'react'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"



class RefundPolicy extends React.Component {

	state = {}


	componentDidMount(){}

	render() {

		let refundSummary = ''

		if (this.props.howToResell === 'originalPrice'){
			this.props.globalRefundPolicy === true ?
			refundSummary = `Refunded tickets will be named '${this.props.originalName[0]}', '${this.props.originalName[1]}' etc. They will be sold with tickets that haven't been refunded and won't be distinguishable from them.` : refundSummary = `Refunded tickets will be named '${this.props.originalName}'. They will be sold with tickets that haven't been refunded and won't be distinguishable from them.`
		} else if (this.props.ticketTypesEquivalent === true){
			this.props.globalRefundPolicy === true ?
			refundSummary = `All your refunded tickets will be resold as 'Last Minute Tickets'. There will be no mention of ${this.props.originalName[0]}, ${this.props.originalName[1]} etc` : refundSummary = `Refunded tickets will be resold as 'Last Minute Tickets'. There will be no mention of '${this.props.originalName}'`
		} else{
			this.props.globalRefundPolicy === true ?
			refundSummary = `All your refunded tickets will be resold referencing their original name - 'Last Minute ${this.props.originalName[0]} Tickets', 'Last Minute ${this.props.originalName[1]} Tickets' etc.` : refundSummary = `Refunded tickets will be resold be resold referencing their original name - 'Last Minute ${this.props.originalName} Tickets'`
		}

		let refundOrCancel
		let ticketNames



		if(this.props.freeTickets){
			refundOrCancel = {
				1:'Allow cancellations',
				2: 'Allow cancellations for',
				3: 'No cancellations allowed'
			}
		}else{
			refundOrCancel = {
				1: 'Refund',
				2: 'Refund',
				3: 'No refunds allowed'
			}
		}


		{/*`${refundOrCancel[2]} each specific ticket type (${this.props.originalName[0]}, ${this.props.originalName[1]} etc.) if it has sold out and new customers are waiting to buy`*/}

	  	return (
			<>

				<div>
					<select
					required
					value={this.props.selectedRefundOption}
					onChange={event => this.props.handleRefundChange(event, 'optionSelected', this.props.i)}
					>
						<option value="excessDemand">
							{refundOrCancel[1]} if all {this.props.numberOfTickets > 1 ? 'ticket types' : 'tickets'} have sold out and new customers are waiting to buy
						</option>

						{this.props.numberOfTickets > 1 && 
							<option value="excessDemandTicketType">
							{`${refundOrCancel[2]} each specific ticket type (${this.props.originalName[0]}, ${this.props.originalName[1]} etc.) if it has sold out and new customers are waiting to buy`}
							</option>
						}
						<option value="untilSpecific">{refundOrCancel[1]} until a specific date and time</option>
						<option value="noRefunds">{refundOrCancel[3]} </option>
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




				{(this.props.selectedRefundOption !== "noRefunds" && !this.props.freeTickets) &&
					<div>
						<h4>How to ReSell {this.props.ticketName}</h4>
						<select
							required
							value={this.props.howToResell}
							onChange={event => this.props.handleRefundChange(event, 'howToResell', this.props.i)}
							>
							<option
								value="auction"
								disabled={this.props.selectedRefundOption !== "excessDemand" && this.props.selectedRefundOption !== 'excessDemandTicketType'}
								>Auction to Highest Bidder
							</option>
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
									onChange={event => this.props.handleRefundChange(event, 'minimumPrice', this.props.i)}
									placeholder={this.props.highestPricedTicket}
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
					</div>
				}

				{(this.props.numberOfTickets > 1 && !this.props.freeTickets) && <div>{refundSummary}</div>}


			</>
		)
}
}

export default RefundPolicy

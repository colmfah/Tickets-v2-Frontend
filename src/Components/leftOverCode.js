return (
    <>
        <Nav />
        <EventDetails />
    
       
 

    
    
            {this.state.userEvent.tickets.find(e=>e.chargeForTicketsStatus === 'chargeForTickets')!==undefined &&
                <div>
                    
                    <h3>Refund Policy</h3>
    
                    <RefundPolicy
                        freeTickets={false}
                        ticketTypesEquivalent={this.state.userEvent.ticketTypesEquivalent}
                        globalRefundPolicy ={this.state.userEvent.globalRefundPolicy}
                        selectedRefundOption={this.state.userEvent.globalRefundOptions.optionSelected}
                        handleRefundChange={this.handleRefundChange}
                        refundUntil={this.state.userEvent.globalRefundOptions.refundUntil}
                        howToResell={this.state.userEvent.globalRefundOptions.howToResell}
                        resellAtSpecificPrice={this.state.userEvent.globalRefundOptions.resellAtSpecificPrice}
                        i = {'not relevant'}
                        price={this.state.userEvent.tickets.price}
                        textForAuctionAndSpecific={'The original price of the most expensive ticket is'}
                        ticketName={'Refunded Tickets'}
                        minimumPrice={this.state.userEvent.tickets.minimumPrice}
                        highestPricedTicket={this.highestPricedTicket()}
                        currencySymbol={this.state.currencyOptions[this.state.userEvent.currency]}
                        nameOfResoldTickets={this.state.userEvent.globalRefundOptions.nameOfResoldTickets}
                        originalName={this.getTicketNames('chargeForTickets')}
                        numberOfTickets={this.state.userEvent.tickets.length}
                        ticketTypesEquivalent={this.state.userEvent.ticketTypesEquivalent}
                    />
                    
                </div>
            }
    
            {this.state.userEvent.tickets.find(e=>{return (e.chargeForTicketsStatus === 'freeTickets' && e.chargeForNoShows > 0)})!==undefined &&
                <div>
                    <h3>Cancellation Policy For Free Tickets</h3>
                    <h5>This applies to free tickets that incur a penalty if customer doesn't show up.</h5><br /> 
                    <h5>Free tickets that do not incur a penalty can be cancelled by customer at any time</h5>
    
                    <RefundPolicy
                        freeTickets={true}
                        ticketTypesEquivalent={this.state.userEvent.ticketTypesEquivalent}
                        globalRefundPolicy ={this.state.userEvent.globalRefundPolicy}
                        selectedRefundOption={this.state.userEvent.globalRefundOptions.optionSelected}
                        handleRefundChange={this.handleRefundChange}
                        refundUntil={this.state.userEvent.globalRefundOptions.refundUntil}
                        howToResell={this.state.userEvent.globalRefundOptions.howToResell}
                        resellAtSpecificPrice={this.state.userEvent.globalRefundOptions.resellAtSpecificPrice}
                        i = {'not relevant'}
                        price={this.state.userEvent.tickets.price}
                        textForAuctionAndSpecific={'The original price of the most expensive ticket is'}
                        ticketName={'Refunded Tickets'}
                        minimumPrice={this.state.userEvent.tickets.minimumPrice}
                        highestPricedTicket={this.highestPricedTicket()}
                        currencySymbol={this.state.currencyOptions[this.state.userEvent.currency]}
                        nameOfResoldTickets={this.state.userEvent.globalRefundOptions.nameOfResoldTickets}
                        originalName={this.getTicketNames('freeTickets')}
                        numberOfTickets={this.state.userEvent.tickets.length}
                        ticketTypesEquivalent={this.state.userEvent.ticketTypesEquivalent}
                    />
    
                </div>
            
            }
    
    
    
            <button>Create Event</button>
        </form>
    
    
        </>
        )
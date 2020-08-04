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

    

    
                </div>
            
            }
    
    
    
            <button>Create Event</button>
        </form>
    
    
        </>
        )
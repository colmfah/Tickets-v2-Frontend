import React, { Component } from 'react'
import Nav from "../Nav";
import DatePicker from "react-datepicker";
import moment from "moment";

export class Test extends Component {

    state = {
        errors: [],
        newTicketCreated: false,
        ticketsCreated: 1,
        tickets:[{
            ticketType: '',
            ticketNumber: 1,
            ticketDescription: '',
            chargeForTicketsStatus: '',
            chargeForNoShows: '',
            price: '',
            hold: '',
            startSelling: '',
            startSellingTime: '',
            stopSelling: '',
            stopSellingTime: '',
            sellWhenTicketNumberSoldOut: '',
            numberOfTickets: '',
            borderColors: {
                ticketType: 'none',
                ticketDescription: 'none',
                chargeForTicketsStatus: 'none',
                chargeForNoShows: 'none',
                price: 'none',
                hold: 'none',
                startSelling: 'none',
                startSellingTime: 'none',
                stopSelling: 'none',
                stopSellingTime: 'none',
                sellWhenTicketNumberSoldOut: 'none',
            },
            errors:{
                ticketType: '',
                ticketDescription: '',
                chargeForTicketsStatus: '',
                chargeForNoShows: '',
                price: '',
                hold: '',
                startSelling: '',
                startSellingTime: '',
                stopSelling: '',
                stopSellingTime: '',
                sellWhenTicketNumberSoldOut: ''
            }
        }]
    }

    componentDidUpdate(prevProps, prevState){

        if(this.state.newTicketCreated){		
            document.getElementById(`ticket${this.state.tickets.length -1}`).scrollIntoView({behavior: "smooth"})
            let stateCopy = this.state
            stateCopy.newTicketCreated = false
            this.setState(stateCopy)
        }
    }


    newTicket(e){
        e.preventDefault()
        let tickets = this.state.tickets
        let ticketsCreated = this.state.ticketsCreated
        let newTicketCreated = true
        ticketsCreated++
        tickets.push({
            ticketType: '',
            ticketNumber: 1,
            ticketDescription: '',
            chargeForTicketsStatus: '',
            chargeForNoShows: '',
            price: '',
            hold: '',
            startSelling: '',
            startSellingTime: '',
            stopSelling: '',
            stopSellingTime: '',
            sellWhenTicketNumberSoldOut: '',
            numberOfTickets: '',
            borderColors: {
                ticketType: 'none',
                ticketDescription: 'none',
                chargeForTicketsStatus: 'none',
                chargeForNoShows: 'none',
                price: 'none',
                hold: 'none',
                startSelling: 'none',
                startSellingTime: 'none',
                stopSelling: 'none',
                stopSellingTime: 'none',
                sellWhenTicketNumberSoldOut: 'none',
            },
            errors:{
                ticketType: '',
                ticketDescription: '',
                chargeForTicketsStatus: '',
                chargeForNoShows: '',
                price: '',
                hold: '',
                startSelling: '',
                startSellingTime: '',
                stopSelling: '',
                stopSellingTime: '',
                sellWhenTicketNumberSoldOut: ''
            }
        })
        this.setState({tickets, ticketsCreated, newTicketCreated})
    }

    continue = (e, values) => {
        e.preventDefault()
        console.log('values.endDetails', values.endDetails)
        console.log('e.stopSelling', e.stopSelling);
        console.log('moment(e.stopSelling).isAfter(values.endDetails)', moment(e.stopSellingTime).isAfter(values.endDetails));
        
        
        
        const checkForErrors = (values) => {            
            let errors = []
            let validTicketTypeIDs = this.state.tickets.map(e=>e.ticketTypeID)
            this.state.tickets.forEach((e,i) => {
                if(e.ticketType === ''){
                    errors.push(`Please provide a name for ticket ${i+1}`)
                } 
                if(e.numberOfTickets === ''){
                    errors.push(`Please fill out the number of tickets you wish to sell for ticket ${i+1}`)
                } 
                if(e.startSelling === ''){
                    errors.push(`Please fill out the time to start selling ticket ${i+1}`)
                }
                if(e.stopSelling === ''){
                    errors.push(`Please fill out the time to stop selling ticket ${i+1}`)
                }
                if(e.chargeForTicketsStatus === ''){
                    errors.push(`Please select whether ticket ${i+1} is a paid ticket or free ticket`)
                }
                if(e.chargeForTicketsStatus === 'freeTickets' && e.chargeForNoShows === ''){
                    errors.push(`Please fill out how much you want to fine customers who don't turn up for ticket ${i+1}`)
                }else if (e.chargeForTicketsStatus !== 'freeTickets' && e.price === ''){
                    errors.push(`Please fill out the price for ticket ${i+1}`)
                }

                if(e.chargeForTicketsStatus === 'freeTickets' && e.chargeForNoShows > 0 && e.hold === ''){
                    errors.push(`Please select how to fine customers who purchase ticket ${i+1} but don't turn up`)
                }

                if( e.startSelling!=="whenPreviousSoldOut" && !moment(e.stopSellingTime).isAfter(e.startSellingTime)){

                    errors.push(`You have chosen to stop selling ticket ${i+1} before the time you have chosen to start selling them`)
                }
                if(moment(e.stopSellingTime).isAfter(values.endDetails)){
                    errors.push(`You are continuing to sell ticket ${i+1} when the event is over. Please change your stop selling time`)
                }
                if(e.startSelling ==='whenPreviousSoldOut' && !validTicketTypeIDs.includes(Number(e.sellWhenTicketNumberSoldOut))){

                    console.log('validTicketTypeIDs', validTicketTypeIDs)
                    console.log('e.sellWhenTicketNumberSoldOut', e.sellWhenTicketNumberSoldOut);
                    
                    

                    errors.push(`You have chosen not to sell ticket ${i+1} until a ticket that doesn't exist sells out`)
                }
            })

            if(this.state.tickets.length > 1 && values.ticketTypesEquivalent === ''){
                errors.push(`Please select whether or not your ticket types are equivalent`)
            }

            return errors
        }

        let errors = checkForErrors(values)

        errors.length === 0 ? this.props.nextStep() : this.setState({errors})
        
    }

    changeSellingTimes = (e, ticketNumber, field1, field2, values) => {

        console.log(typeof(e))

		let tickets = this.state.tickets

		tickets[ticketNumber][field1] = e.target.value

		if(e.target.value === 'now'){
			tickets[ticketNumber][field2] = Date.now()
		} else if(e.target.value === 'whenPreviousSoldOut'){
			tickets[ticketNumber][field2] = ''
			if(tickets[ticketNumber].numberOfTickets === 2){
				tickets[1]['sellWhenTicketNumberSoldOut'] = 1
			}
		} else if(e.target.value === 'eventBegins'){
			tickets[ticketNumber][field2] = values.startDetails
		} else if (e.target.value ==='eventEnds'){
			tickets[ticketNumber][field2] = values.endDetails
        }

        this.setState({ tickets })
        
        this.checkForTimeErrors(e, ticketNumber, field1, field2, values)
    }

    changeTicketDetails(e, field, i, values){
        e.preventDefault()
        let tickets = this.state.tickets
        tickets[i][field] = e.target.value

        this.setState({tickets})

        if(field==='chargeForTicketsStatus' || field === 'chargeForNoShows' || field === 'chargeForNoShows' || field ==='price' || field === 'hold' || field === 'numberOfTickets' || field ==='sellWhenTicketNumberSoldOut'){
            this.checkForErrors(e,field,i)
        }
    }

    checkForDescriptionErrors(e, i){
        e.preventDefault()
        let tickets = this.state.tickets
        tickets[i].borderColors.ticketDescription = '#00988f' 
        this.setState({tickets})
    }

    checkForErrors(e, field, i){
        e.preventDefault()
        let tickets = this.state.tickets
        let warning = ''

        if(tickets[i][field] === ''){

            
            if(field ==='ticketType'){
                warning = 'Please Name Your Ticket'
            }else if(field === 'chargeForTicketsStatus'){
                warning = 'Please Select An Option'
            }else if(field === 'chargeForNoShows'){
                warning = 'Please Select How Much To Charge. Select €0 If You Do Not Want To Charge No Shows'
            }else if(field === 'hold'){
                warning = 'Please Select How To Fine Customers Who Do Not Turn Up'
            }else if(field === 'startSelling'){
                warning = 'Please Select When To Start Selling'
            }else if(field === 'stopSelling'){
                warning = 'Please Select When To Stop Selling'
            }else if(field === 'sellWhenTicketNumberSoldOut'){
                warning = 'Please Select Which Ticket Must Sell Out'
            }
   
        }else if((field === 'chargeForNoShows' && tickets[i].chargeForNoShows < 0) || (field === 'price' && tickets[i].price < 0)){
            warning = 'Value Must Be Positive'

        }else if (field === 'price' && tickets[i].price > 0 && tickets[i].price < 1){
            warning = 'If Tickets Are Not Free, The Minimum Price Allowed Is €1'
        }
 
        tickets[i].errors[field] = warning
        let color 
        warning === '' ? color = '#00988f' : color = 'tomato'
        tickets[i].borderColors[field] = color

        this.setState({tickets})

    }


    checkForTimeErrors(e, i, field1, field2, values){
        e.preventDefault()
        let tickets = this.state.tickets
        let warning = ''
        if(tickets[i][field1] === ''){
            warning = 'Please Select A Time'
        }else if(moment(field2).isAfter(moment(values.endDetails))){
            warning = 'Tickets Cannot Be Sold After Your Event Has Ended'
        }

        
        tickets[i].errors[field1] = warning
        let color 
        warning === '' ? color = '#00988f' : color = 'tomato'

        tickets[i].borderColors[field1] = color

        this.setState({tickets})

    }

    deleteTicket = (e, ticketNumber) => {
		e.preventDefault()
		let tickets = this.state.tickets
		tickets.splice(ticketNumber, 1)
		this.setState({ tickets })
    }

    // getCoordinates = () => {

    //     let rect = document.getElementById("test").getBoundingClientRect()
   
    // }

    goBack = (e) => {
        
     
        this.props.prevStep()
    }


    setSpecificTime(e, i, field, values){
        let tickets = this.state.tickets        
        tickets[i][field] = e
        
        this.setState({tickets})

        if(field === 'startSellingTime'){
            this.startSellingSpecificTimeErrors(e, i, field, values)
        }else if(field === 'stopSellingTime'){
            this.stopSellingSpecificTimeErrors(e, i, field, values)
        }
    }


    startSellingSpecificTimeErrors = (e, i, field, values) => {

        console.log('start selling error check triggered');
        
        let tickets = this.state.tickets
        let warning = ''

        if(tickets[i][field] === ''){

            warning = 'Please Select When You Want To Start Selling These Tickets'
    
        }else if(moment(e).isAfter(moment(values.endDetails))){

            warning = 'You Cannot Sell Tickets After The Event Ends'
        }

        tickets[i].errors[field] = warning
        let color 
        warning === '' ? color = '#00988f' : color = 'tomato'
        tickets[i].borderColors[field] = color

        this.setState({tickets})

    }

    stopSellingSpecificTimeErrors = (e, i, field, values) => {

        console.log('!moment(e).isAfter(moment(this.state.startDetails))', !moment(e).isAfter(moment(this.state.startDetails)));
        

        let tickets = this.state.tickets
        let warning = ''

        if(tickets[i][field] === ''){

            warning = 'Please Select When You Want To Stop Selling These Tickets'
    
        }else if(moment(e).isAfter(moment(values.endDetails))){

            warning = 'You Cannot Sell Tickets After The Event Ends'

        }else if(!moment(e).isAfter(moment(this.state.startDetails))){

            warning = 'You Have Selected To Stop Selling Tickets Before You Start Selling Them'
        }

        tickets[i].errors[field] = warning
        let color 
        warning === '' ? color = '#00988f' : color = 'tomato'
        tickets[i].borderColors[field] = color

        this.setState({tickets})

    }

    turnBorderOrange(e, field, i){
        e.preventDefault()        
        let tickets = this.state.tickets
        tickets[i].borderColors[field] = '#ff8c00' 
        tickets[i].errors[field]=''  
        console.log('tickets', tickets);
         
        this.setState({tickets})
    }





 
    
    



    render() {

        const {values} = this.props

        let chargeForTicketsStatusColor = this.state.tickets.map(e => {
            if(e.chargeForTicketsStatus === ''){return 'rgb(118, 118, 118)'}else{return 'black'}
        })
        let holdColor = this.state.tickets.map(e => {
            if(e.hold === ''){return 'rgb(118, 118, 118)'}else{return 'black'}
        })
        let startSellingColor = this.state.tickets.map(e => {
            if(e.startSelling === ''){return 'rgb(118, 118, 118)'}else{return 'black'}
        })
        let stopSellingColor = this.state.tickets.map(e => {
            if(e.stopSelling === ''){return 'rgb(118, 118, 118)'}else{return 'black'}
        })
        let sellWhenTicketNumberSoldOutColor = this.state.tickets.map(e => {
            if(e.sellWhenTicketNumberSoldOut=== ''){return 'rgb(118, 118, 118)'}else{return 'black'}
        })

        let numberOfTicketsColor = this.state.tickets.map(e => {
            if(e.numberOfTickets === ''){return 'rgb(118, 118, 118)'}else{return 'black'}
        })




        
        
        



        let startSelling = this.state.tickets.map((e,i) => {
            if(e.startSelling === 'whenPreviousSoldOut'){
                
                if(i===1){return(<div className="group"></div>)
                }else{
    
                    return(
                        <div>
                            <p className="warning">{this.state.tickets[i].errors.sellWhenTicketNumberSoldOut}</p>
                            <div className="group">
                                <select
                                    required
                                    value={this.state.tickets[i].sellWhenTicketNumberSoldOut}
                                    onBlur={event => this.checkForErrors(event, 'sellWhenTicketNumberSoldOut', i)}
                                    onChange={event => this.changeTicketDetails(event, 'sellWhenTicketNumberSoldOut', i)}
                                    onFocus={event => this.turnBorderOrange(event, 'sellWhenTicketNumberSoldOut', i)}
                                    style={{  borderColor: this.state.tickets[i].borderColors.sellWhenTicketNumberSoldOut, color: sellWhenTicketNumberSoldOutColor[i] }}
                                >
                    
                                    <option value=''>When which ticket is sold out?</option>
                        
                                    {this.state.tickets.filter((e, ind) => ind<i).map(	(e, index) => {
                                        return (
                                            <option key={index} value={e.ticketTypeID}>
                                                {e.ticketType}
                                            </option>
                                        )}	
                                    )}
                                </select>   
                            </div>
                        </div>
                    )

                }
   
            } else if(e.startSelling == 'specific'){
                return(
                    <div>
                        <p className="warning">{this.state.tickets[i].errors.startSellingTime}</p>
                        <div className="group datePickerDiv"
                            style={{ borderColor: this.state.tickets[i].borderColors.startSellingTime }}  
                        >                 
                            <DatePicker
                                className="datePicker"
                                timeIntervals={15}
                                onBlur={event => this.startSellingSpecificTimeErrors(event, i, 'startSellingTime', values)}
                                onChange={event => this.setSpecificTime(event, i, 'startSellingTime', values)}
                                onFocus={event => this.turnBorderOrange(event, 'startSellingTime', i)}
                                selected={this.state.tickets[i].startSellingTime}
                                placeholderText='Select Date And Time'
                                showTimeSelect
                                dateFormat="Pp"
                                required
                                />
                        </div>
                    </div>
                )
            }else{return <div></div>}
        })



        


        return (
            <> 

                <div className="pageGrid3Rows">

                    <div className="navBar"><Nav /></div>

                    <div id="centerTicketsInRow">

                        <div></div>
                        <div className="wrapper">
                 
                            {this.state.tickets.map((e, i) => {
                                return (
    
                                    <div className ="content createTicket" id={`ticket${i}`} >

                                        <div 
                                            className="ticketNumber"
                                            style={{display: this.state.tickets.length === 1? 'none' : 'block' }}
                                        >
                                            {i+1}
                                        </div> 

                                        <form key={i}>
                                            <p className="warning">{this.state.tickets[i].errors.ticketType}</p>
                                            <div className="group">
                                                <input
                                                    required
                                                    type="text"
                                                    value={this.state.tickets[i].ticketType}
                                                    onBlur={event => this.checkForErrors(event, 'ticketType', i)}
                                                    onChange={event => this.changeTicketDetails(event, 'ticketType', i)}
                                                    onFocus={event => this.turnBorderOrange(event, 'ticketType', i)}
                                                    placeholder="Ticket Name eg. General Admission"
                                                    style={{borderColor: this.state.tickets[i].borderColors.ticketType}}
                                                />     
                                            </div>

                                            <p className="warning">{this.state.tickets[i].errors.ticketDescription}</p>
                                            <div className="group">
                                                <textarea
                                                    type="text"
                                                    value={this.state.tickets[i].ticketDescription}
                                                    onBlur={event => this.checkForDescriptionErrors(event, i)}
                                                    onChange={event => this.changeTicketDetails(event, 'ticketDescription', i)}
                                                    onFocus={event => this.turnBorderOrange(event, 'ticketDescription', i)}
                                                    placeholder="Ticket Description (optional)"
                                                    style={{borderColor: this.state.tickets[i].borderColors.ticketDescription}}
                                                />          
                                            </div>

                                            <p className="warning">{this.state.tickets[i].errors.chargeForTicketsStatus}</p>
                                            <div className="group">					          
                                                <select
                                                    required 
                                                    value={this.state.tickets[i].chargeForTicketsStatus}
                                                    onBlur={event => this.checkForErrors(event,'chargeForTicketsStatus', i)}
                                                    onChange={event => this.changeTicketDetails(event, 'chargeForTicketsStatus', i)}
                                                    onFocus={event => this.turnBorderOrange(event, 'chargeForTicketsStatus', i)}			
                                                    style={{ color: chargeForTicketsStatusColor[i], borderColor: this.state.tickets[i].borderColors.chargeForTicketsStatus }}
                                                >
                                                <option value="" disabled>Select Ticket Type</option>
                                                <option value="chargeForTickets" disabled>Charge For Tickets</option>
                                                <option value="freeTickets">Free Tickets</option>
                                                
                                                </select>
                                            </div>


                                            {this.state.tickets[i].chargeForTicketsStatus === 'freeTickets' ?
                                                <div>
                                                    <p className="warning">{this.state.tickets[i].errors.chargeForNoShows}</p>
                                                    <div className={this.state.tickets[i].chargeForNoShows === '' ? "group" : "group currencyInput"}>
                                                        <input
                                                            required
                                                            type="number"
                                                            value={this.state.tickets[i].chargeForNoShows}
                                                            onChange={event => this.changeTicketDetails(event, 'chargeForNoShows', i)}
                                                            onBlur={event => this.checkForErrors(event,'chargeForNoShows', i)}
                                                            onFocus={event => this.turnBorderOrange(event, 'chargeForNoShows', i)}	
                                                            placeholder="Fine for customers who don't show up"
                                                            min={0}
                                                            style={{borderColor: this.state.tickets[i].borderColors.chargeForNoShows}}
                                                        />     
                                                    </div>
                                                </div>

                                                :
                                                <div>
                                                    <p className="warning">{this.state.tickets[i].errors.price}</p>
                                                    <div className="group">
                                                        <input
                                                            required
                                                            type="number"
                                                            value={this.state.tickets[i].price}
                                                            onChange={event => this.changeTicketDetails(event, 'price', i)}
                                                            onBlur={event => this.checkForErrors(event,'price', i)}
                                                            onFocus={event => this.turnBorderOrange(event, 'price', i)}	
                                                            placeholder="Price"
                                                            min={0}
                                                            style={{borderColor: this.state.tickets[i].borderColors.price}}
                                                        />
                                                    </div>
                                                </div>
                                            
                                            }

                                            {this.state.tickets[i].chargeForNoShows > 0 ? 
                                            <div>
                                                <p className="warning">{this.state.tickets[i].errors.hold}</p>
                                                <div className="group">
                                                    <select
                                                        required 
                                                        value={this.state.tickets[i].hold}			
                                                        onChange={event => this.changeTicketDetails(event, 'hold', i)}
                                                        onBlur={event => this.checkForErrors(event,'hold', i)}
                                                        onFocus={event => this.turnBorderOrange(event, 'hold', i)}	
                                                        style={{ color: holdColor[i], borderColor: this.state.tickets[i].borderColors.hold }}          
                                                    >
                                                        <option value="" disabled>Place hold on customers' credit credit?</option>
                                                        <option value="hold"> Yes</option>
                                                        <option value="noHold">No</option>
                                                    </select>
                                                </div>
                                            </div>
                                            : <div className="group"></div>        
                                            }	

                                            <p className="warning">{this.state.tickets[i].errors.numberOfTickets}</p>
                                            <div className="group">          
                                                <input
                                                    required
                                                    type="number"
                                                    min={1}
                                                    value={this.state.tickets[i].numberOfTickets}
                                                    onChange={event => this.changeTicketDetails(event, 'numberOfTickets', i)}
                                                    onBlur={event => this.checkForErrors(event,'numberOfTickets', i)}
                                                    onFocus={event => this.turnBorderOrange(event, 'numberOfTickets', i)}	
                                                    placeholder="Number of Tickets"
                                                    style={{ color: numberOfTicketsColor[i], borderColor: this.state.tickets[i].borderColors.numberOfTickets }}
                                                />
                                            </div>

                                            <p className="warning">{this.state.tickets[i].errors.startSelling}</p>
                                            <div className="group">       
                                                <select
                                                    required 
                                                    value={this.state.tickets[i].startSelling}
                                                    onBlur={event => this.checkForErrors(event,'startSelling', i)}
                                                    onChange={event => this.changeSellingTimes(event, i, 'startSelling', 'startSellingTime', values)}
                                                    onFocus={event => this.turnBorderOrange(event, 'startSelling', i)}
                                                    style={{ color: startSellingColor[i], borderColor: this.state.tickets[i].borderColors.startSelling  }}
                                                >
                                                    <option value='' disabled>Start Selling Tickets</option>
                                                    <option value="now">Now</option>
                                                    <option value="specific">Specific Date and Time</option>
                                                    {i===1 ? <option value="whenPreviousSoldOut">When {this.state.tickets[0].ticketType} Is Sold Out</option>:<option value="whenPreviousSoldOut" disabled={i==0}>When A Previous Ticket Is Sold Out</option>}  
                                                </select>
                                            </div>

                                            {startSelling[i]}

                                            
                                            <p className="warning">{this.state.tickets[i].errors.stopSelling}</p>
                                            <div className="group">
                                                <select
                                                    required 
                                                    value={this.state.tickets[i].stopSelling}
                                                    onBlur={event => this.checkForErrors(event,'stopSelling', i)}
                                                    onChange={event => this.changeSellingTimes(event, i, 'stopSelling', 'stopSellingTime', values)}
                                                    onFocus={event => this.turnBorderOrange(event, 'stopSelling', i)}
                                                    style={{ color: stopSellingColor[i], borderColor: this.state.tickets[i].borderColors.stopSelling }}
                                                >
                                                    <option value='' disabled>Stop Selling Tickets</option>
                                                    <option value="eventBegins">When Event Begins</option>
                                                    <option value="eventEnds">When Event Ends</option>
                                                    <option value="specific">At Specific Date and Time</option>
                                                </select>
                                            </div>


                                            {this.state.tickets[i].stopSelling == 'specific'  ?
                                                <div>
                                                    <p className="warning">{this.state.tickets[i].errors.stopSellingTime}</p>
                                                    <div className="group datePickerDiv"
                                                    style={{ borderColor: this.state.tickets[i].borderColors.stopSellingTime }}  
                                                    >  
                                                            <DatePicker
                                                                className="datePicker"
                                                                timeIntervals={15}
                                                                onChange={event => this.setSpecificTime(event, i, 'stopSellingTime', values)}
                                                                onBlur={event => this.stopSellingSpecificTimeErrors(e, i, 'stopSellingTime', values)}
                                                                onFocus={event => this.turnBorderOrange(event, 'stopSellingTime', i)}
                                                                selected={this.state.tickets[i].stopSellingTime}
                                                                placeholderText='Select Date And Time'
                                                                showTimeSelect
                                                                dateFormat="Pp"
                                                                required
                                                            />

                                                    </div>
                                                </div>
                                                : <div className = "group"></div>
                                            }

                                            {this.state.tickets.length > 1 &&
                                                <button
                                                    className = "secondary" 
                                                    onClick={event => this.deleteTicket(event, i) }>Delete Ticket
                                                </button>
                                            }

                                        </form>

                                    </div>
                                )
                            })}
                    

                    </div>    
                        <div></div>

                    </div>

                    <div className="tempThirdRow">
                        <div></div>

              
                    
                        
                        <div className="buttonContainer" id="firstButtonContainer">
                            <button className="primary" onClick={event => this.newTicket(event)}>Create Another Ticket</button>
                        </div>

                        <div className="buttonContainer">
                            <button className="primary lhsbutton" onClick={event => this.continue(event, values)}>Continue</button>   
                            <button className="secondary rhsbutton" onClick={event => this.goBack(event)}>Go Back</button>
                        </div>

                        <div></div>
                    </div>

                </div>
                    

                {/* wrapper */}
                {/* grid center middle longForm */}

                    {/* {this.state.tickets.length > 1 && 		

                        <div className="group">
                            <select
                                required
                                value={values.ticketTypesEquivalent}
                                onChange={event => this.props.changeField(event, 'ticketTypesEquivalent', true)}
                            >
                                <option value='' disabled>Are all ticket types equivalent to each other when customers enter the event?</option>
                                <option value={true}>Yes - eg. Early Bird, General Admission etc.</option>
                                <option value={false}>No - eg. Backstage Access, VIP Treatment etc.</option>
                            </select>

                        </div>
                     } */}

               
                  
                    {/* <div></div>
                </div> */}
           
            </>
        )
    }
}

export default Test

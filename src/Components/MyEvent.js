import React from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import axios from "axios";
import TicketSummary from "./TicketSummary";



class MyEvent extends React.Component {
  state = {
        myEvent: {},
        tickets: [],
        emails: [],
        waitList: 0,
        validTicketsOnly: false,
        receivePromotionalMaterial: true,
  };

  componentDidMount() {
    let token = localStorage.getItem("token");
    axios.post(`${process.env.REACT_APP_API}/myEvent`, {token: token, myEventID: this.props.match.params.id})
      .then(res => {
        this.handleFailure(res.data)
        let tickets = res.data.tickets
        let emails = res.data.emails
        let waitList = res.data.waitList
        let myEvent = res.data.myEvent
        this.setState({tickets, emails, waitList, myEvent})
      
      }
        )    
  }

  getEmailAddresses(){
    let emails = this.state.emails
    if(this.state.validTicketsOnly){emails = emails.filter(e => e.validTicket)}
    if(this.state.receivePromotionalMaterial){emails = emails.filter(e => e.receivePromotionalMaterial)}
    emails = emails.map(e=>e.purchaserEmail)
    emails =[...new Set(emails)] 
    return emails.join(', ')
  }
 

  handleFailure(data){
    if(data.success){return}
    let message = data.message
    this.setState({message})
  }

  toggleCheckbox(event, checkbox){
    let stateCopy = this.state
    stateCopy[checkbox] = !stateCopy[checkbox]
    let validTicketsOnly = stateCopy.validTicketsOnly
    let promotionalMarketing = stateCopy.promotionalMarketing
    this.setState({validTicketsOnly, promotionalMarketing})
  }




  render() {
    return (
      <>
        <Nav />
        <div className='my-event-container'>
          <div className="my-event-title">
            <p>{this.state.message}</p>
            <h2>{this.state.myEvent.title}</h2>
            <hr />
          </div>
          <div className="my-event-tickets">
            <div className="my-event-heading">
              <h2>Sales Summary</h2>
              <hr />
            </div>
            {this.state.tickets.map((ticket, index)=> <TicketSummary ticket = {ticket} key={index}/>)}
          </div>

          <div className="my-event-tickets">
            <div className="my-event-heading">
              <h2>Email Addresses</h2>
              <hr />
            </div>
            <div className='my-event-checkbox-container'>
            <div>
                <input 
                    type="checkbox" id="receivePromotionalMaterial" name="receivePromotionalMaterial" value="receivePromotionalMaterial" 
                    checked={this.state.receivePromotionalMaterial} onChange={event => this.toggleCheckbox(event, 'receivePromotionalMaterial')}
                  /> 
                  {` Customers who agreed to receive promotional material only`}
              </div>
              <div>
                <input 
                  type="checkbox" id="validTicketsOnly" name="validTicketsOnly" value="validTicketsOnly" 
                  checked={this.state.validTicketsOnly} onChange={event => this.toggleCheckbox(event, 'validTicketsOnly')}
                /> 
                {` Valid tickets only (excludes refunds and failed payment attempts)`}
              </div>

            </div>
              <div className='my-event-emails'>{this.getEmailAddresses()}</div>  
          </div>
        </div>

          

        <Footer />
        </>
  
    )    
  }
}

export default MyEvent;




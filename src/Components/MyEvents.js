import React from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import axios from "axios";
import EventCard from "./EventCard";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import "../Styles/MyEvents.css";


class MyEvents extends React.Component {
  state = {
    user: {
      email: "",
      _id: "",
      ticketsBought: [],
      waitLists: [],
      myEvents: []
    }
  };

  componentDidMount() {
    let token = localStorage.getItem("token");
    axios.post(`${process.env.REACT_APP_API}/profile`, {token: token})
      .then(res => {
        console.log('res.data', res.data)
        this.setState({ user: res.data})})    
  }

  displayNoEventsMessage = () => {
    if(this.state.user.myEvents.length > 0){return}
    return (<div className="tickets-wrap center-text">You have not created any events</div>)
  }


  render() {
    return (
      <>
        <Nav />
        <div className="content-wrapper">
        <div className="my-events-heading">
              <header>My Events</header>
              <hr />
          </div>  
            {this.state.user.myEvents.map((e, i) => {
              if(e._id === '62d5c866a1b375717566969b'){return}
              return (
                <Link to={`/myevent/${e._id}`}>
                  <EventCard
                    name={e.title}
                    location={`${e.venue}, ${e.address1}`}
                    startDetails={e.startDetails}
                    price={e.price}
                    image={e.imageURL}
                  />
                </Link>
              );
            })}
        </div>
        <Footer />
        </>
      
    )    
  }
}
export default MyEvents;




// {this.state.yourEvents.map((e,i) => {return(

//   <div key={i}>

//       <p>{e.title}</p>
//       <p>Net Tickets Sold: {(e.ticketsSold - e.ticketsRefunded)} out of {e.capacity}</p>
//       <p>Total Tickets Sold (including cancelled tickets): {e.ticketsSold}</p>
//       <p>Cancelled Tickets: {e.ticketsRefunded}</p>
//       <br />

//       {(e.ticketTypes.length > 0 && e.ticketsSold > 0)&& 
      
//       <div>
//         <p>Ticket Types</p>
//         {e.ticketTypes.map((f,j) => {return(
//           <div key={j}>
//             <p>{f.ticketType}</p>
//             <p>Net Tickets Sold: {(f.ticketsSold - f.ticketsRefunded)} out of {f.capacity}</p>
//             <p>Total Tickets Sold (including cancelled tickets): {f.ticketsSold}</p>
//             <p>Cancelled Tickets: {f.ticketsRefunded}</p>
//             <br />
//           </div>
//         )})}
//       </div>
//       }
//       <hr />

//   </div>

// )
       
      
// })
// }

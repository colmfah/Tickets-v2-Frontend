import React from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import QrReader from "react-qr-reader";
import "../Styles/Tickets.css";
import axios from "axios";
import DatePicker from "react-datepicker";




class Test extends React.Component {

  test = (event) => {
    event.preventDefault()
    axios.post(`${process.env.REACT_APP_API}/test`, {})
  }
  


  render() {
    return (
      <button onClick={event => this.test(event)}>Test</button>

      
    )    
  }
}

export default Test;
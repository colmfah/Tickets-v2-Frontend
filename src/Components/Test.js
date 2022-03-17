import React from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import QrReader from "react-qr-reader";
import "../Styles/Tickets.css";


class Test extends React.Component {



  render() {
    return (
      <>
        <Nav />

        <QrReader
            delay={300}
            style={{ maxWidth: '500px', marginTop: '50px' }}
        />

        <Footer />
      </>
      
    )    
  }
}

export default Test;
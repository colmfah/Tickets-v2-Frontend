// class ColmTicket extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       height: 0,
//     };
//     this.containerRef = React.createRef();
//   }
//   componentDidMount() {
//     const { offsetHeight } = this.containerRef.current;

//     this.setState({
//       height: offsetHeight,
//     });
//   }

//   render() {
//     return (
//       <div>
//         <h1 ref={this.containerRef}>
//           {firstWord} <span>{restOfWord}</span>
//         </h1>

//         <div className="event-eye" style={{ height: this.state.height }}></div>
//       </div>
//     );
//   }
// }

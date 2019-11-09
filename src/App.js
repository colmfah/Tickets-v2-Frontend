import React from 'react'
import SignUp from './Components/SignUp'
import LogIn from './Components/LogIn'
import CreateEvent from './Components/CreateEvent'

function App() {
  return (
    <>
			<h1>Sign Up</h1>
			<SignUp />
			<br />
			<h1>Log In</h1>
			<LogIn />
			<h1>Create Event</h1>
			<CreateEvent />
    </>
  );
}

export default App;

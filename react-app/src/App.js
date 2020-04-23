import React from 'react';
import './App.css';
import { Route, Redirect } from 'react-router-dom';
import Login from './loginForm';
import RegistrationForm from './registrationForm';
import Posts from './postsPage';

const initialState = {
  loggedIn: null
};

export default class App extends React.Component {
  state = { 
    redirect: false,
    loggedIn: initialState.loggedIn,
    token: JSON.parse(localStorage.getItem("userToken"))
  };
  
  handler = (val) => {
    console.log(val);
    this.setState({
      loggedIn: val
    })
  }
  componentDidMount() {
    const token = this.state.token;
    // console.log(token);
    const searchParams = new URLSearchParams({"secret_token": token})
    // Check whether user is logged in TODO: token not in url
    fetch(`http://localhost:9000/user/authenticate?${searchParams.toString()}`, {
      method: "GET",
      headers: {"Content-Type": "application/x-www-form-urlencoded"}
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      else {
        throw new Error("Not logged in!");
      }
    })
    .then(data => {
      console.log(data);
      this.setState({loggedIn: true});
    })
    .catch(error => {
      console.log(error);
      this.setState({loggedIn: false});
    });
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }    
  return (
    <div className="App">
        {/* Render Posts component only after loggedIn state has been checked */}
        {this.state.loggedIn !== null && (
          <Route 
            exactly 
            render={(props) => <Posts {...props} loggedIn={this.state.loggedIn} />} 
            path="/posts" 
          />
        )}
        <Route 
          exactly 
          render={(props) => <Login {...props} handler={this.handler} />} 
          path="/login" 
        />
        <Route exactly component={RegistrationForm} path="/register" />
    </div>
  );
}
}

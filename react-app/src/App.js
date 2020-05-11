import React from 'react';
import './App.css';
import { Route, Redirect } from 'react-router-dom';
import Login from './loginForm';
import RegistrationForm from './registrationForm';
import Posts from './postsPage';
import Nav from './nav';

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
      this.setState({ loggedIn: true, redirect: "/posts"});

    })
    .catch(error => {
      console.log(error);
      this.setState({loggedIn: false, redirect: "/login"});
    });
  }
  render() {
  return (
    <div className="App">
        {/* Render components only after loggedIn state has been checked */}
        {this.state.loggedIn !== null && (
          <Route 
            exactly 
            render={(props) => (
              <div>
                <Nav {...props} loggedIn={this.state.loggedIn} handler={this.handler} />
                <Posts {...props} loggedIn={this.state.loggedIn} />
              </div>
            )} 
            path="/posts" 
          />
        )}
        {this.state.loggedIn !== null && (
        <Route 
          exactly 
            render={(props) => (
              <div>
                <Nav {...props} loggedIn={this.state.loggedIn} handler={this.handler} />
                <Login {...props} handler={this.handler} />
              </div>
            )}
          path="/login" 
        />
        )}
        {this.state.loggedIn !== null && (
          <Route 
            exactly 
            render={(props) => (
              <div>
                <Nav {...props} loggedIn={this.state.loggedIn} handler={this.handler} />
                <RegistrationForm/>
              </div>
            )}
            path="/register" 
          />
        )}

        {this.state.redirect !== false && (
          <Redirect to={this.state.redirect} />
        )}
    </div>
  );
}
}

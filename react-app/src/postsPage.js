import React from 'react';
import { Redirect } from 'react-router-dom';

export default class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      loggedIn: props.loggedIn
    };
    console.log("Posts logged in state: " + this.state.loggedIn);
  }
  render() {    
    if (!this.state.loggedIn) {
      this.setState({redirect: true});
    }
    if (this.state.redirect) {
      // this.setState({redirect: false});
      return <Redirect to="/login" />
    } 
    return (
      <div className="posts">
        Posts here
      </div>
    );
  }
}
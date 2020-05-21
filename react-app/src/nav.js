import React from 'react';
import { Link } from 'react-router-dom';

export default class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: props.loggedIn
    };
  }
  logoutHandler = (e) => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("username");
    this.props.handler(false);
    this.props.history.push('/login');
  }
  loginHandler = (e) => {
    this.props.history.push('/login');
  }
  render() {
    return (
      <nav className="Nav">
        <div className="Nav__container">
          <div className="Nav__right">
            <ul className="Nav__item-wrapper">
              <li className="Nav__item">
                <Link className="Nav__link" to="/posts">Posts</Link>
              </li>
              {this.state.loggedIn && (
                <li className="Nav__item">
                  <button onClick={e=>this.logoutHandler(e)}>Logout</button>
                </li>
              )}
              {!this.state.loggedIn && (
                <li className="Nav__item">
                  <button onClick={e=>this.loginHandler(e)}>Login</button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
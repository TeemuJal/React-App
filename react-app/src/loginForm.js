import React from "react";
import { Formik } from "formik";
import { Link, Redirect } from 'react-router-dom';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      error: null
    };
  }
  render() {
    const error = this.state.error;
    if (this.state.isLoggedIn) {
      return <Redirect to="/posts" />
    } 
    return (
      <div>
        {error && <p>{error.message}</p>}
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values, { setSubmitting }) => {
            fetch("http://localhost:9000/login", {
              method: "POST",
              headers: {"Content-Type": "application/x-www-form-urlencoded"},
              body: new URLSearchParams({
                "email": values.email,
                "password": values.password
              })
            })
            .then(response => {
              if (response.ok) {
                return response.json();
              }
              else {
                throw new Error("Wrong email/password");
              }
            })
            .then(data => {
              console.log(data.token);
              this.props.handler(true);
              this.setState({ isLoggedIn: true });
              localStorage.setItem("userToken", JSON.stringify(data.token));
            })
            .catch(error => {
              this.setState({ error })
            });
            setSubmitting(false);
          }}
        >
          { props => {
            const {
              values,
              touched,
              errors,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit
            } = props;
            return (
              <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input
                  name="email"
                  type="text"
                  placeholder="Enter your email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.email && touched.email && "error"}
                />
                {errors.email && touched.email && (
                  <div className="input-feedback">{errors.email}</div>
                )}

                <label htmlFor="password">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.password && touched.password && "error"}
                />
                {errors.password && touched.password && (
                  <div className="input-feedback">{errors.password}</div>
                )}

                <button type="submit" disabled={isSubmitting}>
                  Login
                </button>
              </form>
            );
          }}
        </Formik>
        <div>
          <Link className="Nav__link" to="/register">Register here!</Link>
        </div>
      </div>
    )
  }
} 
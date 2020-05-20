import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Link, Redirect } from 'react-router-dom';

export default class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRegistered: false,
      error: null
    };
  }

  render() {
    const error = this.state.error;
    if (this.state.isRegistered) {
      return <Redirect to="/login" />;
    } 
    return (
      <div>
        {error && <p>{error.message}</p>}
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={(values, { setSubmitting }) => {
            fetch("http://localhost:9000/register", {
              method: "POST",
              headers: {"Content-Type": "application/x-www-form-urlencoded"},
              body: new URLSearchParams({
                "username": values.username,
                "password": values.password
              })
            })
            .then(response => {
              if (response.ok) {
                return response.json();
              }
              else {
                throw new Error("Invalid username/password");
              }
            })
            .then(data => {
              console.log(data);
              this.setState({ isRegistered: true });
            })
            .catch(error => {
              this.setState({ error })
            });
            setSubmitting(false);
          }}

          validationSchema={Yup.object().shape({
            username: Yup.string()
              .required("Username is required.")
              .min(3, "Minimum username length is 3.")
              .max(32, "Maximum username length is 32.")
              .matches(/^[a-zA-Z0-9_]+$/, "Username can only have characters, numbers or underscores."),
            password: Yup.string()
              .required("No password provided.")
              .min(8, "Password is too short - should be 8 chars minimum.")
              .matches(/(?=.*[0-9])/, "Password must contain a number.")
              .matches(/(?=.*[A-Z])/, "Password must contain a capital letter.")
          })}
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
                <label htmlFor="username">Username</label>
                <input
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.username && touched.username && "error"}
                />
                {errors.username && touched.username && (
                  <div className="input-feedback">{errors.username}</div>
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
                  Register
                </button>
              </form>
            );
          }}
        </Formik>
        <div>
          <Link className="Nav__link" to="/login">Already got an account? Login here!</Link>
        </div>
      </div>
    )
  }
}

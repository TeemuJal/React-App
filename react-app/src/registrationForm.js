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
          initialValues={{ email: "", password: "" }}
          onSubmit={(values, { setSubmitting }) => {
            fetch("http://localhost:9000/register", {
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
                throw new Error("Invalid email/password");
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
            email: Yup.string()
              .email()
              .required("Required"),
            password: Yup.string()
              .required("No password provided.")
              .min(8, "Password is too short - should be 8 chars minimum.")
              .matches(/(?=.*[0-9])/, "Password must contain a number.")
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

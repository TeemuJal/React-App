import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";

export default class NewPostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: JSON.parse(localStorage.getItem("userToken"))
    };
  }

  render() {
    return (
      <Formik
        initialValues={{ message: "" }}
        onSubmit={(values, { setSubmitting }) => {
          const token = this.state.token;
          const searchParams = new URLSearchParams({"secret_token": token});
          fetch(`http://localhost:9000/user/makePost?${searchParams.toString()}`, {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: new URLSearchParams({
              "message": values.message
            })
          })
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            else {
              throw new Error("Something went wrong.");
            }
          })
          .then(data => {
            console.log(data);
          })
          .catch(error => {
            console.log(error);
          });
          setSubmitting(false);
        }}

        validationSchema={Yup.object().shape({
          message: Yup.string()
            .required("The message is empty.")
            .max(255, "Maximum message length is 255 characters.")
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
              <br/>
              <textarea
                name="message"
                type="text"
                placeholder="Enter a message"
                rows="4" cols="50"
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.message && touched.message && "error"}
              /><br/><br/>
              {errors.message && touched.message && (
                <div className="input-feedback">{errors.message}</div>
              )}

              <button type="submit" disabled={isSubmitting}>
                Post
              </button>
            </form>
          );
        }}
      </Formik>
    )
  }
}

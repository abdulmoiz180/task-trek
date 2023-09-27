import React from "react";
import { useFormik } from "formik";
import { RegistrationSchema } from "../Schema/RegistrationSchema";
import HelpIcon from "@mui/icons-material/Help";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import "./registration.css";
import { Checkbox } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import Divider from "../../assets/images/Line 4.png";
const initialValues = {
  firstName: "",
  lastName: "",
  company: "",
  workEmail: "",
  employees: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
};

const Registration = () => {
  const inputs = [
    {
      id: 1,
      htmlFor: "firstName",
      name: "firstName",
      type: "text",
      placeholder: "John",
      label: "First name",
    },
    {
      id: 2,
      htmlFor: "lastName",
      name: "lastName",
      type: "text",
      placeholder: "Smith",
      label: "Last name",
      required: true,
    },
    {
      id: 3,
      htmlFor: "company",
      name: "Company",
      type: "text",
      placeholder: "John Smith",
      label: "Company name",
    },
    {
      id: 4,
      htmlFor: "email",
      name: "email",
      type: "email",
      placeholder: "test@example.com",
      label: "Work Email",
      required: true,
    },
    {
      id: 5,
      htmlFor: "password",
      name: "password",
      type: "password",
      placeholder: "Password",
      label: "Password",
    },
    {
      id: 6,
      htmlFor: "confirm_Password",
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm Password",
      label: "Confirm Password",
    },
  ];
  const { values, errors, handleBlur, touched, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: RegistrationSchema,
      onSubmit: (action) => {
        action.resetForm();
      },
    });
  return (
    <>
      <section className="container">
        <div className="form-container">
          <div className="head typography link">
            <a href="#" className="link">
              Already a member?
            </a>
            <PersonIcon />
          </div>

          <form onSubmit={handleSubmit} className="registration-form">
            <div className="heading">
              <h1 className="main-heading">Input your information</h1>
              <p className="info typography">
                We need you to help us with some basic information for your
                account creation. Here are our
                <span className="link"> terms and conditins</span>. Please read
                them carefully. We are GDRP compliant
              </p>
            </div>
            <div className="dotted-line">
              <img src={Divider} alt="" />
            </div>
            <div className="field-container">
              {inputs.map((input) => (
                <div key={input.id}>
                  <div className="label typography">
                    <label htmlFor={input.htmlFor}>{input.label}</label>
                    <HelpIcon className="icon" />
                  </div>
                  <div>
                    <TextField
                      className="field"
                      sx={{ width: "35ch" }}
                      type={input.type}
                      autoComplete="off"
                      name={input.name}
                      id={input.htmlFor}
                      placeholder={input.placeholder}
                      value={values[input.name]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {errors[input.name] && touched[input.name] ? (
                    <p className="error-message typography">
                      {errors[input.name]}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="dotted-line">
              <img src={Divider} alt="" />
            </div>
            <div>
              <div className="flex ">
                <p className="typography terms">
                  <Checkbox />I agree with
                  <span className="link"> terms and conditins.</span>
                </p>
                <Button
                  type="submit"
                  variant="contained"
                  className="button"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Register
                </Button>
              </div>
            </div>
          </form>
        </div>
        <div className="side"></div>
      </section>
    </>
  );
};

export default Registration;

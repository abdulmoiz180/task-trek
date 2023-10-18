import React, { useState } from "react";
import { useFormik } from "formik";

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { db } from '../../utils/constants/Firebase'; 
import { v4 as uuidv4 } from 'uuid';
import {
  collection,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { getUserIdByEmail } from '../../utils/constants/Firebase';
import { auth } from "../../utils/constants/Firebase";
import { RegistrationSchema } from "../../Schema/RegistrationSchema";
import HelpIcon from "@mui/icons-material/Help";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
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
  confirmPassword: ""
};

const Registration = () => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleCheckboxChange = (event) => {
    setAgreeTerms(event.target.checked);
    setErrMsg(""); 
  };

  const inputs = [
    {
      id: 1,
      htmlFor: "firstName",
      name: "firstName",
      type: "text",
      placeholder: "John",
      label: "First name"
    },
    {
      id: 2,
      htmlFor: "lastName",
      name: "lastName",
      type: "text",
      placeholder: "Smith",
      label: "Last name",
      required: true
    },
    {
      id: 3,
      htmlFor: "company",
      name: "Company",
      type: "text",
      placeholder: "John Smith",
      label: "Company name"
    },
    {
      id: 4,
      htmlFor: "email",
      name: "email",
      type: "email",
      placeholder: "test@example.com",
      label: "Work Email",
      required: true
    },
    {
      id: 5,
      htmlFor: "password",
      name: "password",
      type: "password",
      placeholder: "Password",
      label: "Password"
    },
    {
      id: 6,
      htmlFor: "confirm_Password",
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm Password",
      label: "Confirm Password"
    }
  ];
  const { values, errors, handleBlur, touched, handleChange, handleSubmit } =
  useFormik({
    initialValues,
    validationSchema: RegistrationSchema,
    onSubmit: async () => {
      if (!values.firstName || !values.email || !values.password) {
        setErrMsg('Fill all Fields');
        return;
      }
      
      if (!agreeTerms) {
        setErrMsg('Please agree to the terms and conditions.');
        return;
      }

      setErrMsg('');
      setSubmitButtonDisabled(true);

      try {
        const uniqueId = uuidv4();

        const userRef = doc(collection(db, 'users'), values.email);
        await setDoc(userRef, {
          firstName: values.firstName,
          uniqueId: uniqueId, 
        });

        const res = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );

        setSubmitButtonDisabled(false);

        const userId = await getUserIdByEmail(values.email);

        if (userId) {
          navigate(`/dashboard/${userId}`);
        } else {
          setErrMsg("User not found.");
        }

        console.log(res);
      } catch (err) {
        setSubmitButtonDisabled(false);
        setErrMsg(err.message);
        console.error(err);
      }
    },
  });

return (
  <>
    <section className="register-container">
      <div className="form-container">
        <div className="head reg-typography reg-link">
          <Link to="/" className="reg-link">
            Already a member?
          </Link>
          <PersonIcon />
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="heading">
            <h1 className="main-heading">Input your information</h1>
            <p className="reg-info reg-typography">
              We need you to help us with some basic information for your
              account creation. Here are our
              <span className="reg-link"> <Link className="LinkCls" to="/term-condition">terms and conditions</Link></span>. Please read
              them carefully. We are GDPR compliant
            </p>
          </div>
          <div className="dotted-line">
            <img src={Divider} alt="" />
          </div>
          <div className="field-container">
            {inputs.map((input) => (
              <div key={input.id}>
                <div className="label reg-typography">
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
                    <p className="error-message reg-typography">
                      {errors[input.name]}
                    </p>
                  ) : null}
                
              </div>
            ))}
          </div>
          <div className="dotted-line">
            <img src={Divider} alt="" />
          </div>
          <div className="flex">
            <p className="error-message">{errMsg}</p>
          </div>
          <div>
            <div className="flex">
              <p className="reg-typography terms">
                <Checkbox
                  checked={agreeTerms}
                  onChange={handleCheckboxChange}
                />
                I agree with
                <span className="reg-link"> <Link className="LinkCls" to="/term-condition">terms and conditions</Link> </span>
              </p>
              <Button
                type="submit"
                disabled={submitButtonDisabled || !agreeTerms}
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
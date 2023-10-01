import React from "react";
import classes from "./ForgetPassword.module.css";
import lineImage from "../../assets/images/Line 7.png";
import backgroundImg from "../../assets/images/Layer 7.png";
import questionImg from "../../assets/images/Vector.png";
import { useFormik } from "formik";
import { ForgetPasswordSchema } from '../../../src/Schema/ForgetPasswordScheme'
import { database } from "../../firebase/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const initialValues = {
  email: "",
};

const ForgetPassword = () => {

  const history = useNavigate();

  const { values, errors, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: ForgetPasswordSchema,
    onSubmit: async (e) => {
      // e.preventDefault();
      const emailValue = values.email;
      console.log(emailValue);
      sendPasswordResetEmail(database,emailValue).then(data=>{
          alert("please check your gmail")
          history('/');
      }).catch(error=>{
          alert(error.code);
      })
    },
  });


  return (
    <div className={classes.mainClass}>
      <div className={classes.leftSide}>
        <div className={classes.LeftfirstClass}>
          <div className={classes.leftMainClass}>
            <h2 className={classes.HeaderClass}>
              Forgot <br /> password?
            </h2>
            <p className={classes.paragraphClass}>
              Don’t worry we can help you out! if you still remember your email
              address you can quickly reset your password. Just input that
              information in the fields below and click on the button. This will
              send you a new email that will link you to the password change
              website.
            </p>
            <div className={classes.imgCls}>
              <img src={lineImage} />
            </div>

            <form onSubmit={handleSubmit}>
              <div>
                <div className={classes.labelClass}>
                  <label htmlFor="email">Email address</label> <br />
                  <img
                    className={classes.imgClass}
                    src={questionImg}
                    alt="this is image"
                  />
                </div>
                <input
                  className={classes.inputcls}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="john@smith.com"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {<p>{errors.email}</p>}
              </div>
              
              <div className={classes.imgCls}>
                <img src={lineImage} />
              </div>
              <button className={classes.btnform} type="submit">
                Request password change
              </button>
            </form>
            <div className={classes.footerCls}>
              <p>Do you need help?</p>
              <a href="#">Customer support</a>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.rightSide}>
        <img src={backgroundImg} alt="" />
      </div>
    </div>
  );
};

export default ForgetPassword;

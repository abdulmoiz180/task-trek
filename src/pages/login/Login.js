import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/constants/Firebase";
import { Col, Row, Typography } from "antd";
import { Checkbox } from "antd";
import {
  QuestionCircleFilled,
} from "@ant-design/icons";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Line from "../../assets/images/Line 7.png";
import { LoginSchema } from "../../Schema/LoginSchema";

function MouseOver(event) {
  event.target.style.color = "black";
}

function MouseOut(event) {
  event.target.style.color = "#4743E0";
}

const Login = () => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const { values, errors, handleBlur, touched, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: LoginSchema,
      onSubmit: (action) => {
        if (!values.email || !values.password) {
          setErrMsg("Fill all fields");
          return;
        }
        setErrMsg("");
        // login Authentication 
        setSubmitButtonDisabled(true);
        signInWithEmailAndPassword(auth, values.email, values.password)
          .then(async (res) => {
             setSubmitButtonDisabled(false);

             navigate("/dashboard");
             console.log(res);
          })
          .catch((err) => {
            console.error("Firebase authentication error:", err);
            setSubmitButtonDisabled(false);
            setErrMsg(err.message);
          });
      },
    });

  //  console.log(handleSubmit);

  return (
    <Row className="boxStyle">
      {/* 1st column */}
      <Col xs={24} sm={24} md={10} lg={8} xl={8}>
        <div className="column1">
          <div className="login-heading">
            <h1>Login</h1>
            <p>
              Please input your information in the fields below to enter you
              journey platform.
            </p>
          </div>
          <div className="">
            <img src={Line} alt="line" className="line" />
          </div>
          <form onSubmit={handleSubmit} className="form-area">
            <div className="inputs">
              <div className="account">
                <label>Account</label>
                <QuestionCircleFilled className="mark" />
              </div>
              {/* Email input */}
              <div className="formContainer">
                <input
                  htmlFor="email"
                  type="email"
                  name="email"
                  value={values.email}
                  id="emai"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Username"
                  className={errors.email && touched.email ? "input-error" : ""}
                />
                {errors.email && touched.email && (
                  <p className="error">{errors.email}</p>
                )}
              </div>
              <div className="formContainer">
                <input
                  htmlFor="password"
                  type="password"
                  name="password"
                  id="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="input password"
                  className={
                    errors.password && touched.password ? "input-error" : ""
                  }
                />
                {errors.password && touched.password && (
                  <p className="error">{errors.password}</p>
                )}
              </div>

              {/* Forgot password */}
              <div className="nav-area">
                <Typography
                  level={4}
                  onMouseOver={MouseOver}
                  onMouseOut={MouseOut}
                  onClick={() => {
                    navigate("/change-password");
                  }}
                  className="forgot-pwd"
                >
                  Forgot Your password?
                </Typography>
              </div>
            </div>
            <div className="">
              <img src={Line} alt="line" className="line" />
            </div>

            <div className="flex">
              <p className="error">{errMsg}</p>
            </div>
            {/* singin button */}
            <div className="btn-area">
              {/* remember me */}
              <Checkbox>Remember me</Checkbox>
              {/* signin button  */}
              <Button
                type="submit"
                disabled={submitButtonDisabled}
                variant="contained"
                className="btn"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
            </div>
          </form>

          <div className="footer-area">
            <Typography
              varient="body1"
              component="span"
              align="center"
              style={{ marginTop: "10px" }}
            >
              Don't have an account yet?
            </Typography>
            <Typography
              style={{
                color: "#4743E0",
                cursor: "pointer",
              }}
              align="center"
              onMouseOver={MouseOver}
              onMouseOut={MouseOut}
              onClick={() => {
                navigate("/register");
              }}
            >
              Register Here
            </Typography>
          </div>
        </div>
      </Col>
      {/* column2 */}
      <Col md={14} lg={16} xl={16} className="column2">
      </Col>
    </Row>
  );
};
export default Login;

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, getUserIdByEmail } from "../../utils/constants/Firebase";
import { Col, Row, Typography, Input } from "antd";
import { Checkbox } from "antd";
import {
  QuestionCircleFilled, UserOutlined, KeyOutlined
} from "@ant-design/icons";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Line from "../../assets/images/Line 7.png";
import { LoginSchema } from "../../Schema/LoginSchema";
import { useUserContext } from '../../contexts/SearchContext';
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

  const onChange = () =>{
    console.log("checked");
  }

  // Use the useUserContext hook to access the updateUser function
  const { updateUser } = useUserContext();

  const { values, errors, handleBlur, touched, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        email: '',
        password: "",
      },
      validationSchema: LoginSchema,
      onSubmit: async (values) => {

        if (!values.email || !values.password) {
          setErrMsg("Fill all fields");
        }

        setErrMsg("");
        setSubmitButtonDisabled(true);
 
        try {
          const res = await signInWithEmailAndPassword(auth, values.email, values.password);
          setSubmitButtonDisabled(false);

          const userId = await getUserIdByEmail(values.email);

          if (userId) {
            navigate(`/dashboard/project/${userId}`);
            // Update the user data in the context
            updateUser({
              displayName: res.user.displayName,
              email: res.user.email,
              photoURL: res.user.photoURL,
              // Add any other user-related data you need
            });

          } else {
            setErrMsg("User not found.");
          }

          console.log(res);
        } catch (err) {
          console.error("Firebase authentication error:", err);
          setSubmitButtonDisabled(false);
          setErrMsg(err.message);
        }
      },
    });

  return (
    <Row className="login-boxStyle">
      {/* 1st column */}
      <Col xs={24} sm={24} md={10} lg={8} xl={8} className="column1">
          <div className="login-heading">
            <h1>Login</h1>
            <p>
              Please input your information in the fields below to enter your journey platform.
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
              <Input 
                 htmlFor="email"
                 type="email"
                 name="email"
                 value={values.email}
                 id="email"
                 onChange={handleChange}
                 onBlur={handleBlur}
                 placeholder="Email Address"
                 className={errors.email && touched.email ? "input-error" : ""} 
                 size="large" 
                 prefix={<UserOutlined />} 
                 />
                {errors.email && touched.email && (
                  <p className="error">{errors.email}</p>
                )}
              </div>
              {/* password */}
              <div className="formContainer">
              <Input 
               htmlFor="password"
               type="password"
               name="password"
               id="password"
               value={values.password}
               onChange={handleChange}
               onBlur={handleBlur}
               placeholder="Password"
               className={
                 errors.password && touched.password ? "input-error" : ""
               }
              size="large"
              prefix={<KeyOutlined />}
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
                    navigate("/forget-password");
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
            {/* signin button */}
            <div className="btn-area">
              {/* remember me */}
              <div className="checked">
              <Checkbox onChange={onChange}>Remember Me</Checkbox>
              </div>
              {/* signin button  */}
              <div className="button-log">
              <Button
                type="submit"
                disabled={submitButtonDisabled}
                variant="contained"
                className="log-btn"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
              </div>
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
      </Col>
      {/* column2 */}
      <Col md={14} lg={16} xl={16} className="column2">
      </Col>
    </Row>
  );
};

export default Login;


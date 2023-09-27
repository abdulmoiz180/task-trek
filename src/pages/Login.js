import { Col, Row, Typography } from "antd";
import Line from "../assets/images/Line 7.png";
import { Checkbox, Form, Input } from "antd";
import {
  UserOutlined,
  KeyOutlined,
  QuestionCircleFilled,
} from "@ant-design/icons";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
// import bgimg from "../assets/images/Layer 11.png";
import { LoginSchema } from "./login/LoginSchema";


function MouseOver(event) {
  event.target.style.color = "black";
}

function MouseOut(event) {
  event.target.style.color = "#4743E0";
}

const Login = () => {
  // const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, actions) => {
      console.log(values);
      // console.log(actions);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      actions.resetForm();
    },
  });

  console.log(formik);


  return (
    <Row className="boxStyle">
      {/* 1st column */}
    <Col xs={24} sm={24} lg={8} xl={8}>
        <div className="column1">
          <div className="login-heading">
            <h1>Login</h1>
            <p>
              {" "}
              Please input your information in the fields below to enter you
              journey platform.
            </p>
          </div>
          <div className="">
            <img src={Line} alt="line" className="line" />
          </div>
          <Form
            onSubmit={formik.handleSubmit}
            autoComplete="off"
            className="form-area"
          >
            <div className="inputs">
            <div className="account">
              <label>Account</label>
              <QuestionCircleFilled className="mark" />
            </div>
              {/* Email input */}
            <div className="formContainer">
                <Input
                htmlfor="email"
                  name="email"
                  type="email"
                  size="large"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Username"
                  style={{ width: "100%",
                    height: "3rem"}}
                  prefix={<UserOutlined />}
                  className={
                    formik.errors.email && formik.touched.email
                      ? "input-error"
                      : ""
                  }
                />
                {formik.errors.email && formik.touched.email && (
                    <p className="error">{formik.errors.email}</p>
                  )}
        </div>
        <div className="formContainer">
                <Input
                htmlfor="password"
                name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  size="large"
                  placeholder="input password"
                  style={{ width: "100%",
                  height: "3rem"}}
                  prefix={<KeyOutlined />}
                  className={
                    formik.errors.password && formik.touched.password
                      ? "input-error"
                      : ""
                  }
                />
                 {formik.errors.password && formik.touched.password && (
                    <p className="error">{formik.errors.password}</p>
                  )}
            </div>

           
            {/* Forgot password */}
            <div className="nav-area">
              <Typography
                level={4}
                onMouseOver={MouseOver}
                onMouseOut={MouseOut}
                // onClick={() => {
                //   navigate("/reset-password");
                // }}
                className="forgot-pwd"
              >
                Forgot Your password?
              </Typography>
            </div>
            </div>
            <div className="">
              <img src={Line} alt="line" className="line" />
            </div>

            {/* singin button */}
            <div className="btn-area">
              {/* remember me */}
              <Form.Item name="remember" valuePropName="checked" 
              >
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              {/* signin button  */}
              <button type="submit" 
              className="btn">Login</button>
            
            </div>
          </Form>

          <div className="footer-area">
            <Typography
              varient="body1"
              component="span"
              align="center"
              style={{ marginTop: "10px" }}
            >
              Don't have an account yet?{" "}
            </Typography>
            <Typography
              style={{
                color: "#4743E0",
                cursor: "pointer",
              }}
              align="center"
              onMouseOver={MouseOver}
              onMouseOut={MouseOut}
                // onClick={() => {
                //   navigate("/register");
                // }}
            >
              Register Here
            </Typography>
          </div>
        </div>
      </Col>
      {/* column2 */}
      <Col lg={16} xl={16} className="column2">
        {/* <img src={bgimg} alt="column2 img" className="vactor-img" /> */}
      </Col>
    </Row>
  );
};
export default Login;

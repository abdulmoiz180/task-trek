import { Col, Row, Typography } from "antd";
import Line from "../assets/images/Line 7.png";
import { Button, Form, Input } from "antd";
import {
  UserOutlined,
  KeyOutlined,
  QuestionCircleFilled,
} from "@ant-design/icons";
import { useFormik } from "formik";
import bgimg from "../assets/images/Layer 8.png";
import { LoginSchema } from "../Schema/LoginSchema";
import { useNavigate } from "react-router-dom";


function MouseOver(event) {
  event.target.style.color = "black";
}

function MouseOut(event) {
  event.target.style.color = "#4743E0";
}

const ChangePassword = () => {
  // const [remember, setRemember] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
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

const navigate = useNavigate()
  return (
    <Row className="boxStyle">
      {/* 1st column */}
      <Col xs={24} sm={24} md={10} lg={8} xl={8}>
        <div className="column1">
          <div className="login-heading change">
            <h1>Change Password</h1>
            <p>
              Input your new desired password in the input fields below to create a new password.
              We strongly advise you to store it safely.
            </p>
          </div>
          <div className="">
            <img src={Line} alt="line" className="line" />
          </div>
          <Form
            onSubmit={formik.handleSubmit}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="form-area"
          >
            <div className="inputs">
              <div className="account">
                <label>New Password</label>
                <QuestionCircleFilled className="mark" />
              </div>
              {/* password input */}
              <div className="formContainer">
                <Input
                  htmlfor="password"
                  name="password"
                  type="password"
                  size="large"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="New Password"
                  style={{
                    width: "100%",
                    height: "3rem"
                  }}
                  prefix={<UserOutlined />}
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

              {/* new password input */}
              <div className="account">
                <label>Confirm New Password</label>
                <QuestionCircleFilled className="mark" />
              </div>
              <div className="formContainer">
                <Input
                  htmlfor="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  size="large"
                  placeholder="Confirm Password"
                  style={{
                    width: "100%",
                    height: "3rem"
                  }}
                  prefix={<KeyOutlined />}
                  className={
                    formik.errors.confirmPassword && formik.touched.confirmPassword
                      ? "input-error"
                      : ""
                  }
                />
                {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                  <p className="error">{formik.errors.confirmPassword}</p>
                )}
              </div>



            </div>
            <div className="">
              <img src={Line} alt="line" className="line" />
            </div>

            {/* singin button */}
            <div className="">
              <Button block type="submit" className="btn change-btn">Change Password</Button>


            </div>
          </Form>

          <div className="footer-area">
            <Typography
              varient="body1"
              component="span"
              align="center"
              style={{ marginTop: "10px" }}
            >
              Do you need any help?{" "}
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
              Customer Support
            </Typography>
          </div>
        </div>
      </Col>
      {/* column2 */}
      <Col md={14} lg={16} xl={16} className="column2">
        <img src={bgimg} alt="column2 img" className="vactor-img" />
      </Col>
    </Row>
  );
};
export default ChangePassword;

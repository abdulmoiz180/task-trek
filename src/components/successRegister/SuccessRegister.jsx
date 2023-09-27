import React, { useEffect, useState } from "react";
import "./successRegister.css";
import { Progress, Button, Typography } from "antd";
const { Title, Text } = Typography;
const SuccessRegister = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 60 ? 0 : prevProgress + 1
      );
    }, 600);

    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <section>
      <div className="container">
        <div className="col1 background"></div>
        <div className="col2">
          <Title className="title typography">Success</Title>
          <Text className="subtitle typography">
            We have succsefuly created your new account. But before you start
            you will have to activate it. We have sent an activation mail to the
            email you provided during registration. It should arrive in a couple
            of minutes
          </Text>
          <Progress
            className="progress"
            type="circle"
            format={(percent) => percent + "s"}
            strokeColor={"#4743e0"}
            percent={progress}
            size={40}
          />
        

          <Button type="primary" className="btn">
            Close
          </Button>
        </div>
        <div className="col3 background"></div>
      </div>
    </section>
  );
};

export default SuccessRegister;

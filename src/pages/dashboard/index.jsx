import { InfoCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Typography } from "antd";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./dashboard.css";
// import { Calendar } from "react-modern-calendar-datepicker";
const { Title } = Typography;

const Cascader = () => {
  // const options = [
  //   {
  //     value: "zhejiang",
  //     label: "Zhejiang"
  //   },
  //   {
  //     value: "Nabeel",
  //     label: "Nabeel"
  //   },
  //   {
  //     value: "Suleman",
  //     label: "Suleman"
  //   }
  // ];
  // const onChange = (value) => {
  //   console.log(value);
  // };
  // return (
  //   <>
  //     <Cascader
  //       options={options}
  //       onChange={onChange}
  //       placeholder="Please select"
  //     />
  //   </>
  // );
};

// const Calender = () => {
//   const [selectedDayRange, setSelectedDayRange] = useState({
//     from: null,
//     to: null
//   });
//   return (
//     <Calendar
//       value={selectedDayRange}
//       onChange={setSelectedDayRange}
//       shouldHighlightWeekends
//     />
//   );
// };
const Dashboard = () => {
  return (
    <section className="dashboard-container">
      {/* <div className="left-section">
        <div className="lineup-section">
          <div className="section-header">
            <Title>LineUp</Title>
            <InfoCircleOutlined />
          </div>
          <Button className="line-up-btn">
            <PlusOutlined /> Add Your most important tasks here.
          </Button>
        </div>

        <div className="work-container">
          <Title>My Work</Title>
          <Breadcrumb
            items={[
              {
                title: "To do"
              },
              {
                title: "Comments"
              },
              {
                title: "Done"
              }
            ]}
          />
        </div>
      </div>
      <div className="right-section">
      </div> */}

      <div className="temporary-msg-container">
        <Title className="temporary-msg">This Page is not done yet.</Title>
      </div>
    </section>
  );
};
PropTypes.shape({
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  day: PropTypes.number.isRequired
});
export default Dashboard;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registration from '../pages/registrationPage/Registration';
import SuccessEmail from '../pages/successEmail/SuccessEmail';
import SuccessRegister from '../pages/successRegister/SuccessRegister';
import ChangePassword from '../pages/changespassword/ChangePassword';
import Login from '../pages/login/Login';
import UserProfile from '../pages/userprofile';
import TaskPage from '../pages/taskpage/TaskPage';
import ForgetPassword from '../pages/forgetPassword/ForgetPassword';
import NotFound from '../components/NotFound';
import Dashboard from '../pages/dashboard';
import Project from '../pages/project/Project';
import LayoutSideBar from '../layout/LayoutSideBar';
import Member from '../pages/member/Member';


const Routers = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/tasks/:userId" element={<LayoutSideBar><TaskPage /></LayoutSideBar>} />
          <Route path="/dashboard/:userId" element={<LayoutSideBar><Dashboard /></LayoutSideBar>} />
          <Route path="/dashboard/project/:userId" element={<LayoutSideBar><Project /></LayoutSideBar>} />
          <Route path="/project/user-profile" element={<UserProfile />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/success-email" element={<SuccessEmail />} />
          <Route path="/success-register" element={<SuccessRegister />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/members" element={<Member />} />

        </Routes>
      </Router>
    </div>
  );
};

export default Routers;

// Routers.js

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
import TermAndCondition from '../pages/TermsAndConditons';
import Member from '../pages/member/Member';

const Routers = () => {

  return (
    <div>

      <Router>

        <Routes>
          <Route exact path="/:projectId/tasks" element={<LayoutSideBar currentPage="TaskPage"><TaskPage /></LayoutSideBar>} />
          <Route path="/members/:userId" element={<LayoutSideBar currentPage="Member" ><Member /></LayoutSideBar>} />
          <Route path="/dashboard/:userId" element={<LayoutSideBar currentPage="Dashboard"><Dashboard /></LayoutSideBar>} />
          <Route path="/dashboard/project/:userId" element={<LayoutSideBar currentPage="Project"><Project /></LayoutSideBar>} />
          <Route path="/project/user-profile" element={<UserProfile />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/success-email" element={<SuccessEmail />} />
          <Route path="/success-register" element={<SuccessRegister />} />
          <Route path="/term-condition" element={<TermAndCondition />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

      </Router>
    </div>
  );
};

export default Routers;




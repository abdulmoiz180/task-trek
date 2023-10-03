import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Project from '../pages/Project';
import Registration from '../pages/registrationPage/Registration';
import SuccessEmail from '../pages/successEmail/SuccessEmail';
import SuccessRegister from '../pages/successRegister/SuccessRegister';
import ChangePassword from '../pages/ChangePassword'
import Login from '../pages/login/Login';
import ForgetPassword from '../pages/forgetPassword/ForgetPassword';
const Routers = () => {
    return (
        <div>
            <Router>
                <Routes>


                    <Route exact path="/dashboard" element={<Project />} /> 
                    <Route exact path="/forget-password" element={<ForgetPassword />} /> 
                    <Route exact path="/change-password" element={<ChangePassword />} />
                    <Route exact path="/" element={<Login />} />
                    <Route exact path="/register" element={<Registration />} />
                    <Route exact path="/dashboard" element={<Project />} />
                    <Route exact path="/change-password" element={<ChangePassword />} />
                    <Route exact path="/success-email" element={<SuccessEmail />} />
                    <Route exact path="/success-register" element={<SuccessRegister />} />
                </Routes>
            </Router>
        </div>
    )
}

export default Routers
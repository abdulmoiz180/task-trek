import React from "react";
import Sidebar from "../pages/sidebar/Sidebar";
import AppHeader from "../layout/MenuBar";
import "./LayoutSideBar.css";
const LayoutSideBar = ({ children, currentPage }) => {
  return (
    <div className="app-container">
      <Sidebar />

      <div className="content">
        <AppHeader currentPage={currentPage} />
        {children}
      </div>
    </div>
  );
};

export default LayoutSideBar;

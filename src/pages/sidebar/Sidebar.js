import React, { useEffect, useState } from 'react';
import { Drawer, Menu, Button } from 'antd';
import {
  HomeOutlined,
  FileOutlined,
  AppstoreAddOutlined,
  ScheduleOutlined,
  TeamOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import logo from '../../assets/images/side-logo.png'; 
import sidebarStyles from '../../styles/sidebarStyles'; 

const Sidebar = ({ menuOpen, toggleMenu }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
   
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1025);
    };

    
    handleResize();
    window.addEventListener('resize', handleResize);

    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  
  if (isMobile) {
    return null;
  }

  return (
    <Drawer
      width={310}
      placement="left"
      visible={menuOpen}
      style={sidebarStyles.drawer}
    >
      <div style={sidebarStyles.logoContainer}>
        <img src={logo} alt="Logo" style={sidebarStyles.logo} />
        <div style={sidebarStyles.taglineContainer}>
          <div style={sidebarStyles.tagline}>Task Trek</div>
        </div>
        <MenuOutlined
          style={sidebarStyles.menuIcon}
          onClick={toggleMenu} 
        />
      </div>

      <Menu theme="light" className="custom-menu">
        <Menu.Item key="dashboard" icon={<HomeOutlined />}className="custom-menu-item">
          Dashboard
        </Menu.Item>
        <Menu.Item key="projects" icon={<FileOutlined />}className="custom-menu-item">
          Projects
        </Menu.Item>
        <Menu.Item key="modules" icon={<AppstoreAddOutlined />}className="custom-menu-item">
          Modules
        </Menu.Item>
        <Menu.Item key="sprints" icon={<ScheduleOutlined />}className="custom-menu-item">
          Sprints
        </Menu.Item>
        <Menu.Item key="members" icon={<TeamOutlined />}className="custom-menu-item">
          Members
        </Menu.Item>
        <Menu.Item key="reports" icon={<FileTextOutlined />}className="custom-menu-item">
          Reports
        </Menu.Item>
      </Menu>

      <div style={sidebarStyles.logoutButtonContainer}>
        <Button>
          <LogoutOutlined style={{ marginRight: '20px' }} />
          Logout
        </Button>
      </div>
    </Drawer>
  );
};

export default Sidebar;
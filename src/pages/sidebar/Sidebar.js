import logo from '../../assets/images/side-logo.png';
import React from 'react';
import './sidebar.css'
import { Layout, Menu, Button, theme } from 'antd';
import { UserOutlined, FileOutlined, LogoutOutlined, TeamOutlined } from '@ant-design/icons';
import './sidebar.css';
import { useNavigate, useParams } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../utils/constants/Firebase';

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const Sidebar = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const handleLogout = async () => {
    try {
      await signOut(auth);

      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const items = [
    getItem('Dashboard', 'sub1', <UserOutlined />, null, 'item'),
    {
      type: 'divider',
    },
    getItem('Projects', 'sub2', <FileOutlined />, null, 'item'),
    {
      type: 'divider',
    },
    getItem('Members', 'sub4', <TeamOutlined />, null, 'item'),


  ];

  const onClick = (e) => {
    console.log('click ', e);
  };

  return (
    <div className="side-bar">
      <div className="logo-container">
        <img src={logo} alt="logo" className="logo" />
      </div>
      <Menu
        onClick={onClick}
        style={{
          width: 256,
        }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        items={items}
        onSelect={({ key }) => {
          if (key === 'sub1') {
            navigate(`/dashboard/${userId}`);
          }
          if (key === 'sub2') {
            navigate(`/dashboard/project/${userId}`);
          }
          if (key === 'sub4') {
            navigate(`/members/${userId}`);
          }
        }}
      />
      <Button className="sidebar-btn" onClick={handleLogout}>

        <LogoutOutlined style={{ marginRight: '20px' }} />
        Logout
      </Button>
    </div>
  );
};

export default Sidebar;

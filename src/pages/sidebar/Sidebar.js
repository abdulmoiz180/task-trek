import React from 'react';
import { UserOutlined, FileOutlined, LogoutOutlined, TeamOutlined } from '@ant-design/icons';
import logo from '../../assets/images/side-logo.png';
import './sidebar.css'
import { Menu, Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';




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
  const navigate = useNavigate()
  const { userId } = useParams()
  const items = [
    getItem('Dashboard', 'sub1', <UserOutlined onClick={() => {
      navigate(`/dashboard/:${userId}`)
    }} />),
    {
      type: 'divider',
    },
    getItem('Prjects', 'sub2', <FileOutlined onClick={() => {
      navigate(`/dashboard/project/:${userId}`)
    }} />),
    {
      type: 'divider',
    },
    getItem('Members', 'sub4', <TeamOutlined />,
    ),
  ];

  const onClick = (e) => {
    console.log('click ', e);
  };
  return (<>
    <div className='side-bar'>
      <div className='logo-container'>
        <img src={logo} alt='logo' className='logo' />
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
      />
      <Button
        className='sidebar-btn'
      >
        <LogoutOutlined onClick={() => {
          navigate('/')
        }} style={{ marginRight: '20px' }} />
        Logout
      </Button>

    </div>
  );
};

export default Sidebar;


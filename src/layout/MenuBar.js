
import React from 'react';
import { Input, Space, Badge, Avatar, Dropdown, Menu } from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  MessageOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button } from 'antd'

// import { useSearch } from '../contexts/SearchContext'; // Import the useSearch hook
import { useMenuContext, useSearch } from '../contexts/SearchContext'; // Import the useSearch hook

import headerStyles from '../styles/headerStyles.js';


const MenuBar = ({ currentPage }) => {
  const { searchQuery, setSearch } = useSearch(); // Access the searchQuery and setSearch from the context


  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
  };
  return (
    <div style={headerStyles.container}>
      <div style={headerStyles.leftSection}>
        <h1 style={headerStyles.pageTitle}>{currentPage}</h1>
      </div>
      <div style={headerStyles.centerSection}>
        <Space>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search..."
            style={headerStyles.searchInput}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Space>
      </div>
      <div style={headerStyles.rightSection}>
        <Space size="large">
          <MessageOutlined style={headerStyles.icon} />
          <Badge dot>
            <BellOutlined style={headerStyles.icon} />
          </Badge>
          <SettingOutlined style={headerStyles.icon} />
          <Dropdown overlay={menu} trigger={['click']}>
            <Avatar icon={<UserOutlined />} style={headerStyles.avatar} />
          </Dropdown>
        </Space>
      </div>
    </div>
  );
};

// export default MenuBar;
const AdditionalMenu = () => {
  // Define your additional menu content here
  const{menuFilter , setMenuFilter } = useMenuContext();
  // const handleStatusFilterChange = (selectedStatus) => {
  //   setMenuFilter(selectedStatus);
  // };
  const handleStatusFilterChange = ({ key }) => {
    // console.log("Selected Status:", selectedStatus);
    setMenuFilter(key);
  };


  const additionalMenuContent = (
    <div style={headerStyles.AdditonalMenuStyleRow} >
      <div style={headerStyles.AdditonalMenuStyleButton}>   
        <Button
          type="primary" 
          style={headerStyles.ButtonStyle}>
          <PlusOutlined /> Add
        </Button>
      </div>
      <div style={headerStyles.AdditonalMenuStyleMain}>
        <Menu style={headerStyles.AdditonalMenuStyle} value={menuFilter} onClick={handleStatusFilterChange}>
          <Menu.Item key="All">All</Menu.Item>
          <Menu.Item key="Inactive">Inactive</Menu.Item>
          <Menu.Item key="OnHold">On Hold</Menu.Item>
          <Menu.Item key="Completed">Completed</Menu.Item>
          {/* Add more menu items as needed */}
        </Menu>
      </div>

    </div>

  );

  return (
    <div>
      {/* Render your additional menu content */}
      {additionalMenuContent}
    </div>
  );
};

const AppHeader = ({ currentPage }) => {
  return (
    <div>
      <MenuBar currentPage={currentPage} />
      <AdditionalMenu /> {/* Render the additional menu */}
    </div>
  );
};

export default AppHeader;

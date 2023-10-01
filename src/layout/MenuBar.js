
import React from 'react';
import { Input, Space, Badge, Avatar, Dropdown, Menu } from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  MessageOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import { useSearch } from '../contexts/SearchContext'; // Import the useSearch hook

import headerStyles from '../styles/headerStyles.js';

const MenuBar = ({ currentPage }) => {
  const { searchQuery, setSearch } = useSearch(); // Access the searchQuery and setSearch from the context

  const menu = (
    <Menu>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
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

export default MenuBar;

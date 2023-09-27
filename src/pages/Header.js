import React from 'react';
import { Input, Space, Badge, Avatar, Dropdown, Menu, Typography } from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  MessageOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import headerStyles from '../styles/headerStyles.js';

const { Text } = Typography;

const Header = ({ currentPage }) => {
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

export default Header;
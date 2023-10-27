import React, { useState, useEffect } from 'react';
import UserProfilePopup from '../pages/userprofile/index';
import { signOut } from 'firebase/auth';
import { auth, db } from '../utils/constants/Firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Space, Badge, Avatar, Menu, Dropdown, Modal } from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useSearch } from '../contexts/SearchContext';
import headerStyles from '../styles/headerStyles';
import Title from 'antd/es/typography/Title';

const MenuBar = ({ currentPage }) => {
  const { searchQuery, setSearch } = useSearch();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setLoggedIn(true);
      showWelcomeNotification();
    }
  }, []);
  useEffect(() => {
    async function fetchUserData() {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, 'users', user.email);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserData({ ...userData, email: user.email });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserData();
  }, []);

  const handleClick = () => {
    signOut(auth)
      .then(() => {
        navigate('/');
        console.log('User signed out successfully');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => setShowProfilePopup(true)}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleClick}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
  };
  const showWelcomeNotification = () => {
    setShowWelcomeModal(true);
  };
  return (
    <div style={headerStyles.container}>
      <div style={headerStyles.leftSection}>
        <Title style={headerStyles.userLink}>  {currentPage}</Title>
      </div>
      <div style={headerStyles.centerSection}>
        <Space>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search..."
            style={{ ...headerStyles.searchInput, width: '700px', height: '40px' }}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Space>
      </div>
      <div style={headerStyles.rightSection}>
        <Space size="large">
          <Badge dot>
            <BellOutlined style={headerStyles.icon} onClick={showWelcomeNotification} />
          </Badge>
          <Dropdown menu={menu} trigger={['click']}>
            <Avatar icon={<UserOutlined />} style={headerStyles.avatar} onClick={() => setLoggedIn(!loggedIn)} />
          </Dropdown>
        </Space>
      </div>
      {showProfilePopup && userData && (
        <UserProfilePopup userData={userData} onClose={() => setShowProfilePopup(false)} />
      )}
      {loggedIn && (
        <Modal
          title="Welcome to Task Trek!"
          open={showWelcomeModal}
          onOk={() => setShowWelcomeModal(false)}
          onCancel={() => setShowWelcomeModal(false)}
        >
          <p>You have successfully logged in. Enjoy your time with Task Trek!</p>
        </Modal>
      )}
    </div>
  );
};

export default MenuBar;
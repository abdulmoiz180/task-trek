import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../utils/constants/Firebase';
import { Card, Input, List, Avatar, Typography } from 'antd';
import './Member.css'; 
const { Search } = Input;

const Member = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');

        const querySnapshot = await getDocs(usersCollection);
        const userData = [];
        querySnapshot.forEach((doc) => {
          userData.push(doc.data());
        });
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching users: ', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, users]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const CustomAvatar = ({ user }) => {
    const initials = user.firstName.charAt(0).toUpperCase();

    return (
      <Avatar
        src={user.profileImage}
        alt={user.firstName}
        className="custom-avatar" 
      >
        {initials}
      </Avatar>
    );
  };

  return (
    <div>
      <h1>Members</h1>
      <Search
        placeholder="Search members..."
        onSearch={handleSearch}
        style={{ width: 200 }}
      />
      <List
        itemLayout="horizontal"
        dataSource={filteredUsers}
        renderItem={(user) => (
          <List.Item className="list-item"> {
            
          }
            <CustomAvatar user={user} />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <List.Item.Meta
                title={user.firstName}
                description={user.email}
              />
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Member;
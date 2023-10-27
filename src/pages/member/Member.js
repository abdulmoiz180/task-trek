import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../utils/constants/Firebase';
import { List, Avatar, Input, Card, Typography, Pagination, Alert } from 'antd';
import './Member.css';
import { UserOutlined } from '@ant-design/icons';



const { Search } = Input;

const Member = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('firstName');
  const [filterRole, setFilterRole] = useState('');
  const membersPerPage = 10;
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const querySnapshot = await getDocs(usersCollection);
        const userData = querySnapshot.docs.map((doc) => doc.data());
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching users: ', error);
      }
    };

    fetchUsers();
  }, []);
  const AlertMessage = () => {

    useEffect(() => {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 800);


      return () => {
        clearTimeout(timer);
      };
    })
    return (<>{visible ? <Alert className='alert-message' message="Loading..." type="success" /> : ""}</>);
  };
  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.firstName && user.firstName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, users]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const start = (currentPage - 1) * membersPerPage;
  const end = start + membersPerPage;
  const paginatedUsers = filteredUsers.slice(start, end);

  const sortedUsers = [...paginatedUsers].sort((a, b) => {
    return a[sortBy].localeCompare(b[sortBy]);
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (key) => {
    setSortBy(key);
  };

  const handleRoleFilter = (role) => {
    setFilterRole(role);
  };

  const filteredByRoleUsers = sortedUsers.filter((user) =>
    filterRole ? user.role === filterRole : true
  );


  return (
    <div className='members-container'>
      {/* <h1>Members</h1> */}
      <Search
        placeholder="Search members..."
        onSearch={handleSearch}
        className='members-search'
        style={{ width: 400 }}
      />
      {/* <div className="filter-buttons">
        <button onClick={() => handleRoleFilter('admin')}>Admin</button>
        <button onClick={() => handleRoleFilter('member')}>Member</button>
        <button onClick={() => handleRoleFilter('guest')}>Guest</button>
        <button onClick={() => handleRoleFilter('')}>Clear Filter</button>
      </div>
      <div className="sort-buttons">
        <button onClick={() => handleSort('firstName')}>Sort by Name</button>
        <button onClick={() => handleSort('email')}>Sort by Email</button>
      </div> */}
      <AlertMessage />
      <List
        itemLayout="vertical"
        dataSource={filteredByRoleUsers}
        renderItem={(user) => (
          <List.Item>
            <Card className='members-card'>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  size={50}
                  style={{
                    backgroundColor: '#125bc1',
                    color: 'white',
                    marginRight: 16,
                  }}
                >

                  <UserOutlined />

                </Avatar>
                <div className="user-details">
                  <Typography.Title level={4} className='members-name'>{user.firstName}</Typography.Title>
                  {/* <Typography.Text>{user.email}</Typography.Text> */}
                  {/*<Typography.Text>{user.role}</Typography.Text> */}
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
      <Pagination
        current={currentPage}
        onChange={handlePageChange}
        total={filteredByRoleUsers.length}
        pageSize={membersPerPage}
      />
    </div>
  );
};

export default Member;

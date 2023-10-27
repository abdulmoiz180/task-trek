import React from 'react';
import { Modal, Button } from 'antd';

const UserProfilePopup = ({ userData, onClose }) => {
  return (
    <Modal
      title="User Profile"
      visible={true}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
    >
      <p>
        Name: {userData.firstName} 
      </p>
      <p>Email: {userData.email}</p>
    </Modal>
  );
};

export default UserProfilePopup;

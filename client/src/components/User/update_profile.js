import React from 'react';
import UserLayout from '../../Hoc/user';
import UpdatePersonalNfo from './update_personal_info';

const UpdateProfile = () => {
  return (
    <UserLayout>
      <h1>Profile</h1>
      <UpdatePersonalNfo />
    </UserLayout>
  );
};

export default UpdateProfile;
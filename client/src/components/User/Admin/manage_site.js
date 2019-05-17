import React from 'react';
import UserLayout from '../../../Hoc/user';
import UpdateSiteInfo from './update_site_info';

const ManageSite = () => {
  return (
    <UserLayout>
      <UpdateSiteInfo />
    </UserLayout>
  );
};

export default ManageSite;
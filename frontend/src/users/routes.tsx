import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Placeholder components - to be implemented by the users module developer
const UsersOverview = React.lazy(() => import('./pages/UsersOverview'));
const ProfileSettings = React.lazy(() => import('./pages/ProfileSettings'));
const SecuritySettings = React.lazy(() => import('./pages/SecuritySettings'));
const TeamManagement = React.lazy(() => import('./pages/TeamManagement'));

const UsersRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<UsersOverview />} />
      <Route path="profile" element={<ProfileSettings />} />
      <Route path="security" element={<SecuritySettings />} />
      <Route path="team" element={<TeamManagement />} />
    </Routes>
  );
};

export default UsersRoutes;
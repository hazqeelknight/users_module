import React from 'react';
import { Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/core';
import { useProfile, useUpdateProfile } from '../hooks';
import { ProfileForm } from '../components';
import { LoadingSpinner } from '@/components/core';

const ProfileSettings: React.FC = () => {
  const { data: profile, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const handleSubmit = (data: any) => {
    updateProfileMutation.mutate(data);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  if (!profile) {
    return null;
  }

  return (
    <>
      <PageHeader
        title="Profile Settings"
        subtitle="Manage your personal information and preferences"
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent>
            <ProfileForm
              profile={profile}
              onSubmit={handleSubmit}
              isLoading={updateProfileMutation.isPending}
            />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default ProfileSettings;
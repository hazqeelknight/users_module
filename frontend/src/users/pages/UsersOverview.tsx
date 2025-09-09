import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  List,
  Divider,
} from '@mui/material';
import {
  People,
  Security,
  AdminPanelSettings,
  Timeline,
  Group,
  Shield,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/core';
import { useCurrentUser, useAuditLogs, useSessions, useMFADevices } from '../hooks';
import { AuditLogItem, MFAStatusIndicator, AccountStatusChip } from '../components';

const UsersOverview: React.FC = () => {
  const { user, roles, accountStatusColor, accountStatusLabel } = useCurrentUser();
  const { data: auditLogs } = useAuditLogs();
  const { data: sessions } = useSessions();
  const { data: mfaDevices } = useMFADevices();

  const stats = [
    {
      title: 'Account Status',
      value: accountStatusLabel,
      icon: People,
      color: accountStatusColor,
    },
    {
      title: 'Active Sessions',
      value: sessions?.filter(s => s.is_active).length || 0,
      icon: Timeline,
      color: 'primary.main',
    },
    {
      title: 'Roles Assigned',
      value: roles.length,
      icon: AdminPanelSettings,
      color: 'info.main',
    },
    {
      title: 'MFA Devices',
      value: mfaDevices?.length || 0,
      icon: Shield,
      color: user?.is_mfa_enabled ? 'success.main' : 'warning.main',
    },
  ];

  return (
    <>
      <PageHeader
        title="Users Overview"
        subtitle="Manage user accounts, roles, and security settings"
      />
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" gutterBottom variant="overline">
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        backgroundColor: stat.color,
                        borderRadius: 2,
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <stat.icon sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}

        {/* Current User Info */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Your Account
                </Typography>
                
                {user && (
                  <Box>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {user.profile?.display_name || user.full_name}
                      </Typography>
                      <AccountStatusChip status={user.account_status} size="small" />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {user.email}
                    </Typography>
                    
                    <Box mt={2}>
                      <MFAStatusIndicator
                        isEnabled={user.is_mfa_enabled}
                        deviceCount={mfaDevices?.length}
                      />
                    </Box>
                    
                    {roles.length > 0 && (
                      <Box mt={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          Your Roles
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                          {roles.map((role) => (
                            <Typography
                              key={role.id}
                              variant="caption"
                              sx={{
                                px: 1,
                                py: 0.5,
                                backgroundColor: 'primary.light',
                                color: 'primary.contrastText',
                                borderRadius: 1,
                              }}
                            >
                              {role.name}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                
                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {auditLogs?.results?.slice(0, 5).map((log, index) => (
                    <React.Fragment key={log.id}>
                      <AuditLogItem log={log} />
                      {index < 4 && <Divider />}
                    </React.Fragment>
                  )) || (
                    <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                      No recent activity
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box
                      component="a"
                      href="/users/profile"
                      sx={{
                        display: 'block',
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        textDecoration: 'none',
                        color: 'inherit',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <People sx={{ mb: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle2">Edit Profile</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Update your personal information
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box
                      component="a"
                      href="/users/security"
                      sx={{
                        display: 'block',
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        textDecoration: 'none',
                        color: 'inherit',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <Security sx={{ mb: 1, color: 'warning.main' }} />
                      <Typography variant="subtitle2">Security Settings</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Manage passwords and MFA
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box
                      component="a"
                      href="/users/team"
                      sx={{
                        display: 'block',
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        textDecoration: 'none',
                        color: 'inherit',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <Group sx={{ mb: 1, color: 'info.main' }} />
                      <Typography variant="subtitle2">Team Management</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Invite and manage team members
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box
                      component="a"
                      href="/users/audit-logs"
                      sx={{
                        display: 'block',
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        textDecoration: 'none',
                        color: 'inherit',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <Timeline sx={{ mb: 1, color: 'success.main' }} />
                      <Typography variant="subtitle2">Audit Logs</Typography>
                      <Typography variant="caption" color="text.secondary">
                        View your account activity
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </>
  );
};

export default UsersOverview;
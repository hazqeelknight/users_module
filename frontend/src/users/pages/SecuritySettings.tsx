import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Divider,
  List,
  Alert,
} from '@mui/material';
import { Security, Password, Shield, History } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { PageHeader, Button } from '@/components/core';
import {
  useCurrentUser,
  useChangePassword,
  useMFADevices,
  useSetupMFA,
  useVerifyMFASetup,
  useDisableMFA,
  useSessions,
  useRevokeAllSessions,
} from '../hooks';
import {
  MFAStatusIndicator,
  SessionCard,
  PasswordStrengthIndicator,
  QRCodeDisplay,
} from '../components';
import { ChangePasswordFormData, MFASetupFormData, MFAVerificationFormData } from '../types';

const SecuritySettings: React.FC = () => {
  const { user } = useCurrentUser();
  const { data: mfaDevices } = useMFADevices();
  const { data: sessions } = useSessions();
  const changePasswordMutation = useChangePassword();
  const setupMFAMutation = useSetupMFA();
  const verifyMFAMutation = useVerifyMFASetup();
  const disableMFAMutation = useDisableMFA();
  const revokeAllSessionsMutation = useRevokeAllSessions();

  const [mfaSetupData, setMFASetupData] = React.useState<any>(null);
  const [showMFASetup, setShowMFASetup] = React.useState(false);

  // Password change form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    watch: watchPassword,
    reset: resetPasswordForm,
  } = useForm<ChangePasswordFormData>();

  // MFA setup form
  const {
    register: registerMFA,
    handleSubmit: handleMFASubmit,
    formState: { errors: mfaErrors },
    reset: resetMFAForm,
  } = useForm<MFASetupFormData>();

  // MFA verification form
  const {
    register: registerVerification,
    handleSubmit: handleVerificationSubmit,
    formState: { errors: verificationErrors },
    reset: resetVerificationForm,
  } = useForm<MFAVerificationFormData>();

  const newPassword = watchPassword('new_password');

  const handleChangePassword = (data: ChangePasswordFormData) => {
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        resetPasswordForm();
      },
    });
  };

  const handleSetupMFA = (data: MFASetupFormData) => {
    setupMFAMutation.mutate(data, {
      onSuccess: (response) => {
        setMFASetupData(response);
        setShowMFASetup(true);
      },
    });
  };

  const handleVerifyMFA = (data: MFAVerificationFormData) => {
    verifyMFAMutation.mutate(data, {
      onSuccess: () => {
        setShowMFASetup(false);
        setMFASetupData(null);
        resetMFAForm();
        resetVerificationForm();
      },
    });
  };

  const handleDisableMFA = () => {
    const password = prompt('Enter your password to disable MFA:');
    if (password) {
      disableMFAMutation.mutate(password);
    }
  };

  const handleRevokeAllSessions = () => {
    if (confirm('Are you sure you want to revoke all other sessions? You will remain logged in on this device.')) {
      revokeAllSessionsMutation.mutate();
    }
  };

  return (
    <>
      <PageHeader
        title="Security Settings"
        subtitle="Manage your account security and authentication"
      />
      
      <Grid container spacing={3}>
        {/* Password Management */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Password color="primary" />
                  <Typography variant="h6">Change Password</Typography>
                </Box>
                
                <Box component="form" onSubmit={handlePasswordSubmit(handleChangePassword)}>
                  <TextField
                    {...registerPassword('old_password', {
                      required: 'Current password is required',
                    })}
                    fullWidth
                    type="password"
                    label="Current Password"
                    margin="normal"
                    error={!!passwordErrors.old_password}
                    helperText={passwordErrors.old_password?.message}
                  />
                  
                  <TextField
                    {...registerPassword('new_password', {
                      required: 'New password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                    })}
                    fullWidth
                    type="password"
                    label="New Password"
                    margin="normal"
                    error={!!passwordErrors.new_password}
                    helperText={passwordErrors.new_password?.message}
                  />
                  
                  {newPassword && (
                    <PasswordStrengthIndicator password={newPassword} />
                  )}
                  
                  <TextField
                    {...registerPassword('new_password_confirm', {
                      required: 'Please confirm your new password',
                      validate: (value) =>
                        value === newPassword || 'Passwords do not match',
                    })}
                    fullWidth
                    type="password"
                    label="Confirm New Password"
                    margin="normal"
                    error={!!passwordErrors.new_password_confirm}
                    helperText={passwordErrors.new_password_confirm?.message}
                  />
                  
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    loading={changePasswordMutation.isPending}
                    sx={{ mt: 2 }}
                  >
                    Change Password
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* MFA Management */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Shield color="primary" />
                  <Typography variant="h6">Multi-Factor Authentication</Typography>
                </Box>
                
                <MFAStatusIndicator
                  isEnabled={user?.is_mfa_enabled || false}
                  deviceCount={mfaDevices?.length}
                />
                
                <Divider sx={{ my: 2 }} />
                
                {!user?.is_mfa_enabled ? (
                  <Box>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      Enable MFA to add an extra layer of security to your account.
                    </Alert>
                    
                    {!showMFASetup ? (
                      <Box component="form" onSubmit={handleMFASubmit(handleSetupMFA)}>
                        <TextField
                          {...registerMFA('device_name', {
                            required: 'Device name is required',
                          })}
                          fullWidth
                          label="Device Name"
                          margin="normal"
                          placeholder="e.g., My Phone"
                          error={!!mfaErrors.device_name}
                          helperText={mfaErrors.device_name?.message}
                        />
                        
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          loading={setupMFAMutation.isPending}
                          sx={{ mt: 2 }}
                        >
                          Setup TOTP Authenticator
                        </Button>
                      </Box>
                    ) : (
                      <Box>
                        {mfaSetupData && (
                          <Box mb={3}>
                            <QRCodeDisplay
                              qrCodeDataUrl={mfaSetupData.qr_code}
                              manualEntryKey={mfaSetupData.manual_entry_key}
                            />
                          </Box>
                        )}
                        
                        <Box component="form" onSubmit={handleVerificationSubmit(handleVerifyMFA)}>
                          <TextField
                            {...registerVerification('otp_code', {
                              required: 'Verification code is required',
                              pattern: {
                                value: /^\d{6}$/,
                                message: 'Code must be 6 digits',
                              },
                            })}
                            fullWidth
                            label="Verification Code"
                            placeholder="000000"
                            error={!!verificationErrors.otp_code}
                            helperText={verificationErrors.otp_code?.message}
                          />
                          
                          <Box display="flex" gap={2} mt={2}>
                            <Button
                              type="submit"
                              variant="contained"
                              loading={verifyMFAMutation.isPending}
                            >
                              Verify & Enable MFA
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => {
                                setShowMFASetup(false);
                                setMFASetupData(null);
                              }}
                            >
                              Cancel
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box>
                    <Alert severity="success" sx={{ mb: 2 }}>
                      MFA is enabled and protecting your account.
                    </Alert>
                    
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleDisableMFA}
                      loading={disableMFAMutation.isPending}
                    >
                      Disable MFA
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Active Sessions */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justify="space-between" mb={3}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <History color="primary" />
                    <Typography variant="h6">Active Sessions</Typography>
                  </Box>
                  
                  {sessions && sessions.length > 1 && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleRevokeAllSessions}
                      loading={revokeAllSessionsMutation.isPending}
                    >
                      Revoke All Other Sessions
                    </Button>
                  )}
                </Box>
                
                <Grid container spacing={2}>
                  {sessions?.map((session) => (
                    <Grid item xs={12} md={6} key={session.id}>
                      <SessionCard session={session} />
                    </Grid>
                  )) || (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                        No active sessions found
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </>
  );
};

export default SecuritySettings;
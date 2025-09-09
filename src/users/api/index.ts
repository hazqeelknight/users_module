import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { queryKeys } from '@/api/queryClient';
import { toast } from 'react-toastify';
import type {
  User,
  Profile,
  Role,
  Permission,
  Invitation,
  AuditLog,
  UserSession,
  MFADevice,
  SAMLConfiguration,
  OIDCConfiguration,
  SSOSession,
  RegisterFormData,
  LoginFormData,
  ChangePasswordFormData,
  ForcedPasswordChangeFormData,
  PasswordResetRequestFormData,
  PasswordResetConfirmFormData,
  ProfileUpdateFormData,
  InvitationFormData,
  InvitationResponseFormData,
  MFASetupFormData,
  MFAVerificationFormData,
  SAMLConfigFormData,
  OIDCConfigFormData,
  SSOInitiateFormData,
  PaginatedResponse,
} from '../types';

// Authentication APIs
export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await api.post('/users/register/', data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Registration successful!');
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await api.post('/users/login/', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Welcome back!');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await api.post('/users/logout/');
    },
    onSuccess: () => {
      queryClient.clear();
      toast.success('Logged out successfully');
    },
  });
};

// Email Verification APIs
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: async (token: string) => {
      const response = await api.post('/users/verify-email/', { token });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Email verified successfully!');
    },
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post('/users/resend-verification/', { email });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });
};

// Password Management APIs
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordFormData) => {
      const response = await api.post('/users/change-password/', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
  });
};

export const useForcedPasswordChange = () => {
  return useMutation({
    mutationFn: async (data: ForcedPasswordChangeFormData) => {
      const response = await api.post('/users/force-password-change/', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully. Your account is now active.');
    },
  });
};

export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: async (data: PasswordResetRequestFormData) => {
      const response = await api.post('/users/request-password-reset/', data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });
};

export const useConfirmPasswordReset = () => {
  return useMutation({
    mutationFn: async (data: PasswordResetConfirmFormData) => {
      const response = await api.post('/users/confirm-password-reset/', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password reset successfully');
    },
  });
};

// Profile APIs
export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.users.profile(),
    queryFn: async () => {
      const response = await api.get<Profile>('/users/profile/');
      return response.data;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: ProfileUpdateFormData) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      const response = await api.patch('/users/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile() });
      toast.success('Profile updated successfully');
    },
  });
};

// Roles and Permissions APIs
export const useRoles = () => {
  return useQuery({
    queryKey: queryKeys.users.roles(),
    queryFn: async () => {
      const response = await api.get<Role[]>('/users/roles/');
      return response.data;
    },
  });
};

export const usePermissions = () => {
  return useQuery({
    queryKey: queryKeys.users.permissions(),
    queryFn: async () => {
      const response = await api.get<Permission[]>('/users/permissions/');
      return response.data;
    },
  });
};

// Invitations APIs
export const useInvitations = () => {
  return useQuery({
    queryKey: ['users', 'invitations'],
    queryFn: async () => {
      const response = await api.get<Invitation[]>('/users/invitations/');
      return response.data;
    },
  });
};

export const useSendInvitation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InvitationFormData) => {
      const response = await api.post('/users/invitations/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'invitations'] });
      toast.success('Invitation sent successfully');
    },
  });
};

export const useRespondToInvitation = () => {
  return useMutation({
    mutationFn: async (data: InvitationResponseFormData) => {
      const response = await api.post('/users/invitations/respond/', data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });
};

// Session Management APIs
export const useSessions = () => {
  return useQuery({
    queryKey: queryKeys.users.sessions(),
    queryFn: async () => {
      const response = await api.get<UserSession[]>('/users/sessions/');
      return response.data;
    },
  });
};

export const useRevokeSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await api.post(`/users/sessions/${sessionId}/revoke/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.sessions() });
      toast.success('Session revoked successfully');
    },
  });
};

export const useRevokeAllSessions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/users/sessions/revoke-all/');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.sessions() });
      toast.success('All other sessions revoked successfully');
    },
  });
};

// Audit Logs APIs
export const useAuditLogs = () => {
  return useQuery({
    queryKey: queryKeys.users.auditLogs(),
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<AuditLog>>('/users/audit-logs/');
      return response.data;
    },
  });
};

// MFA APIs
export const useMFADevices = () => {
  return useQuery({
    queryKey: ['users', 'mfa-devices'],
    queryFn: async () => {
      const response = await api.get<MFADevice[]>('/users/mfa/devices/');
      return response.data;
    },
  });
};

export const useSetupMFA = () => {
  return useMutation({
    mutationFn: async (data: MFASetupFormData) => {
      const response = await api.post('/users/mfa/setup/', data);
      return response.data;
    },
  });
};

export const useVerifyMFASetup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: MFAVerificationFormData) => {
      const response = await api.post('/users/mfa/verify/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'mfa-devices'] });
      toast.success('MFA enabled successfully');
    },
  });
};

export const useDisableMFA = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (password: string) => {
      const response = await api.post('/users/mfa/disable/', { password });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'mfa-devices'] });
      toast.success('MFA disabled successfully');
    },
  });
};

export const useRegenerateBackupCodes = () => {
  return useMutation({
    mutationFn: async (password: string) => {
      const response = await api.post('/users/mfa/backup-codes/regenerate/', { password });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Backup codes regenerated');
    },
  });
};

export const useResendSMSOTP = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/users/mfa/resend-sms/');
      return response.data;
    },
    onSuccess: () => {
      toast.success('SMS verification code sent');
    },
  });
};

export const useSendSMSMFACode = () => {
  return useMutation({
    mutationFn: async (deviceId: string) => {
      const response = await api.post('/users/mfa/send-sms-code/', { device_id: deviceId });
      return response.data;
    },
    onSuccess: () => {
      toast.success('SMS MFA code sent');
    },
  });
};

// SSO Configuration APIs (Admin only)
export const useSAMLConfigurations = () => {
  return useQuery({
    queryKey: ['users', 'saml-configs'],
    queryFn: async () => {
      const response = await api.get<SAMLConfiguration[]>('/users/sso/saml/');
      return response.data;
    },
  });
};

export const useCreateSAMLConfiguration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: SAMLConfigFormData) => {
      const response = await api.post('/users/sso/saml/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'saml-configs'] });
      toast.success('SAML configuration created successfully');
    },
  });
};

export const useUpdateSAMLConfiguration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SAMLConfigFormData> }) => {
      const response = await api.patch(`/users/sso/saml/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'saml-configs'] });
      toast.success('SAML configuration updated successfully');
    },
  });
};

export const useDeleteSAMLConfiguration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/sso/saml/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'saml-configs'] });
      toast.success('SAML configuration deleted successfully');
    },
  });
};

export const useOIDCConfigurations = () => {
  return useQuery({
    queryKey: ['users', 'oidc-configs'],
    queryFn: async () => {
      const response = await api.get<OIDCConfiguration[]>('/users/sso/oidc/');
      return response.data;
    },
  });
};

export const useCreateOIDCConfiguration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: OIDCConfigFormData) => {
      const response = await api.post('/users/sso/oidc/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'oidc-configs'] });
      toast.success('OIDC configuration created successfully');
    },
  });
};

export const useUpdateOIDCConfiguration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<OIDCConfigFormData> }) => {
      const response = await api.patch(`/users/sso/oidc/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'oidc-configs'] });
      toast.success('OIDC configuration updated successfully');
    },
  });
};

export const useDeleteOIDCConfiguration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/sso/oidc/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'oidc-configs'] });
      toast.success('OIDC configuration deleted successfully');
    },
  });
};

// SSO Session APIs
export const useSSOSessions = () => {
  return useQuery({
    queryKey: ['users', 'sso-sessions'],
    queryFn: async () => {
      const response = await api.get<{ sessions: SSOSession[] }>('/users/sso/sessions/');
      return response.data.sessions;
    },
  });
};

export const useRevokeSSOSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await api.post(`/users/sso/sessions/${sessionId}/revoke/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'sso-sessions'] });
      toast.success('SSO session revoked successfully');
    },
  });
};

export const useSSOLogout = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/users/sso/logout/');
      return response.data;
    },
    onSuccess: () => {
      toast.success('SSO logout initiated');
    },
  });
};

export const useSSODiscovery = () => {
  return useMutation({
    mutationFn: async (domain: string) => {
      const response = await api.get(`/users/sso/discovery/?domain=${domain}`);
      return response.data;
    },
  });
};

export const useInitiateSSO = () => {
  return useMutation({
    mutationFn: async (data: SSOInitiateFormData) => {
      const response = await api.post('/users/sso/initiate/', data);
      return response.data;
    },
    onSuccess: (data) => {
      // Redirect to SSO provider
      window.location.href = data.auth_url;
    },
  });
};
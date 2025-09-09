// Re-export all API hooks for convenience
export * from '../api';

// Custom hooks specific to users module
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { getAccountStatusColor, getAccountStatusLabel, getRoleTypeColor } from '../utils';

export const useCurrentUser = () => {
  const { user } = useAuthStore();
  
  return {
    user,
    isAuthenticated: !!user,
    accountStatus: user?.account_status,
    accountStatusColor: user ? getAccountStatusColor(user.account_status) : 'info',
    accountStatusLabel: user ? getAccountStatusLabel(user.account_status) : 'Unknown',
    roles: user?.roles || [],
    permissions: user?.roles?.flatMap(role => role.role_permissions) || [],
    hasRole: (roleName: string) => user?.roles?.some(role => role.name === roleName) || false,
    hasPermission: (permissionCode: string) => 
      user?.roles?.some(role => 
        role.role_permissions.some(permission => permission.codename === permissionCode)
      ) || false,
  };
};

export const useUserPermissions = () => {
  const { user } = useCurrentUser();
  
  const allPermissions = user?.roles?.flatMap(role => role.role_permissions) || [];
  const uniquePermissions = allPermissions.filter((permission, index, self) => 
    index === self.findIndex(p => p.id === permission.id)
  );
  
  return {
    permissions: uniquePermissions,
    hasPermission: (permissionCode: string) => 
      uniquePermissions.some(permission => permission.codename === permissionCode),
    canManageUsers: uniquePermissions.some(p => p.codename === 'can_edit_users'),
    canManageRoles: uniquePermissions.some(p => p.codename === 'can_manage_roles'),
    canViewAuditLogs: uniquePermissions.some(p => p.codename === 'can_view_audit_logs'),
    canManageSSO: uniquePermissions.some(p => p.codename === 'can_manage_sso'),
  };
};

export const useRoleHelpers = () => {
  return {
    getRoleTypeColor,
    getRoleDisplayName: (role: any) => role.name,
    getRoleDescription: (role: any) => role.description || 'No description available',
    isSystemRole: (role: any) => role.is_system_role,
  };
};
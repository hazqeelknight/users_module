import { validatePassword } from '@/utils/validators';

// Password validation specific to users module
export const validateUserPassword = (password: string) => {
  return validatePassword(password);
};

// Phone number formatting
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
};

// Account status helpers
export const getAccountStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' => {
  switch (status) {
    case 'active':
      return 'success';
    case 'pending_verification':
      return 'warning';
    case 'suspended':
    case 'password_expired':
      return 'error';
    case 'inactive':
    default:
      return 'info';
  }
};

export const getAccountStatusLabel = (status: string): string => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'inactive':
      return 'Inactive';
    case 'suspended':
      return 'Suspended';
    case 'pending_verification':
      return 'Pending Verification';
    case 'password_expired':
      return 'Password Expired';
    case 'password_expired_grace_period':
      return 'Password Expired (Grace Period)';
    default:
      return status;
  }
};

// Role type helpers
export const getRoleTypeColor = (roleType: string): 'primary' | 'secondary' | 'success' | 'warning' | 'error' => {
  switch (roleType) {
    case 'admin':
      return 'error';
    case 'organizer':
      return 'primary';
    case 'team_member':
      return 'secondary';
    case 'billing_manager':
      return 'warning';
    case 'viewer':
      return 'success';
    default:
      return 'secondary';
  }
};

// Device info parsing
export const parseDeviceInfo = (deviceInfo: Record<string, any>) => {
  return {
    browser: deviceInfo.browser || 'Unknown',
    os: deviceInfo.os || 'Unknown',
    device: deviceInfo.device || 'Unknown',
  };
};

// Time zone helpers
export const getTimezoneOptions = () => {
  return Intl.supportedValuesOf('timeZone').map(tz => ({
    value: tz,
    label: tz.replace(/_/g, ' '),
  }));
};

// Language options
export const getLanguageOptions = () => [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
];

// Date format options
export const getDateFormatOptions = () => [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  { value: 'MMM DD, YYYY', label: 'MMM DD, YYYY' },
  { value: 'DD MMM YYYY', label: 'DD MMM YYYY' },
];

// Time format options
export const getTimeFormatOptions = () => [
  { value: '12h', label: '12-hour (AM/PM)' },
  { value: '24h', label: '24-hour' },
];

// MFA device type helpers
export const getMFADeviceTypeIcon = (deviceType: string) => {
  switch (deviceType) {
    case 'totp':
      return 'smartphone';
    case 'sms':
      return 'sms';
    case 'backup':
      return 'backup';
    default:
      return 'security';
  }
};

// Generate QR code data URL
export const generateQRCodeDataURL = (text: string): Promise<string> => {
  return new Promise((resolve) => {
    // This would typically use a QR code library
    // For now, return a placeholder
    resolve(`data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="white"/><text x="100" y="100" text-anchor="middle" fill="black">QR Code</text></svg>`)}`);
  });
};

// Mask sensitive data
export const maskEmail = (email: string): string => {
  const [username, domain] = email.split('@');
  if (username.length <= 2) return email;
  
  const maskedUsername = username[0] + '*'.repeat(username.length - 2) + username[username.length - 1];
  return `${maskedUsername}@${domain}`;
};

export const maskPhoneNumber = (phone: string): string => {
  if (phone.length <= 4) return phone;
  return '*'.repeat(phone.length - 4) + phone.slice(-4);
};

// Validation helpers
export const isValidTimezone = (timezone: string): boolean => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
};

export const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};
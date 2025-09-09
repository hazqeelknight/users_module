import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { validateUserPassword } from '../../utils';

interface PasswordStrengthIndicatorProps {
  password: string;
  showDetails?: boolean;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showDetails = true,
}) => {
  const validation = validateUserPassword(password);
  
  const getStrengthScore = () => {
    if (!password) return 0;
    
    let score = 0;
    if (password.length >= 8) score += 20;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[a-z]/.test(password)) score += 20;
    if (/\d/.test(password)) score += 20;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;
    
    return score;
  };

  const getStrengthLabel = (score: number) => {
    if (score === 0) return 'No password';
    if (score <= 40) return 'Weak';
    if (score <= 60) return 'Fair';
    if (score <= 80) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = (score: number): 'error' | 'warning' | 'info' | 'success' => {
    if (score <= 40) return 'error';
    if (score <= 60) return 'warning';
    if (score <= 80) return 'info';
    return 'success';
  };

  const score = getStrengthScore();
  const label = getStrengthLabel(score);
  const color = getStrengthColor(score);

  if (!password) return null;

  return (
    <Box mt={1}>
      <Box display="flex" alignItems="center" gap={2} mb={1}>
        <LinearProgress
          variant="determinate"
          value={score}
          color={color}
          sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
        />
        <Typography variant="caption" color={`${color}.main`} fontWeight={500}>
          {label}
        </Typography>
      </Box>
      
      {showDetails && !validation.isValid && (
        <Box>
          {validation.errors.map((error, index) => (
            <Typography key={index} variant="caption" color="error" display="block">
              • {error}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};
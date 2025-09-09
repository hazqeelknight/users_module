import React from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
  Avatar,
  IconButton,
  Typography,
  Grid,
  Divider,
} from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/core';
import { Profile, ProfileUpdateFormData } from '../../types';
import {
  getTimezoneOptions,
  getLanguageOptions,
  getDateFormatOptions,
  getTimeFormatOptions,
  isValidHexColor,
} from '../../utils';

interface ProfileFormProps {
  profile: Profile;
  onSubmit: (data: ProfileUpdateFormData) => void;
  isLoading?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onSubmit,
  isLoading = false,
}) => {
  const [previewImage, setPreviewImage] = React.useState<string | null>(
    profile.profile_picture
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileUpdateFormData>({
    defaultValues: {
      display_name: profile.display_name,
      bio: profile.bio,
      profile_picture: null,
      phone: profile.phone,
      website: profile.website,
      company: profile.company,
      job_title: profile.job_title,
      timezone_name: profile.timezone_name,
      language: profile.language,
      date_format: profile.date_format,
      time_format: profile.time_format,
      brand_color: profile.brand_color,
      brand_logo: null,
      public_profile: profile.public_profile,
      show_phone: profile.show_phone,
      show_email: profile.show_email,
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('profile_picture', file, { shouldDirty: true });
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setValue('profile_picture', null, { shouldDirty: true });
    setPreviewImage(null);
  };

  const timezoneOptions = getTimezoneOptions();
  const languageOptions = getLanguageOptions();
  const dateFormatOptions = getDateFormatOptions();
  const timeFormatOptions = getTimeFormatOptions();

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={3}>
        {/* Profile Picture Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Profile Picture
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={previewImage || undefined}
              sx={{ width: 80, height: 80 }}
            >
              {profile.display_name?.[0] || 'U'}
            </Avatar>
            <Box>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="profile-picture-upload"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="profile-picture-upload">
                <IconButton color="primary" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
              {previewImage && (
                <IconButton color="error" onClick={handleRemoveImage}>
                  <Delete />
                </IconButton>
              )}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Basic Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="display_name"
            control={control}
            rules={{ required: 'Display name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Display Name"
                error={!!errors.display_name}
                helperText={errors.display_name?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Phone Number"
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Bio"
                multiline
                rows={3}
                error={!!errors.bio}
                helperText={errors.bio?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="website"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Website"
                type="url"
                error={!!errors.website}
                helperText={errors.website?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="company"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Company"
                error={!!errors.company}
                helperText={errors.company?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="job_title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Job Title"
                error={!!errors.job_title}
                helperText={errors.job_title?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Localization */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Localization
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="timezone_name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                select
                label="Timezone"
                error={!!errors.timezone_name}
                helperText={errors.timezone_name?.message}
              >
                {timezoneOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="language"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                select
                label="Language"
                error={!!errors.language}
                helperText={errors.language?.message}
              >
                {languageOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="date_format"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                select
                label="Date Format"
                error={!!errors.date_format}
                helperText={errors.date_format?.message}
              >
                {dateFormatOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="time_format"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                select
                label="Time Format"
                error={!!errors.time_format}
                helperText={errors.time_format?.message}
              >
                {timeFormatOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Branding */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Branding
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="brand_color"
            control={control}
            rules={{
              validate: (value) =>
                isValidHexColor(value) || 'Please enter a valid hex color',
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Brand Color"
                type="color"
                error={!!errors.brand_color}
                helperText={errors.brand_color?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Privacy Settings */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Privacy Settings
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="public_profile"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} checked={field.value} />}
                label="Make profile public"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="show_phone"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} checked={field.value} />}
                label="Show phone number"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="show_email"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} checked={field.value} />}
                label="Show email address"
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              loading={isLoading}
              disabled={!isDirty}
            >
              Save Changes
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
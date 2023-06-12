import * as Yup from 'yup';
import { useCallback } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// utils
import { fData } from '../../../../utils/formatNumber';
// assets
import { countries } from '../../../../assets/data';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from '../../../../components/hook-form';
import { staticFilePath } from '../../../../components/file-thumbnail/utils';
import axios from '../../../../utils/axios';

// ----------------------------------------------------------------------

const ROLE_OPTIONS = [
  'ux designer',
  'full stack designer',
  'backend developer',
  'project manager',
  'leader',
  'ui designer',
  'ui/ux designer',
  'front end developer',
  'full stack developer',
];

type FormValuesProps = {
  username: string;
  name: string;
  gender: boolean;
  company: string;
  image: File | string | null;
  phone: string | null;
  country: string | null;
  address: string | null;
  about: string | null;
  role: string | null;
  isPublic: boolean;
};

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const UpdateUserSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    name: Yup.string().required('Name is required'),
    image: Yup.mixed().required('Avatar is required'),
    phone: Yup.string().required('Phone number is required'),
    country: Yup.string().required('Country is required'),
    address: Yup.string().required('Address is required'),
    gender: Yup.boolean().required('Gender is required'),
    role: Yup.string().required('Role is required'),
  });

  const defaultValues = {
    image: staticFilePath(user?.image) || null,
    phone: user?.phone || '',
    country: user?.country || '',
    address: user?.address || '',
    about: user?.about || '',
    isPublic: user?.isPublic,
    name: user?.name || '',
    username: user?.username || '',
    gender: user?.gender || true,
    company: user?.company || '',
    role: user?.role || '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    const formData = new FormData();

    const { ...rest } = data;

    const restKeys = Object.keys(rest);
    const restValues = Object.values(rest);

    restKeys.forEach((key, i) => {
      const value: any = restValues[i];
      if (value instanceof File) {
        formData.append(key, value as Blob);
      } else if (value instanceof Array) {
        value.forEach((item) => {
          formData.append(`${key}[]`, item);
        });
      } else {
        formData.append(key, value as string);
      }
    });

    try {
      await axios({
        method: 'patch',
        url: 'api/users/',
        data: formData,
      }).then(() => {
        enqueueSnackbar('Update success!');
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('image', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="image"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />

            <RHFSwitch
              name="isPublic"
              labelPlacement="start"
              label="Public Profile"
              sx={{ mt: 5 }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="username" label="Nickname" />

              <RHFTextField name="name" label="Actial name" />

              <RHFTextField name="phone" label="Phone Number" />

              <RHFTextField name="address" label="Address" />

              <RHFSelect native name="country" label="Country" placeholder="Country">
                <option value="" />
                {countries.map((country) => (
                  <option key={country.code} value={country.label}>
                    {country.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect native name="gender" label="Sex" placeholder="Sex">
                <option value="" />
                <option key="Male" value="true">
                  Male
                </option>
                <option key="Female" value="false">
                  Female
                </option>
              </RHFSelect>

              <RHFTextField name="company" label="Company" />

              <RHFSelect native name="role" label="Role" placeholder="role">
                <option value="" />
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </RHFSelect>
            </Box>
            {/* <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
            </Stack> */}

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="about" multiline rows={4} label="About" />

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

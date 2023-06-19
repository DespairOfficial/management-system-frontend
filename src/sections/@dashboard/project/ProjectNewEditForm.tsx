import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  InputAdornment,
  Button,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { IProject, IProjectStatus } from '../../../@types/project';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
} from '../../../components/hook-form';
import axiosInstance from '../../../utils/axios';
import { IUser } from '../../../@types/user';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const TAGS_OPTION = ['Industry', 'E-commerce', 'Food', 'Marketplace', 'Gamble'];

// ----------------------------------------------------------------------

interface FormValuesProps {
  userId: string;
  image: File | null | string;
  name: string;
  description: string;
  budget: number;
  status: IProjectStatus;
  startsAt: Date | string | null;
  participants: IUser[];
  creator: IUser | null;
  uninvited: IUser[];

  tags: string[];
}

type Props = {
  isEdit?: boolean;
  currentProject?: IProject;
};

export default function ProjectNewEditForm({ isEdit, currentProject }: Props) {
  const CURRENT_USER_ID = localStorage.getItem('userId');

  const STATUS_OPTIONS = [
    { value: 'in_progress', label: 'In progress' },
    { value: 'closing', label: 'Closing' },
    { value: 'closed', label: 'Closed' },
  ];

  const [usersToInviteOptions, setUsersToInviteOptions] = useState<IUser[]>([]);

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewProjectSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    price: Yup.number().moreThan(0, 'Price should not be $0.00'),
    description: Yup.string().required('Description is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProject?.name || '',
      description: currentProject?.description || '',
      budget: currentProject?.budget || 0,
      status: currentProject?.status || 'closed',
      tags: [],
      image: currentProject?.image || null,
      startsAt: currentProject?.startsAt || null,
      participants: currentProject?.participants || [],
      creator: currentProject?.creator || null,
      uninvited: [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProject]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewProjectSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSendInvitations = () => {
    const sendInvitationToUser = (userId: string) => {
      if (currentProject && currentProject.userId === CURRENT_USER_ID) {
        const sendInvitation = async () => {
          await axiosInstance.post(`api/project/invitation`, {
            userId,
            projectId: currentProject.id,
          });
        };
        sendInvitation();
      }
    };

    values.uninvited.forEach((user) => {
      sendInvitationToUser(user.id);
    });

    setUsersToInviteOptions(
      usersToInviteOptions.filter((item) => !values.uninvited.includes(item))
    );
    enqueueSnackbar('Invitations was sent!');
  };
  useEffect(() => {
    if (isEdit && currentProject && currentProject.userId === CURRENT_USER_ID) {
      const getUsersToInvite = async () => {
        const response = await axiosInstance.get(
          `api/project/notInvitedUsers/${currentProject.id}`
        );
        setUsersToInviteOptions(response.data);
      };
      getUsersToInvite();
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProject]);

  const onSubmit = async (data: FormValuesProps) => {
    const formData = new FormData();

    const { participants, tags, creator, ...rest } = data;

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
      } else if (value instanceof Date) {
        console.log(value);

        formData.append(key, value.toISOString());
      } else {
        formData.append(key, value as string);
      }
    });

    try {
      const response = await axiosInstance({
        method: isEdit ? 'patch' : 'post',
        url: isEdit ? `api/project/${currentProject?.id}` : 'api/project/',
        data: formData,
      });
      if (response.status === 201) {
        enqueueSnackbar('Create success!');
      } else if (response.status === 200) {
        enqueueSnackbar('Update success!');
      } else {
        enqueueSnackbar('Error during creating', { variant: 'error' });
      }
      navigate(PATH_DASHBOARD.project.list);
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

  const handleRemoveFile = () => {
    setValue('image', null);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="name" label="Project Name" />

              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Description
                </Typography>

                <RHFEditor simple name="description" />
              </Stack>

              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Image
                </Typography>

                <RHFUpload
                  thumbnail
                  name="image"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemoveFile}
                  onUpload={() => console.log('ON UPLOAD')}
                />
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mt={2}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Status
                  </Typography>

                  <RHFRadioGroup row spacing={4} name="status" options={STATUS_OPTIONS} />
                </Stack>

                {/* <RHFTextField name="startsAt" label="startsAt" type="date" placeholder="0.00" /> */}

                <DatePicker
                  label="Start date"
                  value={values.startsAt ?? ''}
                  onChange={(value) => {
                    setValue('startsAt', value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      sx={{
                        maxWidth: { md: 160 },
                      }}
                    />
                  )}
                />
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={2}>
                <RHFAutocomplete
                  name="tags"
                  label="Tags"
                  multiple
                  freeSolo
                  options={TAGS_OPTION.map((option) => option)}
                  ChipProps={{ size: 'small' }}
                />

                <RHFTextField
                  name="budget"
                  label="Budget"
                  placeholder="0.00"
                  onChange={(event) =>
                    setValue('budget', Number(event.target.value), { shouldValidate: true })
                  }
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          $
                        </Box>
                      </InputAdornment>
                    ),
                    type: 'number',
                  }}
                />
              </Stack>
            </Card>

            {isEdit && currentProject && currentProject.userId === CURRENT_USER_ID && (
              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            )}
            {!isEdit && (
              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                Create Project
              </LoadingButton>
            )}
          </Stack>
          {isEdit && currentProject && currentProject.userId === CURRENT_USER_ID && (
            <Card sx={{ p: 3, mt: 2 }}>
              <Stack spacing={3} mb={2}>
                <RHFAutocomplete
                  name="uninvited"
                  label="Invite"
                  multiple
                  options={usersToInviteOptions}
                  getOptionLabel={(user) =>
                    user && typeof user === 'object' ? `${user.username} - ${user.name}` : ''
                  }
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  ChipProps={{ size: 'small' }}
                />
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  onClick={() => {
                    onSendInvitations();
                  }}
                >
                  Send invitations
                </Button>
              </Stack>
            </Card>
          )}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

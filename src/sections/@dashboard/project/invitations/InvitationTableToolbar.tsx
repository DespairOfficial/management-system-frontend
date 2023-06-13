// @mui
import { Stack, InputAdornment, TextField, MenuItem, Button } from '@mui/material';
import { IProject } from '../../../../@types/project';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

type Props = {
  filterRole: string;
  isFiltered: boolean;
  projectOptions: IProject[];
  onResetFilter: VoidFunction;
  onFilterRole: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function InvitationTableToolbar({
  isFiltered,
  filterRole,
  projectOptions,
  onFilterRole,
  onResetFilter,
}: Props) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'column',
        sm: 'row',
      }}
      sx={{ px: 2.5, py: 3 }}
    >
      <TextField
        fullWidth
        select
        label="Role"
        value={filterRole}
        onChange={onFilterRole}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                maxHeight: 260,
              },
            },
          },
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
      >
        {projectOptions.map((option) => (
          <MenuItem
            key={option.id}
            value={option.name}
            sx={{
              mx: 1,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option.name}
          </MenuItem>
        ))}
      </TextField>

      {isFiltered && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          onClick={onResetFilter}
          startIcon={<Iconify icon="eva:trash-2-outline" />}
        >
          Clear
        </Button>
      )}
    </Stack>
  );
}

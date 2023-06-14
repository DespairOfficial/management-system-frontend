import { useState } from 'react';
// @mui
import {
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';
// @types
import { IUserAccountGeneral } from '../../../../@types/user';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import { staticFilePath } from '../../../../components/file-thumbnail';

// ----------------------------------------------------------------------

type Props = {
  row: IUserAccountGeneral;
  selected: boolean;
  onSelectRow: VoidFunction;
  onAddToContactsRow: VoidFunction;
  // onEditRow: VoidFunction;
  // onDeleteRow: VoidFunction;
};

export default function UserTableRow({
  row,
  selected,
  onSelectRow,
  onAddToContactsRow,
}: // onEditRow,
// onDeleteRow,
Props) {
  console.log(row);

  const { name, image, company, role, isVerified, status } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={staticFilePath(image)} />

            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">{company}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {role}
        </TableCell>

        <TableCell align="center">
          <Iconify
            icon={isVerified ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
            sx={{
              width: 20,
              height: 20,
              color: 'success.main',
              ...(!isVerified && { color: 'warning.main' }),
            }}
          />
        </TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={(status === 'online' && 'success') || 'error'}
            sx={{ textTransform: 'capitalize' }}
          >
            {status}
          </Label>
        </TableCell>

        <TableCell align="left">
          {row.isContact ? (
            <Label variant="soft" color="success" sx={{ textTransform: 'capitalize' }}>
              In contacts
            </Label>
          ) : (
            <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          )}
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onAddToContactsRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:person-add-outline" />
          To contacts
        </MenuItem>
      </MenuPopover>
    </>
  );
}

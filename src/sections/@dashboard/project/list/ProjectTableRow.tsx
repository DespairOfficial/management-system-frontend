import { useState } from 'react';
import { sentenceCase } from 'change-case';
// @mui
import {
  Link,
  Stack,
  Button,
  TableRow,
  Checkbox,
  MenuItem,
  TableCell,
  IconButton,
  Avatar,
  AvatarGroup,
} from '@mui/material';

// components
import Label from '../../../../components/label';
import Image from '../../../../components/image';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';
import { IProject } from '../../../../@types/project';
import { staticFilePath } from '../../../../components/file-thumbnail';

// ----------------------------------------------------------------------

type Props = {
  row: IProject;
  selected: boolean;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function ProjectTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}: Props) {
  const CURRENT_USER_ID = localStorage.getItem('userId');
  const { name, creator, status, participants } = row;

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
          {CURRENT_USER_ID === row.userId && <Checkbox checked={selected} onClick={onSelectRow} />}
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Image
              disabledEffect
              visibleByDefault
              alt={name}
              src={staticFilePath(row.image)}
              sx={{ borderRadius: 1.5, width: 48, height: 48 }}
            />

            <Link
              noWrap
              color="inherit"
              variant="subtitle2"
              onClick={onViewRow}
              sx={{ cursor: 'pointer' }}
            >
              {name}
            </Link>
          </Stack>
        </TableCell>

        <TableCell>{creator?.name}</TableCell>

        <TableCell align="center">
          <Label
            variant="soft"
            color={
              (status === 'closed' && 'error') || (status === 'closing' && 'warning') || 'success'
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {status ? sentenceCase(status) : ''}
          </Label>
        </TableCell>

        <TableCell align="center">
          <AvatarGroup
            max={4}
            sx={{
              '& .MuiAvatarGroup-avatar': {
                width: 24,
                height: 24,
                '&:first-of-type': {
                  fontSize: 12,
                },
              },
            }}
          >
            {participants &&
              participants.map((person) => (
                <Avatar key={person.id} alt={person.name} src={staticFilePath(person.image)} />
              ))}
          </AvatarGroup>
        </TableCell>

        <TableCell align="right">
          {CURRENT_USER_ID === row.userId && (
            <IconButton color={openPopover ? 'primary' : 'default'} onClick={handleOpenPopover}>
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
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

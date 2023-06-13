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
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import { staticFilePath } from '../../../../components/file-thumbnail';
import { IProjectInvitation } from '../../../../@types/project';

// ----------------------------------------------------------------------

type Props = {
  row: IProjectInvitation;
  selected: boolean;
  onSelectRow: VoidFunction;
  onAddToContactsRow: VoidFunction;
  // onEditRow: VoidFunction;
  // onDeleteRow: VoidFunction;
};

export default function InvitationTableRow({
  row,
  selected,
  onSelectRow,
  onAddToContactsRow,
}: // onEditRow,
// onDeleteRow,
Props) {
  const { createdAt, projectId, userId, project } = row;

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

        <TableCell align="left">{project.id}</TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={project.name} src={staticFilePath(project.image)} />

            <Typography variant="subtitle2" noWrap>
              {project.name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">{createdAt}</TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {/* <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem> */}

        {/* <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem> */}
        <MenuItem
          onClick={() => {
            onAddToContactsRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:person-add-outline" />
          Accept
        </MenuItem>
      </MenuPopover>

      {/* <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      /> */}
    </>
  );
}

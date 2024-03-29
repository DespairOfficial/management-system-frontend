import { useEffect, useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Typography, ListItemText, ListItemAvatar, MenuItem } from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
// _mock_
import { _contacts } from '../../../_mock/arrays';
// components
import { CustomAvatar } from '../../../components/custom-avatar';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import MenuPopover from '../../../components/menu-popover';
import BadgeStatus from '../../../components/badge-status';
import { IconButtonAnimate } from '../../../components/animate';
import { staticFilePath } from '../../../components/file-thumbnail/utils';
import axios from '../../../utils/axios';
import { IUser } from '../../../@types/user';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64;

export default function ContactsPopover() {
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const [contacts, setContacts] = useState<IUser[]>([]);

  useEffect(() => {
    const getContacts = async () => {
      const response = await axios.get('api/contacts');
      setContacts(response.data);
    };
    getContacts();
  }, []);

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <IconButtonAnimate
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={{
          width: 40,
          height: 40,
          ...(openPopover && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
          }),
        }}
      >
        <Iconify icon="eva:people-fill" />
      </IconButtonAnimate>

      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 320 }}>
        <Typography variant="h6" sx={{ p: 1.5 }}>
          Contacts <Typography component="span">({contacts.length})</Typography>
        </Typography>

        <Scrollbar sx={{ height: ITEM_HEIGHT * 6 }}>
          {contacts.map((contact) => (
            <MenuItem key={contact.id} sx={{ height: ITEM_HEIGHT }}>
              <ListItemAvatar>
                <CustomAvatar
                  src={staticFilePath(contact.image)}
                  BadgeProps={{
                    badgeContent: <BadgeStatus status={contact.status} />,
                  }}
                />
              </ListItemAvatar>

              <ListItemText
                primary={contact.name}
                secondary={contact.status === 'offline' ? fToNow(contact.lastActivity) : ''}
                primaryTypographyProps={{ typography: 'subtitle2', sx: { mb: 0.25 } }}
                secondaryTypographyProps={{ typography: 'caption' }}
              />
            </MenuItem>
          ))}
        </Scrollbar>
      </MenuPopover>
    </>
  );
}

import { useEffect, useState } from 'react';
// @mui
import {
  Box,
  Avatar,
  Dialog,
  Button,
  ListItem,
  TextField,
  Typography,
  ListItemText,
  ListItemAvatar,
  InputAdornment,
  DialogTitle,
  DialogContent,
} from '@mui/material';
// _mock_
import { _contacts } from '../../../_mock/arrays';
// @types
import { IKanbanAssignee, IKanbanCard } from '../../../@types/kanban';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import SearchNotFound from '../../../components/search-not-found';
import axios from '../../../utils/axios';
import { IUser } from '../../../@types/user';
import { staticFilePath } from '../../../components/file-thumbnail';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64;

type Props = {
  assignee?: IKanbanAssignee[];
  onAddAssignee?: (assignee: IKanbanAssignee) => void;
  onRemoveAssignee?: (assignee: IKanbanAssignee) => void;
  open: boolean;
  onClose: VoidFunction;
};

export default function KanbanContactsDialog({
  assignee = [],
  open,
  onClose,
  onAddAssignee,
  onRemoveAssignee,
}: Props) {
	
  const [searchContacts, setSearchContacts] = useState('');

  const [contacts, setContacts] = useState<IUser[]>([]);

  useEffect(() => {
    const getContacts = async () => {
      const response = await axios.get('api/contacts');
      setContacts(response.data);
    };
    getContacts();
  }, []);

  const handleSearchContacts = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchContacts(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: contacts,
    query: searchContacts,
  });

  const isNotFound = !dataFiltered.length && !!searchContacts;

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 0 }}>
        Contacts <Typography component="span">({contacts.length})</Typography>
      </DialogTitle>

      <Box sx={{ px: 3, py: 2.5 }}>
        <TextField
          fullWidth
          value={searchContacts}
          onChange={handleSearchContacts}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {isNotFound ? (
          <SearchNotFound query={searchContacts} sx={{ mt: 3, mb: 10 }} />
        ) : (
          <Scrollbar
            sx={{
              px: 2.5,
              height: ITEM_HEIGHT * 6,
            }}
          >
            {dataFiltered.map((contact) => {
              const checked = assignee.map((person) => person.name).includes(contact.name);

              return (
                <ListItem
                  key={contact.id}
                  disableGutters
                  secondaryAction={
                    <Button
                      size="small"
                      onClick={() => {
                        if (checked && onRemoveAssignee) {
                          onRemoveAssignee(contact);
                        } else if (onAddAssignee) {
                          onAddAssignee(contact);
                        }
                      }}
                      color={checked ? 'primary' : 'inherit'}
                      startIcon={
                        <Iconify icon={checked ? 'eva:checkmark-fill' : 'eva:plus-fill'} />
                      }
                    >
                      {checked ? 'assigned' : 'assign'}
                    </Button>
                  }
                  sx={{ height: ITEM_HEIGHT }}
                >
                  <ListItemAvatar>
                    <Avatar src={staticFilePath(contact.image)} />
                  </ListItemAvatar>

                  <ListItemText
                    primaryTypographyProps={{ typography: 'subtitle2', sx: { mb: 0.25 } }}
                    secondaryTypographyProps={{ typography: 'caption' }}
                    primary={contact.name}
                    secondary={contact.email}
                  />
                </ListItem>
              );
            })}
          </Scrollbar>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, query }: { inputData: IKanbanAssignee[]; query: string }) {
  if (query) {
    inputData = inputData.filter(
      (contact) =>
        contact.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        contact.email.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}

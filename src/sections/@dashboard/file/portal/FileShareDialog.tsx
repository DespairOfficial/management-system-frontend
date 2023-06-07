// @mui
import {
  List,
  Stack,
  Dialog,
  Button,
  TextField,
  DialogProps,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';
// @types
import { IFileContributor } from '../../../../@types/file';
// components
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import axios from '../../../../utils/axios';
//
import FileInvitedItem from '../FileInvitedItem';

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  inviteEmail?: string;
  contributors?: IFileContributor[] | null;
  onCopyLink?: VoidFunction;
  onChangeInvite?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  //
  fileId: string;
  open: boolean;
  onClose: VoidFunction;
}

export default function FileShareDialog({
  contributors,
  inviteEmail,
  onCopyLink,
  onChangeInvite,
  fileId,
  //
  open,
  onClose,
  ...other
}: Props) {
  const hasContributors = contributors && !!contributors.length;

  const inviteNewContributor = (fileToShareId: string, contributorEmail: string) => {
    axios.post(`api/shared/${fileToShareId}/contributors`, {
      contributorEmail,
    });
  };

  const onSendInvite = () => {
    if (inviteEmail) {
      inviteNewContributor(fileId, inviteEmail);
    }
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle> Invite </DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>
        {onChangeInvite && (
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              size="small"
              value={inviteEmail}
              placeholder="Email"
              onChange={onChangeInvite}
            />
            <Button
              disabled={!inviteEmail}
              variant="contained"
              sx={{ flexShrink: 0 }}
              onClick={() => onSendInvite()}
            >
              Send Invite
            </Button>
          </Stack>
        )}

        {hasContributors && (
          <Scrollbar sx={{ maxHeight: 60 * 6 }}>
            <List disablePadding>
              {contributors.map((person) => (
                <FileInvitedItem key={person.id} person={person} fileId={fileId} />
              ))}
            </List>
          </Scrollbar>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between' }}>
        {onCopyLink && (
          <Button startIcon={<Iconify icon="eva:link-2-fill" />} onClick={onCopyLink}>
            Copy link
          </Button>
        )}

        {onClose && (
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

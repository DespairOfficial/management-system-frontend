// @mui
import { Stack, Paper, Button, Tooltip, IconButton, InputBase } from '@mui/material';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// components
import Iconify from '../../../../components/iconify';
import { CustomAvatar } from '../../../../components/custom-avatar';
import { staticFilePath } from '../../../../components/file-thumbnail/utils';
import { IEditKanbanComment } from '../../../../@types/kanban';

// ----------------------------------------------------------------------

interface Props {
  addComment: (comment: IEditKanbanComment) => void;
}

export default function KanbanDetailsCommentInput({ addComment }: Props) {
  const { user } = useAuthContext();

  const onAddComment = () => {
    console.log('adding comment');
  };

  return (
    <Stack direction="row" spacing={2} sx={{ py: 3, px: 2.5 }}>
      <CustomAvatar
        src={staticFilePath(user?.image ?? undefined)}
        alt={user?.username}
        name={user?.username}
      />

      <Paper variant="outlined" sx={{ p: 1, flexGrow: 1 }}>
        <InputBase fullWidth multiline rows={2} placeholder="Type a message" sx={{ px: 1 }} />

        <Stack direction="row" alignItems="center">
          <Stack direction="row" flexGrow={1}>
            <Tooltip title="Add photo">
              <IconButton size="small">
                <Iconify icon="ic:round-add-photo-alternate" />
              </IconButton>
            </Tooltip>

            <IconButton size="small">
              <Iconify icon="eva:attach-2-fill" />
            </IconButton>
          </Stack>

          <Button
            variant="contained"
            onClick={() => {
              onAddComment();
            }}
          >
            Comment
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}

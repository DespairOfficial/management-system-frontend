import { ChangeEvent, useState, useRef } from 'react';
// @mui
import { Stack, Paper, Button, Tooltip, IconButton, InputBase, Badge } from '@mui/material';
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const disabled = false;

  const [attachments, setAttachments] = useState<File[]>([]);
  const [message, setMessage] = useState<string>('');

  const onAddComment = () => {
    addComment({
      message,
      image: attachments[0],
    });
    setMessage('');
    setAttachments([]);
  };

  const handleClickAttach = () => {
    fileInputRef.current?.click();
  };

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target?.files;
    const attachmentsList = [];
    if (files) {
      for (let i = 0; i < files.length; i += 1) {
        attachmentsList.push(files[i]);
      }
    }
    setAttachments(attachmentsList);
  };

  return (
    <Stack direction="row" spacing={2} sx={{ py: 3, px: 2.5 }}>
      <CustomAvatar
        src={staticFilePath(user?.image ?? undefined)}
        alt={user?.username}
        name={user?.username}
      />

      <Paper variant="outlined" sx={{ p: 1, flexGrow: 1 }}>
        <InputBase
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          fullWidth
          multiline
          rows={2}
          placeholder="Type a message"
          sx={{ px: 1 }}
        />

        <Stack direction="row" alignItems="center">
          <Stack direction="row" flexGrow={1}>
            {/* <Tooltip title="Add photo">
              <IconButton size="small">
                <Iconify icon="ic:round-add-photo-alternate" />
              </IconButton>
            </Tooltip> */}

            <IconButton disabled={disabled} size="small" onClick={handleClickAttach}>
              {attachments.length > 0 ? (
                <Badge badgeContent={attachments.length} color="error">
                  <Iconify icon="eva:attach-2-fill" />
                </Badge>
              ) : (
                <Iconify icon="eva:attach-2-fill" />
              )}
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

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => onChangeHandler(e)}
      />
    </Stack>
  );
}

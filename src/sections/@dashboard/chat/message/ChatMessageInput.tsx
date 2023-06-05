import { useRef, useState, ChangeEvent } from 'react';
// @mui
import { Stack, InputBase, InputBaseProps, IconButton, InputAdornment, Badge } from '@mui/material';
// utils
import uuidv4 from '../../../../utils/uuidv4';
// @types
import { IChatSendMessage } from '../../../../@types/chat';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

const CURRENT_USER_ID = localStorage.getItem('userId') ?? '';

interface Props extends InputBaseProps {
  conversationId: number | null;
  onSend: (data: IChatSendMessage) => void;
}

export default function ChatMessageInput({
  disabled,
  conversationId,
  onSend,
  sx,
  ...other
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState('');

  const [attachments, setAttachments] = useState<File[]>([]);

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

  const handleSend = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      if (onSend && message && conversationId) {
        onSend({
          conversationId,
          message,
          contentType: 'text',
          attachments,
          createdAt: new Date(),
          senderId: CURRENT_USER_ID,
        });
      }
      setMessage('');
    }
  };

  return (
    <>
      <InputBase
        value={message}
        onKeyUp={handleSend}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Type a message"
        startAdornment={
          <InputAdornment position="start">
            <IconButton size="small">
              <Iconify icon="eva:smiling-face-fill" />
            </IconButton>
          </InputAdornment>
        }
        endAdornment={
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0, mr: 1.5 }}>
            {/* <IconButton disabled={disabled} size="small" onClick={handleClickAttach}>
              <Iconify icon="ic:round-add-photo-alternate" />
            </IconButton> */}

            <IconButton disabled={disabled} size="small" onClick={handleClickAttach}>
              {attachments.length ? (
                <Badge badgeContent={attachments.length} color="error">
                  <Iconify icon="eva:attach-2-fill" />
                </Badge>
              ) : (
                <Iconify icon="eva:attach-2-fill" />
              )}
            </IconButton>

            <IconButton disabled={disabled} size="small">
              <Iconify icon="eva:mic-fill" />
            </IconButton>
          </Stack>
        }
        sx={{
          pl: 1,
          height: 56,
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
          ...sx,
        }}
        {...other}
      />

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => onChangeHandler(e)}
        multiple
      />
    </>
  );
}

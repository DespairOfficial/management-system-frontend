import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import { Avatar, Typography, Stack } from '@mui/material';
// @types
import { IChatConversation, IChatMessage } from '../../../../@types/chat';
// components
import Image from '../../../../components/image';
import { HOST_API_KEY } from '../../../../config-global';
import { AttachmentItem } from '../room/ChatRoomAttachments';

// ----------------------------------------------------------------------

const CURRENT_USER_ID = +(localStorage.getItem('userId') ?? 0);

type Props = {
  message: IChatMessage;
  conversation: IChatConversation;
  onOpenLightbox: (value: string) => void;
};

export default function ChatMessageItem({ message, conversation, onOpenLightbox }: Props) {
  const sender = conversation.participants.find(
    (participant) => participant.id === message.senderId
  );

  const senderDetails =
    message.senderId === CURRENT_USER_ID
      ? {
          type: 'me',
        }
      : {
          avatar: sender?.image,
          name: sender?.name,
        };

  const currentUser = senderDetails.type === 'me';

  const isImage = message.contentType === 'text';

  const name = senderDetails.name && senderDetails.name.split(' ')[0];

  return (
    <Stack direction="row" justifyContent={currentUser ? 'flex-end' : 'unset'} sx={{ mb: 3 }}>
      {!currentUser && (
        <Avatar
          alt={senderDetails.name}
          src={senderDetails.avatar}
          sx={{ width: 32, height: 32, mr: 2 }}
        />
      )}

      <Stack spacing={1} alignItems="flex-end">
        <Typography
          noWrap
          variant="caption"
          sx={{
            color: 'text.disabled',
            ...(!currentUser && {
              mr: 'auto',
            }),
          }}
        >
          {!currentUser && `${name},`} &nbsp;
          {formatDistanceToNowStrict(new Date(message.createdAt), {
            addSuffix: true,
          })}
        </Typography>

        <Stack
          sx={{
            p: 1.5,
            minWidth: 48,
            maxWidth: 320,
            borderRadius: 1,
            overflow: 'hidden',
            typography: 'body2',
            bgcolor: 'background.neutral',
            ...(currentUser && {
              color: 'grey.800',
              bgcolor: 'primary.lighter',
            }),
            // ...(isImage && {
            //   p: 0,
            // }),
          }}
        >
          {/* {isImage ? (
            <Image
              alt={`image${message.id}`}
              src={message.body}
              onClick={() => onOpenLightbox(message.body)}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.9,
                },
              }}
            />
          ) : (
            message.body
          )} */}
          {message.body}
          {message.attachments.map((attachment, index) => {
            if (attachment.type.split('/')[0] === 'image') {
              return (
                <Image
                  key={attachment.path}
                  alt="attachment"
                  src={`${HOST_API_KEY}/${attachment.path}`}
                  onClick={() => onOpenLightbox(attachment.path)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.9,
                    },
                  }}
                />
              );
            }
            return <AttachmentItem key={attachment.name + index} attachment={attachment} />;
          })}
        </Stack>
      </Stack>
    </Stack>
  );
}

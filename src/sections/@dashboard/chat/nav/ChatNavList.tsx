import { useNavigate } from 'react-router-dom';
// @mui
import { List, SxProps } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// @types
import { IChatConversationsState } from '../../../../@types/chat';
// components
import { SkeletonConversationItem } from '../../../../components/skeleton';
//
import ChatNavItem from './ChatNavItem';

// ----------------------------------------------------------------------

const CURRENT_USER_ID = localStorage.getItem('userId');;

type Props = {
  conversations: IChatConversationsState;
  openNav: boolean;
  onCloseNav: VoidFunction;
  selected: (conversationId: number) => boolean;
  sx?: SxProps;
};

export default function ChatNavList({
  conversations,
  openNav,
  onCloseNav,
  selected,
  sx,
  ...other
}: Props) {
  const navigate = useNavigate();

  const isDesktop = useResponsive('up', 'md');

  const handleSelectConversation = (conversationId: string) => {
    let conversationKey = '';

    const conversation = conversations.byId[conversationId];

    if (conversation.type === 'GROUP') {
      conversationKey = `GROUP_${conversation.id}`;
    } else {
      const otherParticipant = conversation.participants.find(
        (participant) => participant.id !== CURRENT_USER_ID
      );

      if (otherParticipant?.userName) {
        conversationKey = otherParticipant?.userName;
      }
    }

    navigate(PATH_DASHBOARD.chat.view(conversationKey));
  };

  const loading = !conversations.allIds.length;

  return (
    <List disablePadding sx={sx} {...other}>
      {(loading ? [...Array(12)] : conversations.allIds).map((conversationId, index) =>
        conversationId ? (
          <ChatNavItem
            key={`conversation_${conversationId}`}
            openNav={openNav}
            conversation={conversations.byId[conversationId]}
            isSelected={selected(conversationId)}
            onSelect={() => {
              if (!isDesktop) {
                onCloseNav();
              }
              handleSelectConversation(conversationId);
            }}
          />
        ) : (
          <SkeletonConversationItem key={index} />
        )
      )}
    </List>
  );
}

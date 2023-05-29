import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Stack, Drawer, IconButton, IconButtonProps } from '@mui/material';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// utils
import axios from '../../../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// @types
import { IChatContact, IChatConversationsState } from '../../../../@types/chat';
// components
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
//
import ChatNavList from './ChatNavList';
import ChatNavSearch from './ChatNavSearch';
import ChatNavAccount from './ChatNavAccount';
import ChatNavSearchResults from './ChatNavSearchResults';

// ----------------------------------------------------------------------

const StyledToggleButton = styled((props) => (
  <IconButton disableRipple {...props} />
))<IconButtonProps>(({ theme }) => ({
  left: 0,
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  top: theme.spacing(13),
  borderRadius: `0 12px 12px 0`,
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  boxShadow: theme.customShadows.primary,
  '&:hover': {
    backgroundColor: theme.palette.primary.darker,
  },
}));

// ----------------------------------------------------------------------

const NAV_WIDTH = 320;

const NAV_COLLAPSE_WIDTH = 96;

type Props = {
  conversations: IChatConversationsState;
  activeConversationId: number | null;
};

export default function ChatNav({ conversations, activeConversationId }: Props) {
  const theme = useTheme();

  const navigate = useNavigate();

  const isDesktop = useResponsive('up', 'md');

  const [openNav, setOpenNav] = useState(false);

  const [searchResults, setSearchResults] = useState([]);

  const [searchContacts, setSearchContacts] = useState('');

  const isCollapse = isDesktop && !openNav;

  useEffect(() => {
    if (!isDesktop) {
      handleCloseNav();
    } else {
      handleOpenNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);

  const handleToggleNav = () => {
    setOpenNav(!openNav);
  };

  const handleOpenNav = () => {
    setOpenNav(true);
  };

  const handleCloseNav = () => {
    setOpenNav(false);
  };

  const handleChangeSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const { value } = event.target;

      setSearchContacts(value);

      if (value) {
        const response = await axios.get('/api/chat/search', {
          params: { query: value },
        });

        setSearchResults(response.data.results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectContact = (result: IChatContact) => {
    setSearchContacts('');
    navigate(PATH_DASHBOARD.chat.view(result.username));
  };

  const renderContent = (
    <>
      <Box sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="center">
          {!isCollapse && (
            <>
              <ChatNavAccount />
              <Box sx={{ flexGrow: 1 }} />
            </>
          )}

          <IconButton onClick={handleToggleNav}>
            <Iconify icon={openNav ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill'} />
          </IconButton>

          {!isCollapse && (
            <IconButton component={RouterLink} to={PATH_DASHBOARD.chat.new}>
              <Iconify icon="eva:edit-fill" />
            </IconButton>
          )}
        </Stack>

        {!isCollapse && (
          <ChatNavSearch
            value={searchContacts}
            onChange={handleChangeSearch}
            onClickAway={() => setSearchContacts('')}
          />
        )}
      </Box>

      <Scrollbar>
        {!searchContacts ? (
          <ChatNavList
            openNav={openNav}
            onCloseNav={handleCloseNav}
            conversations={conversations}
            selected={(conversationId: number) => activeConversationId === conversationId}
          />
        ) : (
          <ChatNavSearchResults
            searchContacts={searchContacts}
            searchResults={searchResults}
            onSelectContact={handleSelectContact}
          />
        )}
      </Scrollbar>
    </>
  );

  return (
    <>
      {!isDesktop && (
        <StyledToggleButton onClick={handleToggleNav}>
          <Iconify width={16} icon="eva:people-fill" />
        </StyledToggleButton>
      )}

      {isDesktop ? (
        <Drawer
          open={openNav}
          variant="persistent"
          PaperProps={{
            sx: {
              pb: 1,
              width: 1,
              position: 'static',
              ...(isCollapse && {
                transform: 'none !important',
                visibility: 'visible !important',
              }),
            },
          }}
          sx={{
            width: NAV_WIDTH,
            transition: theme.transitions.create('width'),
            ...(isCollapse && {
              width: NAV_COLLAPSE_WIDTH,
            }),
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={handleCloseNav}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: {
              pb: 1,
              width: NAV_WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </>
  );
}

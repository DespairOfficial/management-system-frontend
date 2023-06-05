import keyBy from 'lodash/keyBy';
import { createAsyncThunk, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { socket } from '../../socket';
// utils
import axios from '../../utils/axios';
// @types
import { IChatState, IChatMessage, IChatSendMessage, ICreateMessage } from '../../@types/chat';

// ----------------------------------------------------------------------

export const sendSocketMessage = createAsyncThunk(
  'chat/sendMessage',
  async (args: IChatSendMessage, thunkAPI) => {
    const attachmentsTyped: File[] = args.attachments;
    const attachmentsFiles = attachmentsTyped.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      file,
    }));
    const newMessage: ICreateMessage = {
      body: args.message,
      conversationId: args.conversationId,
      contentType: args.contentType,
      attachments: attachmentsFiles,
    };
    const response = await new Promise<IChatMessage>((res, rej) => {
      socket.emit('message:post', newMessage, (message: IChatMessage) => {
        if (!message) {
          rej();
        }
        res(message);
      });
    });
    console.log(response);

    return response;
  }
);

// ----------------------------------------------------------------------

const initialState: IChatState = {
  isLoading: false,
  error: null,
  // on empty chat - list to adding recipients
  contacts: { byId: {}, allIds: [] },

  // all users conversations
  conversations: { byId: {}, allIds: [] },
  activeConversationId: null,

  // participants of selected conversation
  participants: [],
  // set of the users, to write all of them at the time
  recipients: [],
};

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET CONTACT SSUCCESS
    getContactsSuccess(state, action) {
      const contacts = action.payload;

      state.contacts.byId = keyBy(contacts, 'id');
      state.contacts.allIds = Object.keys(state.contacts.byId).map((id) => +id);
    },

    // GET CONVERSATIONS
    getConversationsSuccess(state, action) {
      const conversations = action.payload;

      state.conversations.byId = keyBy(conversations, 'id');
      state.conversations.allIds = Object.keys(state.conversations.byId).map((id) => +id);
    },

    // GET CONVERSATION
    getConversationSuccess(state, action) {
      const conversation = action.payload;

      if (conversation) {
        state.conversations.byId[conversation.id] = conversation;
        state.activeConversationId = conversation.id;
        if (!state.conversations.allIds.includes(conversation.id)) {
          state.conversations.allIds.push(conversation.id);
        }
      } else {
        state.activeConversationId = null;
      }
    },

    // ON SEND MESSAGE
    // sendMessage(state, action) {
    //   const conversation = action.payload;
    //   const { conversationId, messageId, message, contentType, attachments, createdAt, senderId } =
    //     conversation;

    //   const attachmentsTyped: File[] = attachments;
    //   const attachmentsFiles = attachmentsTyped.map((file) => ({
    //     name: file.name,
    //     size: file.size,
    //     type: file.type,
    //     file,
    //   }));

    //   const newMessage = sendMessageSocket(message, conversationId, contentType, attachmentsFiles);
    //   state.conversations.byId[conversationId].messages.push(newMessage);
    // },

    markConversationAsReadSuccess(state, action) {
      const { conversationId } = action.payload;
      const conversation = state.conversations.byId[conversationId];
      if (conversation) {
        conversation.unreadCount = 0;
      }
    },

    // GET PARTICIPANTS
    getParticipantsSuccess(state, action) {
      const participants = action.payload;
      state.participants = participants;
    },

    // RESET ACTIVE CONVERSATION
    resetActiveConversation(state) {
      state.activeConversationId = null;
    },

    addRecipients(state, action) {
      const recipients = action.payload;
      state.recipients = recipients;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sendSocketMessage.fulfilled, (state, action) => {
      state.conversations.byId[action.meta.arg.conversationId].messages.push(action.payload);
    });
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { addRecipients, resetActiveConversation } = slice.actions;

// ----------------------------------------------------------------------

export function getContacts() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/contacts');
      dispatch(slice.actions.getContactsSuccess(response.data.contacts));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getConversations() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/chat/conversation');
      dispatch(slice.actions.getConversationsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getConversation(conversationKey: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/chat/conversation/${conversationKey}`);
      dispatch(slice.actions.getConversationSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function markConversationAsRead(conversationId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`/api/chat/conversation/mark-as-seen/${conversationId}`);
      dispatch(slice.actions.markConversationAsReadSuccess({ conversationId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getParticipants(conversationKey: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/chat/conversation/participants/${conversationKey}`);
      dispatch(slice.actions.getParticipantsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

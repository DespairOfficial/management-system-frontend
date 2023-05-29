// ----------------------------------------------------------------------

export type IChatAttachment = {
  name: string;
  size: number;
  type: string;
  path: string;
  preview: string;
  dateCreated: Date;
  dateModified: Date;
};

export type IChatTextMessage = {
  id: number;
  body: string;
  contentType: 'text';
  attachments: IChatAttachment[];
  createdAt: Date;
  senderId: number;
};

export type IChatImageMessage = {
  id: number;
  body: string;
  contentType: 'image';
  attachments: IChatAttachment[];
  createdAt: Date;
  senderId: number;
};

export type IChatMessage = IChatTextMessage | IChatImageMessage;

// ----------------------------------------------------------------------

export type IChatContact = {
  id: number;
  name: string;
  username: string;
  avatar: string;
  address: string;
  phone: string;
  email: string;
  lastActivity: Date | string | number;
  status: string;
  role: string;
};

export type IChatParticipant = {
  id: number;
  name: string;
  username: string;
  avatar: string;
  address?: string;
  phone?: string;
  email?: string;
  lastActivity?: Date | string | number;
  status?: 'online' | 'offline' | 'away' | 'busy';
  role?: string;
};

export type IChatConversation = {
  id: number;
  participants: IChatParticipant[];
  type: string;
  unreadCount: number;
  messages: IChatMessage[];
};

export type IChatSendMessage = {
  conversationId: number;
  message: string;
  contentType: 'text';
  attachments: string[];
  createdAt: Date | string | number;
  senderId: number;
};

// ----------------------------------------------------------------------

export type IChatContactsState = {
  byId: Record<string, IChatParticipant>;
  allIds: number[];
};

export type IChatConversationsState = {
  byId: Record<string, IChatConversation>;
  allIds: number[];
};

export type IChatState = {
  isLoading: boolean;
  error: Error | string | null;
  contacts: IChatContactsState;
  conversations: IChatConversationsState;
  activeConversationId: null | number;
  participants: IChatParticipant[];
  recipients: IChatParticipant[];
};

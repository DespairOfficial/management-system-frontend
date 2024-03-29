import { IProject } from './project';
// ----------------------------------------------------------------------

export type IChatAttachment = {
  name: string;
  size: number;
  type: string;
  path: string;
  preview: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IChatTextMessage = {
  id: number;
  body: string;
  contentType: 'text';
  attachments: IChatAttachment[];
  createdAt: Date;
  senderId: string;
  conversationId?: number;
};

export type IChatImageMessage = {
  id: number;
  body: string;
  contentType: 'image';
  attachments: IChatAttachment[];
  createdAt: Date;
  senderId: string;
};

export type IChatMessage = IChatTextMessage;

// ----------------------------------------------------------------------

export type IChatContact = {
  id: string;
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
  id: string;
  name: string;
  username: string;
  image: string;
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
  projectId: string | null;
  project: IProject | null;
  type: string;
  unreadCount: number;
  messages: IChatMessage[];
};

export type IChatSendMessage = {
  conversationId: number;
  message: string;
  contentType: 'text';
  attachments: File[];
  createdAt: Date | string | number;
  senderId: string;
};

export interface ICreateMessage {
  body: string;
  conversationId: number;
  contentType: string;
  attachments: ICreateAttachment[];
}

export interface ICreateAttachment {
  name: string;
  size: number;
  type: string;
  file: File;
}

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
  notifications: INotification[];
};

export type NotificationType = 'friend_interactive' | 'chat_message';

export interface INotification {
  id?: number;
  title: string;
  description: string;
  avatar: string;
  type: NotificationType;
  createdAt: Date;
  isUnRead: boolean;
}

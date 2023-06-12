// ----------------------------------------------------------------------

export type IKanbanComment = {
  id: string;
  image: string;
  name: string;
  createdAt: Date | string | number;
  messageType: 'image' | 'text';
  message: string;
};

export type IKanbanAssignee = {
  id: string;
  name: string;
  username: string;
  image: string | null;
  address: string | null;
  phone: string | null;
  email: string;
  lastActivity: Date | string | null;
  status: string;
  role: string | null;
};

export type IKanbanCard = {
  id: string;
  name: string;
  description?: string;
  assignee: IKanbanAssignee[];
  due: [Date | null, Date | null];
  attachments: string[];
  comments: IKanbanComment[];
  completed: boolean;
};

export type IKanbanColumn = {
  id: string;
  name: string;
  cardIds: string[];
};

export type IKanbanBoard = {
  id: string;
  cards: IKanbanCard[];
  columns: IKanbanColumn[];
  columnOrder: string[];
};

// ----------------------------------------------------------------------

export type IKanbanState = {
  isLoading: boolean;
  error: Error | string | null;
  board: {
    id: string;
    cards: Record<string, IKanbanCard>;
    columns: Record<string, IKanbanColumn>;
    columnOrder: string[];
  };
};

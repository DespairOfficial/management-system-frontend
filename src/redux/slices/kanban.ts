import omit from 'lodash/omit';
import keyBy from 'lodash/keyBy';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// @types
import {
  IKanbanState,
  IKanbanCard,
  IKanbanColumn,
  IEditKanbanCard,
  IEditKanbanComment,
} from '../../@types/kanban';

// ----------------------------------------------------------------------

const initialState: IKanbanState = {
  isLoading: false,
  error: null,
  board: {
    id: '',
    cards: {},
    columns: {},
    columnOrder: [],
  },
};

const slice = createSlice({
  name: 'kanban',
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

    // GET BOARD
    getBoardSuccess(state, action) {
      state.isLoading = false;
      const board = action.payload;
      const cards = keyBy(board.cards, 'id');
      const columns = keyBy(board.columns, 'id');
      const id = board.id;
      const { columnOrder } = board;

      state.board = {
        id,
        cards,
        columns,
        columnOrder,
      };
    },

    // CREATE NEW COLUMN
    createColumnSuccess(state, action) {
      const newColumn = action.payload;
      state.isLoading = false;
      state.board.columns = {
        ...state.board.columns,
        [newColumn.id]: newColumn,
      };
      state.board.columnOrder.push(newColumn.id);
    },

    persistCard(state, action) {
      const columns = action.payload;
      state.board.columns = columns;
    },

    persistColumn(state, action) {
      state.board.columnOrder = action.payload;
    },

    addTask(state, action) {
      const { card, columnId } = action.payload;

      state.board.cards[card.id] = card;
      state.board.columns[columnId].cardIds.push(card.id);
    },

    addComment(state, action) {
      const { comment, cardId } = action.payload;
      state.board.cards[cardId].comments.push(comment);
    },

    editTask(state, action) {
      const { card, columnId } = action.payload;
      state.board.cards[card.id] = card;
    },

    deleteTask(state, action) {
      const { cardId, columnId } = action.payload;

      state.board.columns[columnId].cardIds = state.board.columns[columnId].cardIds.filter(
        (id) => id !== cardId
      );

      state.board.cards = omit(state.board.cards, [cardId]);
    },

    // UPDATE COLUMN
    updateColumnSuccess(state, action) {
      const column = action.payload;

      state.isLoading = false;
      state.board.columns[column.id] = column;
    },

    // DELETE COLUMN
    deleteColumnSuccess(state, action) {
      const { columnId } = action.payload;
      const deletedColumn = state.board.columns[columnId];

      state.isLoading = false;
      state.board.columns = omit(state.board.columns, [columnId]);
      state.board.cards = omit(state.board.cards, [...deletedColumn.cardIds]);
      state.board.columnOrder = state.board.columnOrder.filter((c) => c !== columnId);
    },
  },
});

// Reducer
export default slice.reducer;

export const { actions } = slice;

// ----------------------------------------------------------------------

export function getBoard(kanbanId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/kanban/board/${kanbanId}`);
      dispatch(slice.actions.getBoardSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createColumn(name: string, boardId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/kanban/columns', {
        name,
        boardId,
      });
      dispatch(slice.actions.createColumnSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateColumn(columnId: string, column: IKanbanColumn) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`/api/kanban/columns/${columnId}`, column);
      dispatch(slice.actions.updateColumnSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteColumn(columnId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`/api/kanban/columns/${columnId}`);
      dispatch(slice.actions.deleteColumnSuccess({ columnId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function persistColumn(newColumnOrder: string[]) {
  return (dispatch: Dispatch) => {
    dispatch(slice.actions.persistColumn(newColumnOrder));
  };
}

// ----------------------------------------------------------------------

export function persistCard(columns: Record<string, IKanbanColumn>) {
  return (dispatch: Dispatch) => {
    dispatch(slice.actions.persistCard(columns));
  };
}

// ----------------------------------------------------------------------

export function addTask({ card, columnId }: { card: IKanbanCard; columnId: string }) {
  return async (dispatch: Dispatch) => {
    try {
      const { comments, ...rest } = card;
      await axios.post(`/api/kanban/card/${columnId}`, rest);
      dispatch(slice.actions.addTask({ card, columnId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteTask({ cardId, columnId }: { cardId: string; columnId: string }) {
  return (dispatch: Dispatch) => {
    axios.delete(`/api/kanban/card/${cardId}`);

    dispatch(slice.actions.deleteTask({ cardId, columnId }));
  };
}

// ----------------------------------------------------------------------

export function editTask({ card, columnId }: { card: IEditKanbanCard; columnId: string }) {
  return async (dispatch: Dispatch) => {
    try {
      const formData = new FormData();
      const { id, boardId, comments, assignee, attachments, ...rest } = card;
      const restKeys = Object.keys(rest);
      const restValues = Object.values(rest);

      assignee.forEach((user) => {
        formData.append('assignee[]', user.id);
      });

      attachments.forEach((item) => {
        formData.append('attachments', item);
      });

      formData.append('columnId', columnId);

      restKeys.forEach((key, i) => {
        const value: any = restValues[i];

        if (value instanceof File) {
          formData.append(key, value as Blob);
        } else if (value instanceof Array) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item);
          });
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value as string);
        }
      });

      axios.patch(`/api/kanban/card/${card.id}`, formData);
      dispatch(slice.actions.editTask({ card, columnId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createComment({
  comment,
  cardId,
}: {
  comment: IEditKanbanComment;
  cardId: string;
}) {
  return async (dispatch: Dispatch) => {
    try {
      await axios.post(`/api/kanban/comment`, { ...comment, cardId });
      dispatch(slice.actions.addComment({ comment, cardId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

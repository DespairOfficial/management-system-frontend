import { createSlice, Dispatch } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// @types
import { ICalendarState, ICalendarEvent } from '../../@types/calendar';

// ----------------------------------------------------------------------

const initialState: ICalendarState = {
  isLoading: false,
  error: null,
  events: [],
};

const slice = createSlice({
  name: 'calendar',
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

    // GET EVENTS
    getEventsSuccess(state, action) {
      state.isLoading = false;
      state.events = action.payload;
    },

    // CREATE EVENT
    createEventSuccess(state, action) {
      const newEvent = action.payload;
      state.isLoading = false;
      state.events = [...state.events, newEvent];
    },

    // UPDATE EVENT
    updateEventSuccess(state, action) {
      state.isLoading = false;
      state.events = state.events.map((event) => {
        if (event.id === action.payload.id) {
          return action.payload;
        }
        return event;
      });
    },

    // DELETE EVENT
    deleteEventSuccess(state, action) {
      const eventId = action.payload;
      state.events = state.events.filter((event) => event.id !== eventId);
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getEvents() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/calendar/events');
      dispatch(slice.actions.getEventsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createEvent(newEvent: ICalendarEvent) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/calendar/events', newEvent);
      dispatch(slice.actions.createEventSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateEvent(
  eventId: string,
  event: Partial<{
    allDay: boolean;
    start: Date | string | number | null;
    end: Date | string | number | null;
  }>
) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`/api/calendar/events/${eventId}`, event);
      dispatch(slice.actions.updateEventSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteEvent(eventId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`/api/calendar/events/${eventId}`);
      dispatch(slice.actions.deleteEventSuccess(eventId));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

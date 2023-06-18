import { createSlice, Dispatch } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { IProjectState } from '../../@types/project';

// ----------------------------------------------------------------------

const initialState: IProjectState = {
  isLoading: false,
  error: null,
  projects: [],
  project: null,
};

const slice = createSlice({
  name: 'project',
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

    // GET PROJECTS
    getProjectsSuccess(state, action) {
      state.isLoading = false;
      state.projects = action.payload;
    },

    // GET PROJECT
    getProjectSuccess(state, action) {
      state.isLoading = false;
      state.project = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
// export const {} = slice.actions;

// ----------------------------------------------------------------------

export function getProjects() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/project');
      dispatch(slice.actions.getProjectsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getProject(name: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/project', {
        params: { name },
      });
      dispatch(slice.actions.getProjectSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

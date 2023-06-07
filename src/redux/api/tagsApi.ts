import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HOST_API_KEY } from '../../config-global';

// --------------------------------------------------------------------------------

export const tagsApi = createApi({
  reducerPath: 'tagsApi',
  baseQuery: fetchBaseQuery({ baseUrl: HOST_API_KEY }),
  keepUnusedDataFor: 10 * 60 * 6,
  endpoints: (builder) => ({
    getTagsOptions: builder.query<string[], void>({
      query: () => ({ url: `/api/shared/tags` }),
    }),
  }),
});

export const { useGetTagsOptionsQuery } = tagsApi;

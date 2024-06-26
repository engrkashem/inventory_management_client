import { TResponseRedux, TUser } from '../../../types';
import { baseApi } from '../../api/baseApi';

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => ({
        url: 'users/get-me',
        method: 'GET',
      }),
      providesTags: ['myInfo'],
      transformResponse: (response: TResponseRedux<TUser>) => {
        return response.data;
      },
    }),
    updateMyProfile: builder.mutation({
      query: (data) => ({
        url: '/users/update-my-profile',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['myInfo'],
    }),
    hostToImgBB: builder.mutation({
      query: ({ data, key }) => ({
        url: `https://api.imgbb.com/1/upload?key=${key}`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateMyProfileMutation,
  useHostToImgBBMutation,
} = userApi;

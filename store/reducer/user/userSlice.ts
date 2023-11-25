import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {UserPostDto} from '../post/postSlice';
import axios, {AxiosError} from 'axios';

interface getUserDto {
  token: string | null;
  id?: string;
  page?: number;
  username?: string;
}

interface userMainDto {
  userData: UserPostDto;
  isError: boolean;
}

export const getUserData = createAsyncThunk(
  'user/user',
  async (data: getUserDto) => {
    const token = data.token;
    let page = data.page;
    console.log('user');
    if (page === undefined) {
      page = 1;
    }
    try {
      const res = await axios.get(
        `http://192.168.1.15:3000/posts/user/${data.id}?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      res.data['page'] = page;
      console.log(data.id);
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      //   console.log(err)
      const erCode = err.response?.data;
      return erCode;
    }
  },
);

export const followUser = createAsyncThunk(
  'user/follow',
  async (data: getUserDto) => {
    const token = data.token;
    console.log('user');
    try {
      const res = await axios.post(
        `http://192.168.1.15:3000/users/follow`,
        {
          username: data.username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      //   console.log(err)
      const erCode = err.response?.data;
      return erCode;
    }
  },
);

export const unfollowUser = createAsyncThunk(
  'user/unfollow',
  async (data: getUserDto) => {
    const token = data.token;
    console.log('user');
    try {
      const res = await axios.delete(
        `http://192.168.1.15:3000/users/unfollow`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            username: data.username,
          },
        },
      );
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      //   console.log(err)
      const erCode = err.response?.data;
      return erCode;
    }
  },
);

const initialState: userMainDto = {
  userData: {
    id: '',
    name: '',
    username: '',
    bio: '',
    email: '',
    coverImage: '',
    profileImage: '',
    createdAt: '',
    updatedAt: '',
    followingIds: [],
    followerIds: [],
    posts: [],
  },
  isError: false,
};

const userSlice = createSlice({
  name: 'user',
  reducers: {},
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getUserData.fulfilled, (state, action) => {
        state.isError = false;
        if (action.payload.status === 404) {
          state.isError = true;
          console.log('error jj');
        }
        if (action.payload.id) {
          console.log(action.payload.id);
          console.log(state.userData.id);
          if (action.payload.id != state.userData.id) {
            state.userData = action.payload;
          }
          if (action.payload.page != 1) {
            const posts = [...state.userData.posts, ...action.payload.posts];
            let data = action.payload;
            data.posts = posts;
            state.userData = data;
          } else {
            state.userData = action.payload;
          }
        }
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.isError = false;
        if (action.payload.status === 404) {
          state.isError = true;
          console.log('error');
        }
        console.log(action.payload)
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.isError = false;
        if (action.payload.status === 404) {
          state.isError = true;
          console.log('error');
        }
        console.log(action.payload)
      });
  },
});

export default userSlice.reducer;

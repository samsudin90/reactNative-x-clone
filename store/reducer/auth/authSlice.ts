import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import axios, {AxiosError} from 'axios';

export interface UserDto {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  email: string;
  coverImage: string | null;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
  followingIds: string[];
  followerIds: string[] | [];
}

interface UserEditDto {
  name?: string;
  username?: string;
  bio?: string;
  token?: string | null;
}

export interface AuthState {
  isLogin: boolean;
  token: string | null;
  isError: boolean;
  errorMessage: string;
  isLoading: boolean;
  user: UserDto;
}

interface SignInDto {
  username?: string;
  email: string;
  password: string;
}

interface TokenDto {
  token: string | null;
}

const initialState: AuthState = {
  isLogin: false,
  token: null,
  isError: false,
  errorMessage: '',
  isLoading: false,
  user: {
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
  },
};

export const userLogin = createAsyncThunk(
  'auth/userLogin',
  async (data: SignInDto) => {
    try {
      const res = await axios.post('http://192.168.1.15:3000/auth/signin', {
        email: data.email,
        password: data.password,
      });
      console.log(res.data)
      return res.data;
    } catch (error) {
      console.log(error);
      return 'error';
    }
  },
);

export const userRegister = createAsyncThunk(
  'auth/userRegister',
  async (data: SignInDto) => {
    try {
      const res = await axios.post('http://192.168.1.15:3000/auth/signup', {
        username: data.username,
        email: data.email,
        password: data.password,
      });
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      const erCode = err.response?.data;
      return erCode;
    }
  },
);

export const getMe = createAsyncThunk('auth/getMe', async (token: TokenDto) => {
  try {
    const res = await axios.get('http://192.168.1.15:3000/users/me', {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    const erCode = err.response?.data;
    return erCode;
  }
});

export const update = createAsyncThunk(
  'auth/update',
  async (data: UserEditDto) => {
    const token = data.token
    delete data.token
    try {
      const res = await axios.patch(
        'http://192.168.1.15:3000/users',
        {
          ...data,
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
      const erCode = err.response?.data;
      return erCode;
    }
  },
);

export const uploadCover = createAsyncThunk('auth/uploadCover', async (data : any) => {
  try {
    const token = data._parts[1][1]
    delete data._parts[1][1]

    delete data.token

    const res = await axios.post(
      'http://192.168.1.15:3000/users/cover',
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data
  } catch (error) {
    const err = error as AxiosError;
    const erCode = err.response?.data;
    return erCode;
  }
})

export const uploadProfile = createAsyncThunk('auth/uploadProfile', async (data : any) => {
  try {
    const token = data._parts[1][1]
    delete data._parts[1][1]

    delete data.token

    const res = await axios.post(
      'http://192.168.1.15:3000/users/avatar',
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data
  } catch (error) {
    const err = error as AxiosError;
    const erCode = err.response?.data;
    return erCode;
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signout: state => {
      state.isLogin = false;
      state.token = null;
      state.isLoading = false;
      state.user = {
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
      };
    },
    close : state => {
      state.isError = false
    }
  },
  extraReducers: builder => {
    builder
      .addCase(userLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.acess_token;
        state.isLogin = true;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.isLogin = false;
        console.log('failed');
      })
      .addCase(userLogin.pending, (state, action) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.errorMessage = '';
        state.isError = false;
        state.isLoading = false;
        if (action.payload.statusCode === 403) {
          state.isError = true;
          state.errorMessage = action.payload.message;
          // console.log(action.payload.message)
        }
        if (action.payload.acess_token) {
          state.isError = false;
          state.errorMessage = '';
          state.token = action.payload.acess_token;
          state.isLogin = true;
        }
        // console.log(action.payload)
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.isLogin = false;
        state.isLoading = false;
        // console.log(action)
      })
      .addCase(userRegister.pending, (state, action) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        if (action.payload.id) {
          state.user = action.payload;
        }
      })
      .addCase(update.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        if (action.payload.id) {
          state.user = action.payload
        }
      })
      .addCase(update.pending, (state, action) => {
        state.isLoading = true
        state.isError = false
      })
      .addCase(uploadCover.fulfilled, (state, action) => {
        state.isLoading = false
        state.isError = false
        if(action.payload != undefined) {
          state.user = action.payload
        } else {
          state.isError = true
        }
      })
      .addCase(uploadCover.pending, (state, action) => {
        state.isLoading = true
        state.isError = false
      })
      .addCase(uploadProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.isError = false
        if(action.payload != undefined) {
          state.user = action.payload
        } else {
          state.isError = true
        }
      })
      .addCase(uploadProfile.pending, (state, action) => {
        state.isLoading = true
        state.isError = false
      })
  },
});

export const {signout, close} = authSlice.actions;
export default authSlice.reducer;

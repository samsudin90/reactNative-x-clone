import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios, {AxiosError} from 'axios';

interface PostDto {
  token?: string | null;
  body: string;
  postId? : string
}

interface GetPostUserDto {
  token?: string | null;
  id?: string;
  page?: number;
}

export interface Post {
  body: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  likeIds: string[];
  userId: string;
  comments : comments[]
}

export interface UserPostDto {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  email: string;
  coverImage: string | null;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
  followingIds: string[] | [];
  followerIds: string[] ;
  posts: Post[];
}

export interface UserDto {
  id: string;
  name: string;
  username: string;
  profileImage: string | null;

}

export interface PostFypDto {
  body: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  likeIds: string[];
  userId: string;
  user: UserDto
  comments : comments[]
}

export interface comments {
  id : string
  body : string
  createdAt : string
  user : UserDto
}

interface PostById {
  id : string
  body : string
  createdAt : string
  updatedAt : string
  likeIds : string[]
  user : UserDto
  comments : comments[]
}

interface PostMainDto {
  data: UserPostDto;
  postById : PostById
  isError: boolean;
  isLoading: boolean;
  fyp: PostFypDto[];
  users : UserDto[]
  page : number
}

const initialState: PostMainDto = {
  data: {
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
  postById : {
    id : '',
    body : '',
    createdAt : '',
    updatedAt : '',
    likeIds : [],
    user : {
      id : '',
      name : '',
      username : '',
      profileImage : null
    },
    comments : []
  },
  isError: false,
  isLoading: false,
  fyp: [],
  users : [],
  page : 1
};

export const createPost = createAsyncThunk(
  'post/create',
  async (data: PostDto) => {
    const token = data.token;
    delete data.token;
    try {
      const res = await axios.post(
        'http://192.168.1.15:3000/posts/create',
        data,
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

// gak guna
export const getPostMe = createAsyncThunk(
  'post/me',
  async (token: string | null) => {
    try {
      const res = await axios.get('http://192.168.1.15:3000/posts/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      const erCode = err.response?.data;
      return erCode;
    }
  },
);

export const getPostByUserId = createAsyncThunk(
  'post/user',
  async (data: GetPostUserDto) => {
    const token = data.token;
    let page = data.page
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
      res.data['userId'] = data.id
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      const erCode = err.response?.data;
      return erCode;
    }
  },
);

export const getPostFyp = createAsyncThunk(
  'post/fyp',
  async (data: GetPostUserDto) => {
    const token = data.token;
    let page = data.page;
    if (page === undefined) {
      page = 1;
    }
    try {
      const res = await axios.get(
        `http://192.168.1.15:3000/posts?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      res.data['page'] = page;
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      const erCode = err.response?.data;
      return erCode;
    }
  },
);

export const likePost = createAsyncThunk(
  'post/like',
  async (data: GetPostUserDto) => {
    const token = data.token;
    let page = data.page;
    if (page === undefined) {
      page = 1;
    }
    try {
      const res = await axios.post(
        `http://192.168.1.15:3000/posts/${data.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      res.data['page'] = page
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      const erCode = err.response?.data;
      return erCode;
    }
  },
);

export const userSearch = createAsyncThunk(
  'post/search',
  async (data : GetPostUserDto) => {
    const token = data.token;
    try {
      const res = await axios.post(
        `http://192.168.1.15:3000/users/search`,
        {
          "username" : data.id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      res.data['status'] = res.status
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      const erCode = err.response?.data;
      return erCode;
    }
  }, 
)

export const getPostById = createAsyncThunk(
  'post/byId',
  async (data : GetPostUserDto) => {
    const token = data.token
    try {
      const res = await axios.get(
        `http://192.168.1.15:3000/posts/${data.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      
      res.data['status'] = res.status
      return res.data
    } catch (error) {
      const err = error as AxiosError;
      const erCode = err.response?.data;
      return erCode;
    }
  }
)

export const postComment = createAsyncThunk(
  'post/comment',
  async (data : PostDto) => {
    const token = data.token
    try {
      const res = await axios.post(
        `http://192.168.1.15:3000/comment?postId=${data.postId}`,
        {
          "body" : data.body
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      
      res.data['status'] = res.status
      return res.data
    } catch (error) {
      const err = error as AxiosError;
      const erCode = err.response?.data;
      return erCode;
    }
  }
  
)

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    pagePlus : (state) => {
      state.page += 1
    },
    setPage : (state) => {
      state.page = 1
    }
  },
  extraReducers: builder => {
    builder
      .addCase(createPost.fulfilled, (state, action) => {
        if (action.payload.statusCode === 500) {
          state.isError = true;
          state.isLoading = false;
        }
        if (action.payload.body) {
          state.isError = false;
          state.isLoading = false;
          // state.data = [action.payload].concat(state.data.posts);
          let pos = state.data.posts;
          state.data.posts = [action.payload].concat(pos);
        }
      })
      .addCase(createPost.pending, (state, action) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(getPostByUserId.fulfilled, (state, action) => {
        state.isError = false;
        if (action.payload.status === 404) {
          state.isError = true;
          console.log('error');
        }
        if (action.payload.id) {
          if (action.payload.page != 1) {
            const posts = [...state.data.posts, ...action.payload.posts];
            let data = action.payload;
            data.posts = posts;
            state.data = data;
          } else {
            state.data = action.payload;
          }
        }
      })
      .addCase(getPostFyp.fulfilled, (state, action) => {
        state.isError = false;
        console.log(action.payload.page);
        if (action.payload.status === 404) {
          state.isError = true;
          console.log('error');
        }
        if (action.payload.page != 1) {
          const posts = [...state.fyp, ...action.payload];
          state.fyp = posts;
        } else {
          state.fyp = action.payload;
        }
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.isError = false;
        if (action.payload.status === 404) {
          state.isError = true;
          console.log('error');
        }
        if (action.payload.id) {
          if(action.payload.page === 1) {
            state.data.posts.filter(post => {
              if (post.id === action.payload.id) {
                post.likeIds = action.payload.likeIds;
              }
            });
          } else {
            state.fyp.filter(post => {
              if(post.id === action.payload.id) {
                post.likeIds = action.payload.likeIds
              }
            })
          }
        }
      })
      .addCase(userSearch.fulfilled, (state, action) => {
        state.isError = false;
        if (action.payload.status === 404) {
          state.isError = true;
          console.log('error');
        }
        if(action.payload.status === 201) {
          state.users = action.payload
        }
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.isError = false
        if(action.payload.status === 404) {
          state.isError = false
          console.log('error')
        }
        if(action.payload.status === 200) {
          state.postById = action.payload
        }
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.isError = false
        if(action.payload.status === 404) {
          state.isError = false
          console.log('error')
        }
        if(action.payload.status === 201) {
          // state.postById = action.payload
          console.log('oke')
        }
      })
  },
});

export const {setPage, pagePlus} = postSlice.actions
export default postSlice.reducer;

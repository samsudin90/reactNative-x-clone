import { configureStore, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit';
import counterReducer from './reducer/counter/counterSlice'
import authReducer from './reducer/auth/authSlice'
import postReducer from './reducer/post/postSlice'
import userReducer from './reducer/user/userSlice'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage' 

const persistConfig = {
  key: 'root',
  storage: AsyncStorage
}

const authPersistConfig = {
  key : 'auth',
  storage : AsyncStorage,
  blacklist : ['isError', 'errorMessage', 'isLoading']
}

const postPersistConfig = {
  key : 'post',
  storage : AsyncStorage,
  blacklist : ['isError', 'posts', 'isLoading', 'data', 'fyp', 'users']
}

const userPersistConfig = {
  key : 'user',
  storage : AsyncStorage,
  blacklist : ['isError', 'data']
}

const reducer = combineReducers({
  counter : counterReducer,
    auth : persistReducer(authPersistConfig, authReducer),
    post : persistReducer(postPersistConfig, postReducer),
    user : persistReducer(userPersistConfig, userReducer)
})

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
  reducer : persistedReducer,
  middleware : getDefaultMiddleware({
    serializableCheck : {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    }
  })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
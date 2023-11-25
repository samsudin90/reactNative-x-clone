import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider, useSelector} from 'react-redux';
import {RootState, store} from './store';
import {PersistGate} from 'redux-persist/integration/react';
import {persistStore} from 'redux-persist';
import Login from './app/auth/Login';
import HomeScreen from './app/home/Index';
import Register from './app/auth/Register';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from './app/profile/Index';
import Ionicons from 'react-native-vector-icons/Ionicons'
import EditProfile from './app/profile/EditProfile';
import AddPost from './app/home/AddPost';
import SearchScreen from './app/search/Index';
import UserProfile from './app/profile/UserProfile';
import PostDetail from './app/home/PostDetail';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()

function BottomTabBar() {
  return(
    <Tab.Navigator initialRouteName='Home' screenOptions={({route}) => ({
      headerShown: false,
      tabBarShowLabel : false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = '';

        if (route.name === 'Home') {
          iconName = focused
            ? 'home'
            : 'home-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        } else if (route.name === 'Search') {
          iconName = focused ? 'search' : 'search-outline'
        } else if (route.name === 'Notification') {
          iconName = focused ? 'notifications' : 'notifications-outline'
        }

        // You can return any component that you like here!
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })} >
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Search' component={SearchScreen} />
      <Tab.Screen name='Notification' component={Profile} />
      <Tab.Screen name='Profile' component={Profile} />
    </Tab.Navigator>
  )
}

function Auth() {
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  const token = useSelector((state : RootState) => state.auth.token)

  if(isLogin && token != null) {
    return (
      <Stack.Navigator initialRouteName='Index' screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name='Index' component={BottomTabBar} />
        <Stack.Screen name='EditProfile' component={EditProfile} />
        <Stack.Screen name='AddPost' component={AddPost} />
        <Stack.Screen name='UserProfile' component={UserProfile} />
        <Stack.Screen name='PostDetail' component={PostDetail} />
      </Stack.Navigator>
    )
  } else {
    return (
      <Stack.Navigator initialRouteName='Login' screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='Register' component={Register} />
      </Stack.Navigator>
    )
  }
}

let persistor = persistStore(store);

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <Auth />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default App;

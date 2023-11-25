import {
  StatusBar,
  Text,
  Image,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store';
import {useEffect, useState} from 'react';
import {
  Post,
  getPostByUserId,
  getPostMe,
  likePost,
  pagePlus,
  setPage,
} from '../../store/reducer/post/postSlice';
import {formatDistanceToNowStrict} from 'date-fns';
import { signout } from '../../store/reducer/auth/authSlice';

export default function Profile({navigation}: any) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const data = useSelector((state: RootState) => state.post.data);
  const isError = useSelector((state: RootState) => state.post.isError);
  const page = useSelector((state : RootState) => state.post.page)

  const [refreshing, setRefreshing] = useState(false);


  const getPost = () => {
    dispatch(
      getPostByUserId({
        token: token,
        id: user.id,
        page : page
      }),
    );
  };

  const refreshPage = () => {
    // setRefreshing(false)
    dispatch(
      setPage()
    )
    dispatch(
      getPostByUserId({
        token: token,
        id: user.id,
        page : page
      }),
    );
  }

  
  useEffect(() => {
    dispatch(setPage())
    dispatch(
      getPostByUserId({
        token: token,
        id: user.id,
        page : page
      }),
    );
    // refreshPage()
    console.log("update")
  }, [getPostByUserId, dispatch, token]);

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-2xl font-semibold">User Not Found</Text>
      </View>
    );
  }

  const renderItem = ({item}: {item: Post}) => (
    <View>
      <View className="w-full px-2 py-2 flex-row gap-4">
        <View>
          {user.profileImage != null ? (
            <Image
              source={{uri: `http:192.168.1.15:3000/${user.profileImage}`}}
              className="bg-contain h-14 w-14 rounded-full"
            />
          ) : (
            <Image
              source={require('../../assets/avatar.jpg')}
              className="bg-contain h-14 w-14 rounded-full"
            />
          )}
        </View>
        <View className="w-10/12">
          <View className="flex-row">
            <Text className="text-slate-900 font-semibold">{user.name} </Text>
            <Text>@{user.username}</Text>
            <Text>
              {' '}
              : {formatDistanceToNowStrict(new Date(item.createdAt))} ago
            </Text>
          </View>
          <Text className="text-left text-slate-900">{item.body}</Text>
          <View className="flex-row pt-2 gap-6">
            <View className="flex-row items-center">
              <Ionicons
                name={
                  item.likeIds.includes(user.id) ? 'heart' : 'heart-outline'
                }
                size={16}
                color={item.likeIds.includes(user.id) ? 'red' : 'black'}
                onPress={() => {
                  dispatch(
                    likePost({
                      token: token,
                      id: item.id,
                    }),
                  ).then(() => {
                    // getPost();
                    dispatch(
                      getPostByUserId({
                        token: token,
                        id: user.id,
                        page : page
                      }),
                    );
                  });
                }}
              />
              <Text> {item.likeIds.length}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="chatbubble-outline" size={16} color={'black'} />
              <Text> {item.comments.length}</Text>
            </View>
          </View>
        </View>
      </View>
      {/* hr */}
      <View className="border-b border-slate-100" />
    </View>
  );

  if (!isError) {
    return (
      <View className="bg-white flex-1 py-2">
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
        {!data ? (
          <Text>Not found</Text>
        ) : (
          <FlatList
            data={data.posts}
            renderItem={renderItem}
            keyExtractor={post => post.id}
            onEndReached={() => {
              dispatch(pagePlus())
              getPost()
            }}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={() => (
              <View className="flex-1 justify-center items-center">
                <Text className="mt-10 text-2xl font-semibold">
                  No post yet
                </Text>
              </View>
            )}
            ListHeaderComponent={() => (
              <View>
                <View className="w-full h-48">
                  {user.coverImage != null ? (
                    <Image
                      source={{
                        uri: `http:192.168.1.15:3000/${user.coverImage}`,
                      }}
                      className="bg-contain h-48 w-full"
                    />
                  ) : (
                    <Image
                      source={require('../../assets/bg.png')}
                      className="bg-contain h-48 w-full"
                    />
                  )}
                  <TouchableOpacity onPress={() => dispatch(signout())} className='absolute right-3 top-3 z-50'>
                    <Ionicons name='ellipsis-vertical-outline' size={24} color={'white'} />
                  </TouchableOpacity>
                </View>
                {/* avatar */}
                <View className="px-4 flex-row items-center justify-between">
                  {user.profileImage != null ? (
                    <Image
                      source={{
                        uri: `http:192.168.1.15:3000/${user.profileImage}`,
                      }}
                      className="bg-contain h-24 w-24 rounded-full -mt-12"
                    />
                  ) : (
                    <Image
                      source={require('../../assets/avatar.jpg')}
                      className="bg-contain h-24 w-24 rounded-full -mt-12"
                    />
                  )}
                  <Text
                    className="py-1 px-4 border-2 rounded-lg text-slate-800 font-bold"
                    onPress={() =>
                      navigation.navigate('EditProfile', {
                        screen: 'EditProfile',
                      })
                    }>
                    Edit Profile
                  </Text>
                </View>
                {/* section profile */}
                <View className="px-4 py-2">
                  <View className="pb-2">
                    {user.name != null ? (
                      <Text className="font-bold text-lg text-slate-900 capitalize">
                        {user.name}
                      </Text>
                    ) : (
                      <Text className="font-bold text-lg text-slate-900">
                        User@{user.username}
                      </Text>
                    )}
                    <Text className="text-sm text-slate-500">
                      @{user.username}
                    </Text>
                  </View>
                  <View className="pb-4">
                    <Text className="text-slate-800 text-base">{user.bio}</Text>
                  </View>
                  <View className="flex-row gap-4">
                    <Text>
                      <Text className="font-bold text-slate-900">
                        {user.followerIds.length}
                      </Text>{' '}
                      Followers
                    </Text>
                    <Text>
                      <Text className="font-bold text-slate-900">
                        {user.followingIds.length}
                      </Text>{' '}
                      Followings
                    </Text>
                  </View>
                </View>
                <View className="border-b border-slate-400 pt-1" />
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refreshPage} />
            }
          ListFooterComponent={() => (
            <View className='my-5 flex-1 justify-center items-center'>
            <Ionicons name="reload-outline" size={16} color={'black'} />
            </View>
          )}
          />
        )}
        <TouchableOpacity
          className="absolute right-4 bottom-4 bg-blue-600 w-12 h-12 rounded-full items-center justify-center"
          onPress={() => navigation.navigate('AddPost', {screen: 'AddPost'})}>
          <Ionicons name="add-outline" size={24} color={'white'} />
        </TouchableOpacity>
      </View>
    );
  }
}

import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AppDispatch, RootState} from '../../store';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import {Post, likePost} from '../../store/reducer/post/postSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {formatDistanceToNowStrict} from 'date-fns';
import { followUser, getUserData, unfollowUser } from '../../store/reducer/user/userSlice';

export default function UserProfile({navigation, route}: any) {
  const dispatch = useDispatch<AppDispatch>();

  const token = useSelector((state: RootState) => state.auth.token);
  const data = useSelector((state: RootState) => state.user.userData);
  const user = useSelector((state: RootState) => state.auth.user);

  const {screen, userId} = route.params;

  const followings = data.followerIds;

  useEffect(() => {
    dispatch(
      getUserData({
        token: token,
        id: userId,
        page: 1,
      }),
    ).then(() => {
        // refreshPage()
    })
  }, [dispatch, getUserData]);  

  const refreshPage = () => {
    dispatch(
        getUserData({
          token: token,
          id: userId,
          page: 1,
        }),
      );
  }

  const renderItem = ({item}: {item: Post}) => (
    <View>
      <View className="w-full px-2 py-2 flex-row gap-4">
        <View>
          {data.profileImage != null ? (
            <Image
              source={{uri: `http:192.168.1.15:3000/${data.profileImage}`}}
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
            <Text className="text-slate-900 font-semibold">{data.name} </Text>
            <Text>@{data.username}</Text>
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
                    // dispatch(
                    //   getPostByUserId({
                    //     token: token,
                    //     id: user.id,
                    //     page: page,
                    //   }),
                    // );
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      {!data ? (
        <Text>Not found</Text>
      ) : (
        <FlatList
          data={data.posts}
          renderItem={renderItem}
          keyExtractor={post => post.id}
          // onEndReached={() => {
          //   setPage(page+1)
          //   getPost()
          // }}
          // onEndReachedThreshold={0.2}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center">
              <Text className="mt-10 text-2xl font-semibold">No post yet</Text>
            </View>
          )}
          ListHeaderComponent={() => (
            <View>
              <View className="w-full h-48">
                {data.coverImage != null ? (
                  <Image
                    source={{
                      uri: `http:192.168.1.15:3000/${data.coverImage}`,
                    }}
                    className="bg-contain h-48 w-full"
                  />
                ) : (
                  <Image
                    source={require('../../assets/bg.png')}
                    className="bg-contain h-48 w-full"
                  />
                )}
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className="absolute left-3 top-3 z-50">
                  <Ionicons
                    name="arrow-back-outline"
                    size={24}
                    color={'white'}
                  />
                </TouchableOpacity>
              </View>
              {/* avatar */}
              <View className="px-4 flex-row items-center justify-between">
                {data.profileImage != null ? (
                  <Image
                    source={{
                      uri: `http:192.168.1.15:3000/${data.profileImage}`,
                    }}
                    className="bg-contain h-24 w-24 rounded-full -mt-12"
                  />
                ) : (
                  <Image
                    source={require('../../assets/avatar.jpg')}
                    className="bg-contain h-24 w-24 rounded-full -mt-12"
                  />
                )}
                {userId === user.id ? (
                  <Text
                    className="py-1 px-4 border-2 rounded-lg text-slate-800 font-bold"
                    onPress={() =>
                      navigation.navigate('EditProfile', {
                        screen: 'EditProfile',
                      })
                    }>
                    Edit Profile
                  </Text>
                ) : followings.includes(user.id) ? (
                  <Text
                    className="py-1 px-4 border-2 rounded-lg text-slate-800 font-bold"
                    onPress={() => {
                        dispatch(unfollowUser({
                            token : token,
                            username : data.username
                        })).then(() => {
                            refreshPage()
                        })
                    }}>
                    Following
                  </Text>
                ) : (
                  <Text
                    className="py-1 px-4 border-2 rounded-lg text-slate-800 font-bold"
                    onPress={() => {
                        dispatch(followUser({
                            token : token,
                            username : data.username
                        })).then(() => {
                            refreshPage()
                        })
                    }}>
                    Follow
                  </Text>
                )}
              </View>
              {/* section profile */}
              <View className="px-4 py-2">
                <View className="pb-2">
                  {data.name != null ? (
                    <Text className="font-bold text-lg text-slate-900 capitalize">
                      {data.name}
                    </Text>
                  ) : (
                    <Text className="font-bold text-lg text-slate-900">
                      User@{data.username}
                    </Text>
                  )}
                  <Text className="text-sm text-slate-500">
                    @{data.username}
                  </Text>
                </View>
                <View className="pb-4">
                  <Text className="text-slate-800 text-base">{data.bio}</Text>
                </View>
                <View className="flex-row gap-4">
                  <Text>
                    <Text className="font-bold text-slate-900">
                      {data.followerIds.length}
                    </Text>{' '}
                    Followers
                  </Text>
                  <Text>
                    <Text className="font-bold text-slate-900">
                      {data.followingIds.length}
                    </Text>{' '}
                    Followings
                  </Text>
                </View>
              </View>
              <View className="border-b border-slate-400 pt-1" />
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refreshPage} />
          }
          ListFooterComponent={() => (
            <View className="my-5 flex-1 justify-center items-center">
              {data.posts.length != 0 ? (
                <Ionicons name="reload-outline" size={16} color={'black'} />
              ) : (
                <View />
              )}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

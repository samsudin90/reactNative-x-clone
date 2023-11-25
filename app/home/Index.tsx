import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store';
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  PostFypDto,
  getPostFyp,
  likePost,
} from '../../store/reducer/post/postSlice';
import {SafeAreaView} from 'react-native-safe-area-context';
import {formatDistanceToNowStrict} from 'date-fns';
import { getMe } from '../../store/reducer/auth/authSlice';

function HomeScreen({navigation}: any) {
  const fyp = useSelector((state: RootState) => state.post.fyp);
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch<AppDispatch>();

  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(
      getPostFyp({
        token: token,
        page: page,
      }),
    );
    dispatch(
      getMe({token : token})
    )
  }, [dispatch, getPostFyp]);

  const getPost = () => {
    dispatch(getPostFyp({
      token : token,
      page : page
    }))
  }


  const renderItem = ({item}: {item: PostFypDto}) => (
    <View>
      <View className="w-full px-2 py-2 flex-row gap-4">
        <TouchableOpacity onPress={() => {
          navigation.navigate('UserProfile', {
            screen : 'UserProfile',
            userId : item.user.id
        })
        }}>
          {item.user.profileImage != null ? (
            <Image
              source={{uri: `http:192.168.1.15:3000/${item.user.profileImage}`}}
              className="bg-contain h-14 w-14 rounded-full"
            />
          ) : (
            <Image
              source={require('../../assets/avatar.jpg')}
              className="bg-contain h-14 w-14 rounded-full"
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          navigation.navigate('PostDetail', {
            postId : item.id
          })
        }} className="w-10/12">
          <View className="flex-row">
            <Text className="text-slate-900 font-semibold">
              {item.user.name}{' '}
            </Text>
            <Text>@{item.user.username}</Text>
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
                  item.likeIds.includes(user.id)
                    ? 'heart'
                    : 'heart-outline'
                }
                size={16}
                color={item.likeIds.includes(user.id) ? 'red' : 'black'}
                onPress={() => {
                  dispatch(
                    likePost({
                      token: token,
                      id: item.id,
                      page : 2
                    }),
                  )
                }}
              />
              <Text> {item.likeIds.length}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="chatbubble-outline" size={16} color={'black'} />
              <Text> {item.comments.length}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      {/* hr */}
      <View className="border-b border-slate-100" />
    </View>
  );

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      className="bg-white">
      <View className="items-center w-full justify-between flex-row px-4">
        {/* <Text className='my-3 text-xl text-black font-medium'>Nd</Text> */}
        <Text className="my-3 text-xl text-black font-medium">N</Text>
        <Ionicons name="chatbox-outline" size={22} color={'black'} />
      </View>
      <View className="border-b border-slate-200 w-full" />

      <FlatList
        data={fyp}
        keyExtractor={fyp => fyp.id}
        renderItem={renderItem}
        onEndReached={() => {
          console.log("dd")
          setPage(page+1)
          getPost()
        }}
        // onEndReachedThreshold={0.2}
        ListFooterComponent={() => (
          <View className='py-3 justify-center flex items-center'>
          <Ionicons name="reload-outline" size={16} color={'black'} />
          </View>
        )}
      />

      <TouchableOpacity
        className="absolute right-4 bottom-4 bg-blue-600 w-12 h-12 rounded-full items-center justify-center"
        onPress={() => navigation.navigate('AddPost', {screen: 'AddPost'})}>
        <Ionicons name="add-outline" size={24} color={'white'} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default HomeScreen;

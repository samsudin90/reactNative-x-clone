import {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store';
import {
  UserDto,
  comments,
  getPostById,
  postComment,
} from '../../store/reducer/post/postSlice';
import {formatDistanceToNowStrict} from 'date-fns';

export default function PostDetail({navigation, route}: any) {
  const {postId} = route.params;

  const dispatch = useDispatch<AppDispatch>();

  const token = useSelector((state: RootState) => state.auth.token);
  const postById = useSelector((state: RootState) => state.post.postById);
  const user = useSelector((state: RootState) => state.auth.user);

  const [coment, setComment] = useState('');

  useEffect(() => {
    dispatch(
      getPostById({
        token: token,
        id: postId,
      }),
    );
  }, [dispatch, getPostById]);

  const refresh = () => {
    dispatch(
        getPostById({
          token: token,
          id: postId,
        }),
      );
  }

  const renderItem = ({item}: {item: comments}) => {
    return (
      <View className="px-4 py-2 border-b border-slate-100">
        <View className="flex-row items-center gap-2">
          {item.user.profileImage != null ? (
            <Image
              source={{uri: `http:192.168.1.15:3000/${item.user.profileImage}`}}
              className="bg-contain h-12 w-12 rounded-full"
            />
          ) : (
            <Image
              source={require('../../assets/avatar.jpg')}
              className="bg-contain h-12 w-12 rounded-full"
            />
          )}
          <View>
            <Text className="text-slate-900 font-semibold capitalize">
              {item.user.name}
            </Text>
            <Text>@{item.user.username}</Text>
          </View>
        </View>
        <View className='flex-row items-center gap-2 w-full pr-10'>
            <View className='w-12'></View>
            <View className='w-full'>
                <Text className='text-slate-800 pb-2'>{item.body}</Text>
                <Text className='text-xs'>{formatDistanceToNowStrict(new Date(item.createdAt))} ago</Text>
            </View>
        </View>
      </View>
    );
  };

  const headerItem = (data: UserDto) => (
    <View className="px-4 py-2">
      <View className="flex-row items-center gap-2">
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
        <View>
          <Text className="text-slate-900 font-semibold capitalize">
            {data.name}
          </Text>
          <Text>@{data.username}</Text>
        </View>
      </View>

      <View className="py-2 border-b border-slate-100">
        <Text className="text-slate-800 text-base">{postById.body}</Text>
        <View className="pt-4">
          <Text>
            {formatDistanceToNowStrict(new Date(postById.createdAt))} ago
          </Text>
        </View>
      </View>

      <View className="py-2 border-b border-slate-100 flex-row gap-10">
        <Text>
          <Text className="font-bold text-slate-800">
            {postById.likeIds.length}
          </Text>{' '}
          Likes
        </Text>
        <Text>
          <Text className="font-bold text-slate-800">
            {postById.comments.length}
          </Text>{' '}
          Comments
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="border-b border-b-slate-200 py-2 px-4">
        <Ionicons
          name="arrow-back"
          size={24}
          color={'black'}
          onPress={() => navigation.goBack()}
        />
      </View>

      <FlatList
        data={postById.comments}
        keyExtractor={coment => coment.id}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View className="px-4">
            <Text>no comments yet</Text>
          </View>
        )}
        ListHeaderComponent={headerItem(postById.user)}
      />

      <View className="absolute bottom-0 w-full px-4 py-2 border-t border-slate-200">
        <Text className="font-medium pb-1 text-slate-800 italic">
          Replying to @{postById.user.username}
        </Text>
        <View className="">
          <TextInput
            multiline
            placeholder="some text"
            className="border-b py-0 border-slate-200 pr-12"
            onChangeText={text => setComment(text)}
            value={coment}
          />
          <Text
            className="absolute right-0 bottom-0 py-1 px-2 bg-blue-600 rounded-xl text-white"
            onPress={() => {
              if (coment === '') {
                console.log('isi dulu');
              } else {
                dispatch(postComment({
                    token : token,
                    postId : postById.id,
                    body : coment
                })).then(() => {
                    refresh()
                })
              }
              setComment('');
            }}>
            Send
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

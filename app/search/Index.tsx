import {useState} from 'react';
import {FlatList, Image, SafeAreaView, Text, TextInput, Touchable, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store';
import {UserDto, userSearch} from '../../store/reducer/post/postSlice';

export default function SearchScreen({navigation}: any) {
  const dispatch = useDispatch<AppDispatch>();

  const token = useSelector((state: RootState) => state.auth.token);
  const users = useSelector((state : RootState) => state.post.users) || []

  const [username, setUsername] = useState('');

  const search = () => {
    dispatch(
      userSearch({
        token: token,
        id: username,
      }),
    );
  };

//   console.log(users)

  const renderItem = ({item}: {item: UserDto}) => (
    <TouchableOpacity className='py-2 flex-row gap-3 items-center border-b border-slate-200' onPress={() => {
        navigation.navigate('UserProfile', {
            screen : 'UserProfile',
            userId : item.id
        })
    }}>
        {item.profileImage != null ? (
            <Image
              source={{uri: `http:192.168.1.15:3000/${item.profileImage}`}}
              className="bg-contain h-14 w-14 rounded-full"
            />
          ) : (
            <Image
              source={require('../../assets/avatar.jpg')}
              className="bg-contain h-14 w-14 rounded-full"
            />
          )}
          <View>
            <Text>{item.name || item.username}</Text>
            <Text>@{item.username}</Text>
          </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <View className="py-2">
        <TextInput
          placeholder="search N ..."
          className="border border-slate-400 px-4 rounded-lg"
          value={username}
          onChangeText={text => setUsername(text)}
          onSubmitEditing={search}
        />
      </View>
      <FlatList 
        data={users}
        keyExtractor={user => user.id}
        ListEmptyComponent={() => (
            <View>
                <Text>Not Found</Text>
            </View>
        )}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

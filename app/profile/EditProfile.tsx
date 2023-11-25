import {
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Platform,
  RefreshControl,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store';
import {useCallback, useEffect, useState} from 'react';
import {
  close,
  getMe,
  update,
  uploadCover,
  uploadProfile,
} from '../../store/reducer/auth/authSlice';
import {launchImageLibrary} from 'react-native-image-picker';

export default function EditProfile({navigation}: any) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const isError = useSelector((state: RootState) => state.auth.isError);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [cover, setCover] = useState();
  const [profile, setProfile] = useState();
  
  const handleChoosePhoto = (cc: boolean) => {
    const data = new FormData();
    launchImageLibrary(
      {mediaType: 'photo', includeBase64: false},
      (response: any) => {
        setCover(undefined)
        setProfile(undefined)
        if (response.didCancel) {
          setCover(undefined)
          setProfile(undefined)
          console.log('cancel')
        } else if (response.assets) {
          if (cc) {
            setCover(response);
          } else if (cc === false) {
            setProfile(response);
          }
        } else {
          console.log(response)
        }
      },
    ).then(() => {
      if (cc === true && cover !== undefined) {
        data.append('cover', {
          name: cover.assets[0].fileName,
          type: cover.assets[0].type,
          uri:
            Platform.OS === 'ios'
              ? cover.assets[0].uri.replace('file://', '')
              : cover.assets[0].uri,
        });
        data.append('token', token);
        dispatch(uploadCover(data));
      } else if (cc === false && profile !== undefined) {
        data.append('avatar', {
          name: profile.assets[0].fileName,
          type: profile.assets[0].type,
          uri:
            Platform.OS === 'ios'
              ? profile.assets[0].uri.replace('file://', '')
              : profile.assets[0].uri,
        });
        data.append('token', token);
        dispatch(uploadProfile(data));
      } else {
        console.log('gajadi');
        Alert.alert('something went wrong')
      }
    });
  };

  useEffect(() => {
    dispatch(getMe({token: token}));

  }, [dispatch, getMe]);

  if(isError) {
    Alert.alert('Error','Something went wrong', [
      {text : 'Ok', onPress() {
        dispatch(close())
      },}
    ])
  }

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-3xl font-semibold text-blue-600">Loading</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <View className="flex-row justify-between px-4 py-2 items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="flex-row gap-2 items-center">
          <Icon name="arrow-back-outline" size={24} color={'#2563eb'} />
          <Text className="text-blue-600 font-semibold">Back</Text>
        </TouchableOpacity>
        <Text
          className="text-blue-600 font-semibold"
          onPress={() => {
            const data = {
              name: name,
              bio: bio,
              token: token,
            };
            dispatch(update(data));
          }}>
          Save
        </Text>
      </View>
      {/* cover image */}
      <View className="w-full h-48">
        {user.coverImage != null ? (
          <TouchableOpacity
            onPress={() => {
              // console.log('press');
              handleChoosePhoto(true);
            }}>
            <ImageBackground
              source={{
                uri: `http:192.168.1.15:3000/${user.coverImage}`,
              }}
              className="h-48 w-full items-center"
              resizeMode="cover">
              <Text className="text-3xl font-bold text-blue-600 text-center mt-20">
                ss
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              // console.log('press');
              handleChoosePhoto(true)
            }}>
            <ImageBackground
              source={require('../../assets/bg.png')}
              className="h-48 w-full items-center"
              blurRadius={0.9}
              resizeMode="cover">
              <Text className="text-3xl font-bold text-blue-600 text-center mt-20">
                ss
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        )}
      </View>
      <View className="pb-4">
        {user.profileImage != null ? (
          <TouchableOpacity
            className="px-2"
            onPress={() => {
              handleChoosePhoto(false);
            }}>
            <ImageBackground
              source={{
                uri: `http:192.168.1.15:3000/${user.profileImage}`,
              }}
              className="h-24 w-24 rounded-full -mt-12"
              blurRadius={0.9}
              borderRadius={50}
              resizeMode="cover">
              <Text className="text-3xl font-bold text-blue-600 text-center mt-8">
                ss
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="px-2"
            onPress={() => {
              // console.log('press');
              handleChoosePhoto(false)
            }}>
            <ImageBackground
              source={require('../../assets/avatar.jpg')}
              className="h-24 w-24 rounded-full -mt-12"
              blurRadius={10}
              borderRadius={50}
              resizeMode="cover">
              <Text className="text-3xl font-bold text-blue-600 text-center mt-8">
                ss
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        )}
      </View>
      <View className="px-4">
        <TextInput
          value={name}
          onChangeText={text => setName(text)}
          placeholder="Name"
          className="border-b"
        />
        <TextInput
          value={bio}
          placeholder="Bio"
          onChangeText={text => setBio(text)}
          className="border-b"
        />
      </View>
    </SafeAreaView>
  );
}

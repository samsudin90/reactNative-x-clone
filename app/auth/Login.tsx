import {SafeAreaView, Text, View, TextInput} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {userLogin} from '../../store/reducer/auth/authSlice';
import {useState} from 'react';
import Svg, {Path} from 'react-native-svg';
import {AppDispatch, RootState} from '../../store';

function Login({navigation}: any) {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View className="pb-10">
        <Svg width={60} height={52} viewBox="0 0 53 44" fill="none">
          <Path
            d="M23.3 0l28.746 28.63V44H38.631v-9.845L17.752 13.361h-4.337V44H0V0h23.3zM38.63 15.27V0h13.415v15.27H38.631z"
            fill="#212326"
          />
        </Svg>
      </View>
      <View className="w-full px-8 pb-4">
        <TextInput
          className="border-2 border-slate-600 rounded-md px-4 py-2 w-full"
          placeholder="email"
          onChangeText={text => setEmail(text)}
          value={email}
        />
      </View>
      <View className="w-full px-8 pb-4">
        <TextInput
          className="border-2 border-slate-600 rounded-md px-4 py-2 w-full"
          placeholder="password"
          onChangeText={text => setPassword(text)}
          value={password}
          secureTextEntry
        />
      </View>
      <View className="w-full px-8 pb-2">
        {isLoading ? (
          <Text className="text-center py-2 text-white text-xl bg-blue-400 rounded-md shadow-md">
            Loading....
          </Text>
        ) : (
          <Text
            className="text-center py-2 text-white text-xl bg-blue-600 rounded-md shadow-md"
            onPress={() => {
              const data = {
                email,
                password,
              };
              dispatch(userLogin(data));
              setEmail('');
              setPassword('');
            }}>
            Sign In
          </Text>
        )}
      </View>
      <Text>
        Don't have an account?{' '}
        <Text
          className="text-blue-600"
          onPress={() => navigation.navigate('Register')}>
          Register
        </Text>
      </Text>
    </SafeAreaView>
  );
}

export default Login;

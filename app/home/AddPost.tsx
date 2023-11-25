import { useState } from "react";
import { Text, View, TouchableOpacity, TextInput } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { createPost } from "../../store/reducer/post/postSlice";

export default function AddPost({navigation} : any) {
    const [post, setPost] = useState('')
    
    const dispatch = useDispatch<AppDispatch>();
    const token = useSelector((state: RootState) => state.auth.token);
    const isLoading = useSelector((state: RootState) => state.post.isLoading);

    if(isLoading) {
        return (
            <View>
                <Text>Loading</Text>
            </View>
        )
    }

    return (
        <View className="bg-white flex-1 px-4 py-2">
            {/* atas */}
            <View className="justify-between items-center flex-row">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={24} color={'black'} />
                </TouchableOpacity>
                <Text className="py-1 px-2 bg-blue-600 text-white rounded-lg font-semibold" onPress={() => {
                    const status = {
                        token : token,
                        body : post
                    }
                    dispatch(createPost(status))
                    navigation.goBack()
                }} >Send</Text>
            </View>
            <TextInput multiline numberOfLines={10} placeholder="Apa yang sedang anda resahkan?" style={{textAlignVertical : 'top'}} onChangeText={(text) => setPost(text)} className="border my-3 rounded-lg px-2 shadow-md" />
        </View>
    )
}
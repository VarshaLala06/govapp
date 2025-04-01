import {SafeAreaView} from "react-native-safe-area-context";
import {Text, TouchableOpacity, View, ImageBackground, ScrollView} from "react-native";
import React from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome"; // Import FontAwesome

import {useGlobalContext} from "../../context/GlobalProvider";
import {images} from "../../constants";
import ComplaintTextField from "../../components/ComplaintTextField";


const Profile = () => {
    const {logout, user} = useGlobalContext();

    return (
        <ImageBackground source={images.emblem} resizeMode="contain" className="flex-1 justify-center items-center">
            {/* Overlay to reduce image opacity */}
            <View className="absolute top-0 left-0 w-full h-full bg-white/80"/>
            <SafeAreaView className="h-full w-full flex justify-center items-center px-4">
                <ScrollView className="w-full">
                    {/* Header Section with Logout Button */}
                    <View className="flex flex-row justify-end w-full p-5 mr-1">
                        <TouchableOpacity
                            onPress={logout}
                            className="flex-row items-center"
                        >
                            <FontAwesome name="sign-out" size={30} color="black"/>
                            <Text className="text-lg font-pbold ml-2">Logout</Text>
                        </TouchableOpacity>
                    </View>
                    <ComplaintTextField label='User Name' value={user.user_name}/>
                    <ComplaintTextField label='Department' value="{Department}"/>

                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
};

export default Profile;
import {StatusBar} from "expo-status-bar";
import {router} from "expo-router";
import {Image, ScrollView, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import {images} from "../constants";
import CustomButton from "../components/CustomButton";
import Notification from "./Notification";


const Welcome = () => {


    return (
        <SafeAreaView className="bg-primary h-full">


            <ScrollView
                contentContainerStyle={{
                    height: "100%",
                }}
            >
                <View className="w-full flex justify-center items-center h-full px-4">
                    <Image
                        source={images.emblem}
                        className="w-[380px] h-[298px]"
                        resizeMode="contain"
                    />

                    {/*<Image*/}
                    {/*    source={images.parvathipuramMap}*/}
                    {/*    className="max-w-[380px] mt-5 w-full h-[200px]"*/}
                    {/*    resizeMode="contain"*/}
                    {/*/>*/}

                    <View className="relative mt-5 items-center">
                        <Text
                            className="text-2xl text-secondary-100 font-pbold text-center justify-center">
                            Join the Digital Revolution{'\n'}
                            With
                        </Text>
                        <Text className="text-3xl font-pextrabold text-black mt-1">A.P Government</Text>
                    </View>

                    {/*<Text className="text-sm font-pregular text-gray-100 mt-7 text-center">*/}
                    {/*    Where Creativity Meets Innovation: Embark on a {"\n"}*/}
                    {/*    Journey of Limitless Exploration*/}
                    {/*</Text>*/}

                    <CustomButton
                        title="Log In Now!"
                        handlePress={() => router.push("/home")}
                        containerStyles="w-full mt-7 h-[64px] bg-blue-950"
                        textStyles="text-white font-psemibold text-xl"
                    />
                </View>
            </ScrollView>

            <StatusBar backgroundColor="#161622" style="light"/>
            {/*<Notification/>*/}
        </SafeAreaView>
    );
};

export default Welcome;
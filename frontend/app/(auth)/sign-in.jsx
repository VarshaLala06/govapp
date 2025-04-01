import {useState} from "react";
import {Link} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {Alert, Dimensions, Image, ScrollView, Text, View} from "react-native";

import {images} from "../../constants";

import {useGlobalContext} from "../../context/GlobalProvider";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";

const SignIn = () => {

    const [isSubmitting, setSubmitting] = useState(false);
    const {login} = useGlobalContext();
    const [form, setForm] = useState({
        username: "",
        password: "",
    });


    const submit = () => {
        if (form.username === "" || form.password === "") {
            Alert.alert("Error", "Please fill in all fields");
        }
        setSubmitting(true);
        login(form.username, form.password);
        setSubmitting(false);
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View
                    className="w-full flex justify-center items-center h-full px-4 my-6"
                    style={{
                        minHeight: Dimensions.get("window").height - 100,
                    }}
                >
                    <Image
                        source={images.emblem}
                        resizeMode="contain"
                        className="w-[200px] h-[200px] "
                    />

                    <Text className="text-3xl font-semibold text-black mt-5 font-psemibold">
                        User Login
                    </Text>

                    <FormField
                        title="Username"
                        placeholder="Username"
                        value={form.username}
                        handleChangeText={(u) => setForm({...form, username: u})}
                        otherStyles="mt-7"
                    />

                    <FormField
                        title="Password"
                        placeholder="Password"
                        value={form.password}
                        handleChangeText={(e) => setForm({...form, password: e})}
                        otherStyles="mt-7"
                    />

                    <CustomButton
                        title="Sign In"
                        handlePress={submit}
                        containerStyles="w-full mt-7 bg-blue-950"
                        isLoading={isSubmitting}
                    />

                    <View className="flex justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Don't have an account?
                        </Text>
                        <Link
                            href="/sign-up"
                            className="text-lg font-psemibold text-secondary"
                        >
                            Create One
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignIn;
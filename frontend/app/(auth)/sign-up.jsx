import {useState} from "react";
import {Link} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {Alert, Dimensions, Image, ScrollView, Text, View} from "react-native";

import {images} from "../../constants";
// import {CustomButton, FormField} from "../../components";
import {useGlobalContext} from "../../context/GlobalProvider";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import {register} from "../../lib/api";


const SignUp = () => {
    const {setUser, setIsLogged} = useGlobalContext();
    const {login, registerUser} = useGlobalContext();
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const submit = async () => {
        if (form.username === "" || form.password === "") {
            Alert.alert("Error", "Please fill in all fields");
        }
        try {
            setSubmitting(true);
            const usr = await register(form.username, form.password);
            if (usr === form.username) {
                Alert.alert("Success", "User registered successfully");
                login(form.username, form.password); // Automatically log in after sign up
            } else {
                Alert.alert("Error", "Unable to register user! Try Again");
            }
        } catch (error) {
            console.error("Sign Up error", error);
        } finally {
            setSubmitting(false);
        }

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
                        className="w-[200px] h-[200px]"
                    />

                    <Text className="text-2xl font-semibold text-black mt-10 font-psemibold">
                        Create an Account
                    </Text>

                    <FormField
                        title="Username"
                        value={form.username}
                        handleChangeText={(e) => setForm({...form, username: e})}
                        otherStyles="mt-10"
                    />

                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(e) => setForm({...form, password: e})}
                        otherStyles="mt-7"
                    />

                    <CustomButton
                        title="Sign Up"
                        handlePress={submit}
                        containerStyles="w-full mt-7 bg-blue-950"
                        isLoading={isSubmitting}
                    />

                    <View className="flex justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Have an account already?
                        </Text>
                        <Link
                            href="/sign-in"
                            className="text-lg font-psemibold text-secondary"
                        >
                            Login
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignUp;
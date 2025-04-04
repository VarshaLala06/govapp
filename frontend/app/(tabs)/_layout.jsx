import {StatusBar} from "expo-status-bar";
import {Redirect, Tabs} from "expo-router";
import {Image, Text, View} from "react-native";

import {icons} from "../../constants";

import {useGlobalContext} from "../../context/GlobalProvider";

const TabIcon = ({icon, color, name, focused}) => {
    return (
        <View className="flex-1 items-center justify-center gap-2 mb-[-50]">
            <Image
                source={icon}
                resizeMode="contain"
                tintColor={color}
                className="w-6 h-6"

            />
            <Text
                className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{fontSize: 12, width: '100%', textAlign: 'center', color: color}}
            >
                {name}
            </Text>
        </View>
    );
};

const TabLayout = () => {
    const {loading, isLogged} = useGlobalContext();

    if (!loading && !isLogged) return <Redirect href="/sign-in"/>;

    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: "#FFA001",
                    tabBarInactiveTintColor: "#CDCDE0",
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: "#161622",
                        borderTopWidth: 1,
                        borderTopColor: "#232533",
                        height: 84,
                    },
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: "Home",
                        headerShown: false,
                        tabBarIcon: ({color, focused}) => (
                            <TabIcon
                                icon={icons.home}
                                color={color}
                                name="Home"
                                focused={focused}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Profile",
                        headerShown: false,
                        tabBarIcon: ({color, focused}) => (
                            <TabIcon
                                icon={icons.profile}
                                color={color}
                                name="Profile"
                                focused={focused}
                            />
                        ),
                    }}
                />

            </Tabs>

            {/*<Loader isLoading={loading} />*/}
            <StatusBar backgroundColor="#161622" style="light"/>
        </>
    );
};

export default TabLayout;
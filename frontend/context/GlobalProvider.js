import React, {createContext, useContext, useEffect, useState} from "react";
import {Alert} from "react-native";
import {loginUser} from "../lib/api";
import {router} from "expo-router";


const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({children}) => {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const usr = await loginUser(username, password);
        if (usr.user_name === username) {
            setIsLogged(true);
            setUser(usr);
            Alert.alert("Success", "User signed in successfully");
            router.replace("/home");
        } else {
            Alert.alert("Error", "Invalid credentials");
        }
    };

    const logout = () => {
        setIsLogged(false);
        setUser(null);
        router.replace("/sign-in");
    };


    return (
        <GlobalContext.Provider
            value={{
                isLogged,
                setIsLogged,
                user,
                setUser,
                loading,
                login,
                logout

            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
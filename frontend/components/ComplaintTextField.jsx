import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";

const ComplaintTextField = ({label, value, extraStyles}) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <View className={`flex flex-row items-baseline ${extraStyles}`}>
            <Text className={`text-base font-pbold `}>{label}:</Text>
            {/*<Text className="text-base font-pregular ml-2 flex-shrink flex-grow break-words" ellipsizeMode="tail"*/}
            {/*      numberOfLines={2}>{value}</Text>*/}

            <Text
                className={`text-base font-pregular ml-2 flex-shrink flex-grow break-words `}
                ellipsizeMode={expanded ? "clip" : "tail"}
                numberOfLines={expanded ? undefined : 2}
            >
                {value}
            </Text>
            {value.length > 100 && (  // Adjust the character limit as needed
                <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                    <FontAwesome name={expanded ? "chevron-up" : "chevron-down"} size={16} color="blue"/>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default ComplaintTextField;
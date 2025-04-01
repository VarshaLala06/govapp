import React, {useEffect, useState} from 'react';
import {FlatList, ImageBackground, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRouter} from 'expo-router';
import {fetchPendingComplaints} from '../../lib/api';
import SearchInput from "../../components/SearchInput";
import {images} from "../../constants";
import {useGlobalContext} from "../../context/GlobalProvider";
import ComplaintTextField from "../../components/ComplaintTextField";

const Home = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [pendingComplaints, setPendingComplaints] = useState([]);
    const router = useRouter();
    const {user} = useGlobalContext();

    useEffect(() => {
        const getPendingComplaints = async () => {
            try {
                const complaintsData = await fetchPendingComplaints();
                console.log(complaintsData);
                setPendingComplaints(complaintsData);
            } catch (error) {
                console.error('Error fetching pending complaints:', error);
            }
        };

        getPendingComplaints();
    }, []);

    const handleComplaintPress = (complaintId) => {
        console.log(`pushing complaint/${complaintId}`);
        router.push(`/complaint/${complaintId}`);
    };

    const renderComplaintItem = ({item}) => (

        <TouchableOpacity onPress={() => handleComplaintPress(item.complaint_id)}>
            <View className={`p-4 mb-2 mt-2 rounded w-full ${
                item.status === "In Progress" ? "bg-blue-200" :
                    item.status === "Pending" ? "bg-red-200" : "bg-gray-200"
            }`}>
                <ComplaintTextField label='Complaint-Id' value={item.complaint_id}/>
                <ComplaintTextField label='Newspaper-Name' value={item.newspaper_name}/>
                <ComplaintTextField label='Status' value={item.status}/>
                <Text numberOfLines={2} ellipsizeMode="tail" className="break-words">
                    {item.issue_description}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (userDetails) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-primary">
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <ImageBackground source={images.emblem} resizeMode="contain" className="flex-1 justify-center items-center">
            {/* Add an overlay to reduce the image opacity */}
            <View className="absolute top-0 left-0 w-full h-full bg-white/80"/>

            <SafeAreaView className="flex-1 w-full px-4">
                <Text className="text-3xl text-center font-pbold p-4 mb-10">Welcome {"\n"} {user.user_name} </Text>

                <SearchInput/>
                <Text className="text-2xl text-center font-pbold mt-10">Pending
                    Complaints: {pendingComplaints.length}</Text>
                <FlatList
                    data={pendingComplaints}
                    renderItem={renderComplaintItem}
                    keyExtractor={(item) => `complaint-${item.complaint_id}`}
                    contentContainerStyle={{justifyContent: 'center', alignItems: 'left'}}
                    style={{width: '100%'}}
                />
            </SafeAreaView>
        </ImageBackground>
    );
};

export default Home;
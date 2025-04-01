import React, {useEffect, useState} from "react";
import {
    Alert,
    Button, Image,
    ImageBackground,
    Linking,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Picker} from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {fetchResolutionHistory, fetchComplaintDetails, updateResolutionDetails, uploadFiles} from '../../lib/api';
import ComplaintTextField from "../../components/ComplaintTextField";
import CustomButton from "../../components/CustomButton";
import {useRouter, useLocalSearchParams, router} from 'expo-router';
import {images} from "../../constants";
import History from "./History";


const Complaint = () => {
    const [complaintDetails, setComplaintDetails] = useState(null);
    const [status, setStatus] = useState("In Progress");
    const [actionDescription, setActionDescription] = useState("");
    const [resolutionDate, setResolutionDate] = useState(new Date());
    const [resolutionProofs, setResolutionProofs] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // State for resolution history modal
    const [historyModalVisible, setHistoryModalVisible] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const {id} = useLocalSearchParams();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await fetchComplaintDetails(id); // Replace with actual complaint ID
                setComplaintDetails(data);

                // Auto-fill resolution details if present
                if (data.status) {
                    setStatus(data.status);
                }
                if (data.action_taken) {
                    setActionDescription(data.action_taken);
                }
                if (data.resolution_date) {
                    setResolutionDate(new Date(data.resolution_date));
                }
                // if (data.resolution_proof_path) {
                //     setResolutionProofs(data.resolution_proof_path.split(',')); // Assuming paths are comma-separated
                // }
            } catch (error) {
                console.error("Error fetching complaint details:", error);
            }
        };

        fetchDetails();
    }, []);

    const handleAttachmentPress = () => {
        const url = 'https://outgoing-troll-neatly.ngrok-free.app/uploads/1742792987026_IMG-20250322-WA0003.jpg';

        // Debugging log
        console.log("Button pressed, attempting to open URL:", url);

        Linking.openURL(url)
            .catch(err => {
                console.error("Failed to open URL:", err);
                Alert.alert("Error", "Failed to open URL. Please try again later.");
            });
    };

    const handleFileUpload = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ["*/*", "image/*", "video/*"],
            multiple: true, // Enable multiple file selection
        });

        if (!result.cancelled) {
            const formData = new FormData();

            for (const doc of result.assets) {
                formData.append('files', {
                    uri: doc.uri,
                    name: doc.name,
                    type: doc.mimeType,
                });
            }

            try {
                const uploadedFiles = await uploadFiles(formData);
                setResolutionProofs([...resolutionProofs, ...uploadedFiles]);
                Alert.alert("Success", "Files uploaded successfully");
            } catch (error) {
                Alert.alert("Error", "Failed to upload files");
            }
        } else {
            Alert.alert("Error", "Please select a valid file");
        }
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || resolutionDate;
        setShowDatePicker(false);
        setResolutionDate(currentDate);
    };

    const handleSubmit = () => {
        if (!complaintDetails || !status || !actionDescription || !resolutionDate) {
            Alert.alert("Error", "Please fill in all the mandatory fields.");
            return;
        }

        // Ensure correct structure for resolution_proof_path
        const resolutionProofsArray = resolutionProofs.map(file => ({
            url: file.url || file.uri, // Ensure URL is correctly assigned
            name: file.name || "Unnamed File"
        }));

        console.log("Submitting resolution data:", JSON.stringify(resolutionProofsArray, null, 2));


        const resolutionData = {
            complaint_id: complaintDetails.complaint_id,
            resolution_id: complaintDetails.resolution_id,
            status,
            action_taken: actionDescription,
            resolution_date: resolutionDate,
            resolution_proof_path: resolutionProofsArray
        };

        updateResolutionDetails(resolutionData)
            .then(() => {
                Alert.alert("Success", "Resolution details submitted successfully");
                router.replace("/home")
            })
            .catch(error => {
                Alert.alert("Error", "Failed to submit resolution details");
            });
    };

    const getResolutionHistory = async () => {
        setLoadingHistory(true);
        setHistoryModalVisible(true);

        try {
            const response = await fetchResolutionHistory(complaintDetails.complaint_id); // ✅ Await the API response
            if (response && Array.isArray(response)) {
                setHistoryData(response); // ✅ Ensure it's an array before setting state
                console.log("Fetched History:", JSON.stringify(response, null, 2));
            } else {
                console.error("Unexpected response format:", response);
                Alert.alert("Error", "Invalid data received.");
            }
        } catch (error) {
            console.error("Error fetching history:", error.message);
            Alert.alert("Error", "Failed to fetch history");
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleRemoveAttachment = (index) => {
        const updatedProofs = resolutionProofs.filter((_, i) => i !== index);
        setResolutionProofs(updatedProofs);
    };

    if (!complaintDetails) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-primary">
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <ImageBackground source={images.flag}
                         resizeMode="cover"
                         className="flex-1 justify-center items-center">
            {/* Add an overlay to reduce the image opacity */}
            <View className="absolute top-0 left-0 w-full h-full bg-white/60"/>

            <SafeAreaView className="h-full w-full flex justify-center items-center px-4">
                <ScrollView className="w-full">
                    <View className="mb-4 mt-2 rounded-lg shadow-lg border-2 border p-2">
                        <Text
                            className="text-3xl text-center mt-3 mb-1 font-pextrabold p-2 text-black-700 ">Complaint
                            Details</Text>
                        <ComplaintTextField label='Complaint ID' value={complaintDetails.complaint_id}
                                            extraStyles={`mt-2`}/>
                        <ComplaintTextField label='Created Date'
                                            value={new Date(complaintDetails.created_at).toLocaleDateString()}
                                            extraStyles={`mt-2`}/>
                        <ComplaintTextField label='Newspaper Name' value={complaintDetails.newspaper_name}
                                            extraStyles={`mt-2`}/>
                        <ComplaintTextField label='Published Date'
                                            value={new Date(complaintDetails.publication_date).toLocaleDateString()}
                                            extraStyles={`mt-2`}/>
                        <ComplaintTextField label='Issue Category' value={complaintDetails.issue_category}
                                            extraStyles={`mt-2`}/>
                        <ComplaintTextField label='Issue Description' value={complaintDetails.issue_description}
                                            extraStyles={`mt-2`}/>
                        <View className="flex flex-row items-center mt-2 mb-1">
                            <Text className="text-base font-pbold">View File: </Text>
                            <CustomButton title="Newspaper Clipping" handlePress={handleAttachmentPress}
                                          containerStyles="ml-3 p-2"/>
                        </View>
                        <ComplaintTextField label='Deadline for Resolution' value={complaintDetails.deadline_dt}
                                            extraStyles={`mt-2`}/>
                    </View>

                    <View className="mb-4">
                        <View className="flex flex-row items-center justify-center">
                            <Text className="text-4xl mt-2 mr-2 font-pextrabold">Resolution</Text>

                            <TouchableOpacity
                                onPress={getResolutionHistory}
                                className="ml-2 p-2 flex-row items-center rounded-md bg-blue-500"
                            >
                                <FontAwesome name="history" size={16} color="white" className="mr-1"/>
                                <Text className="text-white ml-1">History</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex flex-row items-center mt-2 mb-4">
                            <Text className="text-base font-pbold mr-3"><Text
                                className="font-pbold text-red-600">*</Text>Status:</Text>
                            <View className="border w-[170px] h-7 justify-center">
                                <Picker
                                    selectedValue={status}
                                    onValueChange={(itemValue) => setStatus(itemValue)}
                                    itemStyle={{height: 40, fontSize: 16}}
                                >
                                    <Picker.Item label="In Progress" value="In Progress"/>
                                    <Picker.Item label="Pending" value="Pending"/>
                                    <Picker.Item label="Resolved" value="Resolved"/>
                                </Picker>
                            </View>
                        </View>

                        <Text className="text-base font-pbold justify-center"><Text
                            className="font-pbold text-red-600 mr-1">*</Text>Action
                            Taken Description:</Text>
                        <View className="flex flex-row items-center mb-2">
                            <View className="border border-gray-300 rounded-md flex-1 max-h-40">
                                <TextInput
                                    placeholder="Action Taken Description"
                                    value={actionDescription}
                                    onChangeText={setActionDescription}
                                    multiline
                                    textAlignVertical="top"
                                    className="p-2 h-[65]" // Increased height
                                    scrollEnabled
                                />
                            </View>
                        </View>

                        <Text className=" text-base font-pbold"><Text className="font-pbold text-red-600 mr-1">*</Text>Resolution
                            Date:</Text>
                        <View className="mb-4">
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                className="flex flex-row items-center border border-gray-300 rounded-md p-2 mt-2"
                            >
                                <Text
                                    className="flex-grow">{resolutionDate ? resolutionDate.toLocaleDateString() : "Select Date"}</Text>
                                <FontAwesome name="calendar" size={24} color="black"/>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={resolutionDate}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateChange}
                                />
                            )}
                        </View>

                        <View className="mb-4">
                            <Text className="text-base font-pbold mt-2"><Text
                                className="font-pbold text-red-600 mr-1">*</Text>Attachments:</Text>
                            <TouchableOpacity
                                onPress={handleFileUpload}
                                className="flex flex-row items-center border border-gray-300 rounded-md p-2 mt-2"
                            >
                                <FontAwesome name="paperclip" size={24} color="black"/>
                                <Text className="ml-2">Upload Resolution Proofs</Text>
                            </TouchableOpacity>
                            {resolutionProofs.length > 0 && (
                                <View className="mt-2 mb-4">
                                    {resolutionProofs.map((proof, index) => {
                                        const fileUrl = proof?.url;
                                        const isImage = fileUrl && fileUrl.match(/\.(jpeg|jpg|png|gif)$/i);
                                        return (
                                            <View key={index}
                                                  className="flex flex-col items-start mb-2 p-2 border rounded-md relative">
                                                {fileUrl ? (
                                                    isImage ? (
                                                        <TouchableOpacity onPress={() => Linking.openURL(fileUrl)}>
                                                            <Image source={{uri: fileUrl}}
                                                                   className="w-24 h-24 rounded-md border"
                                                                   resizeMode="contain"/>
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <TouchableOpacity onPress={() => Linking.openURL(fileUrl)}
                                                                          className="flex flex-row items-center">
                                                            <FontAwesome name="file" size={24} color="blue"/>
                                                            <Text className="ml-2 text-blue-600">View File</Text>
                                                        </TouchableOpacity>
                                                    )
                                                ) : (
                                                    <Text className="text-red-600">No file available</Text>
                                                )}
                                                <Text
                                                    className="mt-1 text-xs text-gray-600 break-words w-full">{proof?.name || "Unnamed File"}</Text>
                                                <TouchableOpacity onPress={() => handleRemoveAttachment(index)}
                                                                  className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                                    <FontAwesome name="trash" size={24} color="red"/>
                                                </TouchableOpacity>
                                            </View>
                                        );
                                    })}
                                </View>
                            )}


                        </View>

                        <CustomButton title="Submit" handlePress={handleSubmit}
                                      containerStyles="bg-blue-600 w-[100%] items-center ml-auto mr-auto"/>
                    </View>
                    <History
                        visible={historyModalVisible}
                        onClose={() => setHistoryModalVisible(false)}
                        historyData={historyData}
                        loading={loadingHistory}
                    />
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
};

export default Complaint;
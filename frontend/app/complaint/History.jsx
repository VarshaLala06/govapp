import React from "react";
import {
    Modal,
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    Linking
} from "react-native";
import ComplaintTextField from "../../components/ComplaintTextField";

const History = ({visible, onClose, historyData, loading}) => {
    // Function to determine if a URL is an image
    const isImage = (url) => {
        return /\.(jpeg|jpg|png|gif|bmp|webp)$/i.test(url);
    };

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white p-4 rounded-lg w-[90%] max-h-[80%]">
                    <Text className="text-xl font-bold mb-2">Resolution History</Text>

                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff"/>
                    ) : historyData.length > 0 ? (
                        <ScrollView className="max-h-[70%]">
                            {historyData.map((item, index) => {
                                let proofFiles = [];

                                // Parse the proof file paths if they exist
                                if (item.resolution_proof_path) {
                                    try {
                                        proofFiles = JSON.parse(item.resolution_proof_path);
                                    } catch (error) {
                                        console.error("Error parsing resolution_proof_path:", error);
                                    }
                                }

                                return (
                                    <View key={index} className="p-2 border-b border-gray-300">
                                        <ComplaintTextField label='Status' value={item.status}/>

                                        {item.action_taken &&
                                            <ComplaintTextField label='Action' value={item.action_taken}/>}

                                        <ComplaintTextField label='Resolution Date'
                                                            value={item.resolution_date ? new Date(item.resolution_date).toLocaleString() : "N/A"}/>

                                        <ComplaintTextField label='Updated At'
                                                            value={item.updated_at ? new Date(item.updated_at).toLocaleString() : "N/A"}/>

                                        {/* Display Proof Files */}
                                        {proofFiles.length > 0 && (
                                            <View className="mt-2">
                                                <Text className="text-base font-bold">Proof:</Text>
                                                <View className="flex flex-wrap flex-row gap-2 mt-1">
                                                    {proofFiles.map((file, fileIndex) => (
                                                        <View key={fileIndex} className="">
                                                            {isImage(file.url) ? (
                                                                <TouchableOpacity
                                                                    onPress={() => Linking.openURL(file.url)}
                                                                    className="p-1"
                                                                >
                                                                    <Image
                                                                        source={{uri: file.url}}
                                                                        style={{
                                                                            width: 100,
                                                                            height: 100,
                                                                            borderRadius: 8
                                                                        }}
                                                                        resizeMode="contain"
                                                                    />
                                                                </TouchableOpacity>
                                                            ) : (
                                                                <TouchableOpacity
                                                                    onPress={() => Linking.openURL(file.url)}
                                                                    className="bg-blue-500 px-2 py-1 rounded-md"
                                                                >
                                                                    <Text className="text-white text-sm">View
                                                                        File</Text>
                                                                </TouchableOpacity>
                                                            )}
                                                        </View>
                                                    ))}
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </ScrollView>
                    ) : (
                        <Text>No resolution history available.</Text>
                    )}

                    <TouchableOpacity onPress={onClose} className="bg-red-500 mt-4 p-2 rounded-md">
                        <Text className="text-white text-center">Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default History;

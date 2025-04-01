import React, {useEffect, useState, useRef} from 'react';
import * as Notifications from 'expo-notifications';
import {Platform, View, Text} from 'react-native';
import Constants from 'expo-constants';
import {router} from 'expo-router';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default function Notification() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [channels, setChannels] = useState([]);
    const notificationListener = useRef();
    const responseListener = useRef();
    const ws = useRef(null);

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

        if (Platform.OS === 'android') {
            Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
        }

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification received:', notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Notification response received:', JSON.stringify(response, null, 2));

            try {
                const data = response.notification.request.content.data;
                if (data && typeof data === 'object' && data.complaintId) {
                    console.log(`Navigating to: /complaint/${data.complaintId}`);
                    setTimeout(() => {
                        router.push(`/complaint/${data.complaintId}`);
                    }, 500); // Delay to ensure app is ready
                } else {
                    console.error("Invalid data format:", data);
                }
            } catch (error) {
                console.error("Error handling notification response:", error);
            }
        });

        ws.current = new WebSocket('wss://outgoing-troll-neatly.ngrok-free.app');

        ws.current.onopen = () => {
            console.log('WebSocket connection opened');
        };

        ws.current.onmessage = (e) => {
            try {
                const notification = JSON.parse(e.data);
                console.log(`Received Notification: ${JSON.stringify(notification, null, 2)}`);

                if (notification.complaintId) {
                    schedulePushNotification({
                        title: "New Complaint",
                        body: `New complaint received: ${notification.complaintId}`,
                        data: {complaintId: notification.complaintId},
                    });
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        ws.current.onerror = (e) => {
            console.error('WebSocket error:', e.message);
        };

        ws.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
            notificationListener.current &&
            Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return null;
}

async function schedulePushNotification(content) {
    await Notifications.scheduleNotificationAsync({
        content,
        trigger: {seconds: 2, repeats: false},
    });
}

async function registerForPushNotificationsAsync() {
    let token;
    if (!Constants.isDevice) {
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Expo Push Token:', token);
    } else {
        alert('Must use a physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}

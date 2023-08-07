import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';

import { customStyle as styles } from "../styles";
const entriesJSON = require('../savedEntries.json')

const projectId = Constants.expoConfig.extra.eas.projectId;
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

export default function App() {
	const notificationListener = useRef();
	const responseListener = useRef();
	const [entries, setEntries] = useState([])

	useEffect(() => {
		registerForPushNotificationsAsync()

		notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
			console.log("NOTIFICATION", notification);
		});

		responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
			console.log("RESPONSE", response);
		});

		loadSavedEntries()

		return () => {
			Notifications.removeNotificationSubscription(notificationListener.current);
			Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);

	async function loadSavedEntries() {
		try {
			const parsedData = JSON.parse(JSON.stringify(entriesJSON));
			setEntries(parsedData);
		} catch (error) {
			console.error('Error reading or parsing JSON:', error);
		}
	}

	async function registerForPushNotificationsAsync() {
		let token;

		if (Platform.OS === "android") {
			Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				sound: true,
				lightColor: "#FF231F7C",
				lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
				bypassDnd: true,
			});

			const { status: existingStatus } = await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;
			if (existingStatus !== "granted") {
				const { status } = await Notifications.requestPermissionsAsync();
				finalStatus = status;
			}
			if (finalStatus !== "granted") {
				alert("Failed to get push token for push notification!");
				return;
			}
			token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
		}

		return token;
	}

	async function cancelNotification(notifId) {
		await Notifications.cancelScheduledNotificationAsync(notifId);
	}

	return (
		<>
			<ScrollView style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#ffffef" }}>

				<View style={{ backgroundColor: "#ffffaf", borderRadius: 10, padding: 10 }}>
					<Text style={{ textAlign: "center", fontWeight: "bold" }}>Alarmas Programadas</Text>

					<View style={styles.container}>
						<View style={styles.tableRow}>
							<Text style={styles.headerCell}>Granja</Text>
							<Text style={styles.headerCell}>Entrada</Text>
							<Text style={styles.headerCell}>Alarmas</Text>
						</View>
						{entries.map(item => (
							<View style={styles.tableRow} key={item.granja + item.entrada}>
								<Text style={styles.dataCell}>{item.granja}</Text>
								<Text style={styles.dataCell}>{item.entrada}</Text>
								<Text style={styles.dataCell}>---</Text>
							</View>
						))}
					</View>
				</View>

				<Text style={{ marginVertical: 40, textAlign: "right" }}>v.0.4</Text>
			</ScrollView>

		</>
	);
};
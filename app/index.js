import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';
import { deleteAllEntries, loadEntries } from '../src/StorageManager';

import { TouchableOpacity } from 'react-native-gesture-handler';
import Button from '../src/Button';
import { timestampToLocalString } from '../src/DateManager';
import { customStyle as styles } from "../styles";

const projectId = Constants.expoConfig.extra.eas.projectId;
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

export default function MainScreen() {
	const navigation = useNavigation();

	const notificationListener = useRef();
	const responseListener = useRef();
	const [entries, setEntries] = useState([])

	const [commitDeleteEntries, setCommitDeleteEntries] = useState(false)

	useEffect(() => {
		registerForPushNotificationsAsync()

		notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
			console.log("NOTIFICATION RECEIVED");
		});

		responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
			console.log("RESPONSE RECEIVED FROM NOTIFICATION");
		});

		onFetchUpdateAsync()

		return () => {
			Notifications.removeNotificationSubscription(notificationListener.current);
			Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);


	async function onFetchUpdateAsync() {
		try {
			const update = await Updates.checkForUpdateAsync();

			if (update.isAvailable) {
				await Updates.fetchUpdateAsync();
				await Updates.reloadAsync();
			}
		} catch (error) { }
	}

	useFocusEffect(useCallback(() => {
		setCommitDeleteEntries(false)
		loadEntries().then(entries => {
			if (entries !== null) {
				setEntries(entries.reverse())
			} else {
				setEntries([])
			}
		})
	}, []))


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

	function handleDeleteAllAlarms() {
		if (commitDeleteEntries) {
			deleteAllEntries()
			Notifications.cancelAllScheduledNotificationsAsync()

			loadEntries().then(entries => {
				if (entries !== null) {
					setEntries(entries)
				} else {
					setEntries([])
				}
			})
		}
		setCommitDeleteEntries(!commitDeleteEntries)

	}

	return (
		<>
			<ScrollView style={{ paddingHorizontal: 20, backgroundColor: "#ffffef" }}>

				<View style={{ backgroundColor: "#ffffaf", borderRadius: 10, marginVertical: 20 }}>
					<View style={styles.container}>
						<View style={styles.tableRow}>
							<Text style={styles.headerCell}>Granja</Text>
							<Text style={styles.headerCell}>Entrada</Text>
							<Text style={styles.headerCell}>Alarmas</Text>
						</View>
						{entries?.map(item => (
							<TouchableOpacity
								style={[styles.tableRow, {}]}
								key={item.granja + item.entrada}
								onPress={() => navigation.navigate("Modal", { granja: item.granja, entrada: item.entrada })}>
								<Text style={styles.dataCell}>{item.granja}</Text>
								<Text style={styles.dataCell}>{timestampToLocalString(item.entrada)}</Text>
								<Text style={styles.dataCell}>{item.alarms.length} </Text>
							</TouchableOpacity>
						))}
					</View>
				</View>

				<Button
					onPress={handleDeleteAllAlarms}
					title={commitDeleteEntries == false ? "Borrar" : "Seguro?"}>
				</Button>
				<Text style={{ marginVertical: 20, textAlign: "right" }}>v.0.11</Text>

			</ScrollView>
		</>
	);
};
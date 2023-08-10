import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Button from '../src/Button';
import { timestampToLocalString } from '../src/DateManager';
import { completeAlarm, getEntry } from '../src/StorageManager';
import * as Notifications from 'expo-notifications';


const good = "green"
const mid = "#FFA07A"
const bad = "#FF6347"


export default function DetailScreen(props) {
	var navigation = useNavigation()
	const [entry, setEntry] = useState(null)

	useFocusEffect(useCallback(() => {
		loadEntry()
		return () => setEntry(null)
	}, []))


	function loadEntry() {
		getEntry(props.route.params.granja, props.route.params.entrada).then((entry) => {
			setEntry(entry)
		})
	}

	function handleCompleteAlarm(notification_id) {
		cancelNotification(notification_id)
		completeAlarm(notification_id).then(() => {
			loadEntry()
		})
	}

	function decideColor(alarm) {
		var triggers_at = new Date(alarm.triggers_at)
		var today = new Date()

		if (alarm.completed == true) {
			return good
		} else if (alarm.completed == false && triggers_at > today) {
			return mid
		} else if (alarm.completed == false && triggers_at < today) {
			return mid
		}
	}

	async function cancelNotification(notifId) {
		await Notifications.cancelScheduledNotificationAsync(notifId);
	}

	return (
		<ScrollView style={{ margin: 20 }}>
			{entry !== null &&
				<>
					<View style={{ flexDirection: "row" }}>
						<View style={{ backgroundColor: good, height: 20, width: 20 }}></View>
						<Text style={{ marginLeft: 5 }}>Ha saltado la alarma y se ha completado</Text>
					</View>
					<View style={{ flexDirection: "row" }}>
						<View style={{ backgroundColor: mid, height: 20, width: 20 }}></View>
						<Text style={{ marginLeft: 5 }}>NO ha saltado la alarma y NO se ha completado</Text>
					</View>
					<View style={{ flexDirection: "row" }}>
						<View style={{ backgroundColor: bad, height: 20, width: 20 }}></View>
						<Text style={{ marginLeft: 5 }}>Ha saltado la alarma y NO se ha completado</Text>
					</View>

					<Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 10 }}>{entry.granja}</Text>
					<Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>{timestampToLocalString(entry.entrada)}</Text>

					{entry?.alarms.map(item => (
						<View key={item.notification_id} style={{ backgroundColor: decideColor(item), padding: 10, marginBottom: 10, borderRadius: 10 }}>
							<Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.name}</Text>
							<Text style={{ fontWeight: "bold" }}>Para el {timestampToLocalString(item.triggers_at)}, a los {item.days} dias de la entrada</Text>
							<Text>{item.description}</Text>
							<View style={{ flexDirection: "row" }}>
								<Button onPress={() => handleCompleteAlarm(item.notification_id)} title="Completar"></Button>
							</View>
						</View>
					))}

					<Button onPress={() => navigation.navigate("Main")} title="Atrás"></Button>
				</>
			}

		</ScrollView>
	);
}

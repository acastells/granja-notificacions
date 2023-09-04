import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Button from '../src/Button';
import { MULTIPLIER_SECS_TO_DAYS, timestampToLocalString } from '../src/DateManager';
import { completeAlarm, descompleteAlarm, getEntry } from '../src/StorageManager';


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

	async function handleDescompleteAlarm(alarm) {
		var old_notification_id = alarm.notification_id
		var new_notification_id = await Notifications.scheduleNotificationAsync({
			content: {
				title: alarm.name + " a " + entry.granja,
				body: alarm.description
			},
			trigger: { seconds: alarm.days * MULTIPLIER_SECS_TO_DAYS },
			repeats: true
		});
		descompleteAlarm(old_notification_id, new_notification_id).then(() => {
			loadEntry()
		})
	}

	function handleCompleteAlarm(alarm) {
		cancelNotification(alarm.notification_id)
		completeAlarm(alarm.notification_id).then(() => {
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
			return bad
		}
	}

	async function cancelNotification(notifId) {
		await Notifications.cancelScheduledNotificationAsync(notifId);
	}

	return (
		<ScrollView style={{ paddingHorizontal: 20, paddingVertical: 20, backgroundColor: "#ffffef" }}>
			{entry !== null &&
				<>
					<View style={{ flexDirection: "row" }}>
						<View style={{ backgroundColor: good, height: 20, width: 20 }}></View>
						<Text style={{ marginLeft: 5 }}>Alarma completada</Text>
					</View>
					<View style={{ flexDirection: "row" }}>
						<View style={{ backgroundColor: mid, height: 20, width: 20 }}></View>
						<Text style={{ marginLeft: 5 }}>NO ha saltado la alarma y NO se ha completado</Text>
					</View>
					<View style={{ flexDirection: "row" }}>
						<View style={{ backgroundColor: bad, height: 20, width: 20 }}></View>
						<Text style={{ marginLeft: 5 }}>SI ha saltado la alarma y NO se ha completado</Text>
					</View>

					<Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 10 }}>{entry.granja}</Text>
					<Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>{timestampToLocalString(entry.entrada)}</Text>

					{entry?.alarms.map(item => (
						<View key={item.notification_id} style={{ backgroundColor: decideColor(item), padding: 10, marginBottom: 10, borderRadius: 10 }}>
							<Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.name}</Text>
							<Text style={{ fontWeight: "bold" }}>Para el {timestampToLocalString(item.triggers_at)}, a los {item.days} dias de la entrada</Text>
							<Text>{item.description}</Text>
							<View style={{ flexDirection: "row" }}>
								{item.completed === true ?
									<Button onPress={() => handleDescompleteAlarm(item)} title="Descompletar"></Button>
									:
									<Button onPress={() => handleCompleteAlarm(item)} title="Completar"></Button>
								}
							</View>
						</View>
					))}

					<Button onPress={() => navigation.navigate("Main")} title="Atrás"></Button>
					<View style={{ height: 30 }}></View>
				</>
			}

		</ScrollView>
	);
}

import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Button from '../src/Button';
import { completeAlarm, getEntry } from '../src/StorageManager';

export default function Modal() {
	const local = useLocalSearchParams();

	const [entry, setEntry] = useState(null)

	const good = "green"
	const mid = "#FFA07A"
	const bad = "#FF6347"
	const unknown = "grey"

	useFocusEffect(useCallback(() => {
		loadEntry()
		return () => setEntry(null)
	}, []))


	function loadEntry() {
		getEntry(local.granja, local.entrada).then((entry) => {
			setEntry(entry)
		})
	}

	function handleCompleteAlarm(notification_id) {
		completeAlarm(notification_id).then(() => {
			loadEntry()
		})
	}

	function decideColor(alarm) {
		var triggers_at = new Date(alarm.triggers_at)
		var today = new Date()

		console.log("triggers at", triggers_at)
		console.log("today", today)

		if (alarm.completed == true && triggers_at < today) {
			return good
		} else if (alarm.completed == false && triggers_at < today) {
			return mid
		} else if (alarm.completed == false && triggers_at > today) {
			return bad
		} else {
			return unknown
		}
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
						<Text style={{ marginLeft: 5 }}>Ha saltado la alarma y NO se ha completado</Text>
					</View>
					<View style={{ flexDirection: "row" }}>
						<View style={{ backgroundColor: bad, height: 20, width: 20 }}></View>
						<Text style={{ marginLeft: 5 }}>NO ha saltado la alarma y NO se ha completado</Text>
					</View>

					<Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 10 }}>{entry?.granja}</Text>
					<Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>{entry?.entrada}</Text>

					{entry?.alarms.map(item => (
						<View key={item.notification_id} style={{ backgroundColor: decideColor(item), padding: 10, marginBottom: 10, borderRadius: 10 }}>
							<Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.name}</Text>
							<Text style={{ fontWeight: "bold" }}>Para el {item.triggers_at}, a los {item.days} dias de la entrada</Text>
							<Text>{item.description}</Text>
							<View style={{ flexDirection: "row" }}>
								<Button onPress={() => handleCompleteAlarm(item.notification_id)} title="Completar"></Button>
							</View>
						</View>
					))}

					<Button onPress={() => router.push("/")} title="Atrás"></Button>
				</>
			}

		</ScrollView>
	);
}

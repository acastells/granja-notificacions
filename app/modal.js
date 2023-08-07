import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useState, useCallback } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Button from '../src/Button';
import { getEntry } from '../src/StorageManager';

export default function Modal() {
	const local = useLocalSearchParams();

	const [entry, setEntry] = useState(null)

	useFocusEffect(useCallback(() => {
		getEntry(local.granja, local.entrada).then((entry) => {
			setEntry(entry)
		})
	}))

	return (
		<ScrollView style={{ padding: 20 }}>
			{entry !== null &&
				<>
					<Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center" }}>{entry.granja}</Text>
					<Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center" }}>{new Date(entry.entrada).toLocaleDateString()}</Text>
					{entry.alarms?.map(item => (
						<View key={item.name} style={{ backgroundColor: "grey", padding: 10, marginVertical: 5, borderRadius: 10 }}>
							<Text>{item.name}</Text>
							<Text>{item.description}</Text>
							<Text>{item.days}</Text>
							<Text>{item.triggers_at}</Text>
							<Text>{item.notification_id}</Text>
						</View>
					))}
				</>
			}



			<Button onPress={() => router.push("/")} title="Atrás"></Button>
		</ScrollView>
	);
}

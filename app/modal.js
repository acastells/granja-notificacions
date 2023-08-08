import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
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

		return () => setEntry(null)
	}, []))

	return (
		<ScrollView style={{ margin: 20 }}>
			{entry !== null &&
				<>
					<Button onPress={() => router.push("/")} title="Atrás"></Button>
					<Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 10 }}>{entry.granja}</Text>
					<Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>{new Date(entry.entrada).toLocaleDateString()}</Text>
					{entry.alarms?.map(item => (
						<View key={item.notification_id} style={{ backgroundColor: "grey", padding: 10, marginBottom: 10, borderRadius: 10 }}>
							<Text>{item.name}</Text>
							<Text>{item.description}</Text>
							<Text>{item.days}</Text>
							<Text>{item.triggers_at}</Text>
							<Text>{item.notification_id}</Text>
							<Text>{item.completed}</Text>
						</View>
					))}

					<Button onPress={() => router.push("/")} title="Atrás"></Button>
				</>
			}

		</ScrollView>
	);
}

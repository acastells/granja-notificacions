import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loadEntries() {
	try {
		const jsonValue = await AsyncStorage.getItem('entries_json');
		return jsonValue != null ? JSON.parse(jsonValue) : [];
	} catch (e) {
		console.error(e)
	}
}

export async function saveEntry(newEntry) {
	try {
		var jsonValue = await AsyncStorage.getItem('entries_json');
		var entries = jsonValue != null ? JSON.parse(jsonValue) : [];

		// append alarms if existing
		var existing = false
		for (var entry of entries) {
			if (entry.granja == newEntry.granja && entry.entrada == newEntry.entrada) {
				entry.alarms = entry.alarms.concat(newEntry.alarms)
				existing = true
				break
			}
		}

		// save entry if it does not exist
		if (!existing) {
			entries.push(newEntry)
		}

		entries = JSON.stringify(entries);
		await AsyncStorage.setItem('entries_json', entries);

	} catch (e) {
		console.error(e)
	}
}

export async function getEntry(granja, entrada) {
	const jsonValue = await AsyncStorage.getItem('entries_json');
	if (jsonValue != null) {
		var entries = JSON.parse(jsonValue)
		var filtered_entries = entries.filter((entry) => entry.granja == granja && entry.entrada == entrada)
		var first_entry = filtered_entries[0]
		return first_entry
	} else {
		return null
	}
}

export async function deleteAllEntries() {
	try {
		await AsyncStorage.clear();
		const jsonValue = JSON.stringify([]);
		await AsyncStorage.setItem('entries_json', jsonValue);
	} catch (e) {
		console.error(e)
	}
}

export async function getExistentGranjas() {
	try {
		var jsonValue = await AsyncStorage.getItem('entries_json');
		var entries = jsonValue != null ? JSON.parse(jsonValue) : [];
		var granjas = []
		for (var entry of entries) {
			if (!(granjas.includes(entry.granja))) {
				granjas.push(entry.granja)
			}
		}
		return granjas
	} catch (e) {
		console.error(e)
	}
}

export async function completeAlarm(notification_id) {
	try {
		const jsonValue = await AsyncStorage.getItem('entries_json');
		var entries = JSON.parse(jsonValue)
		for (var entry of entries) {
			for (var alarm of entry.alarms) {
				if (alarm.notification_id === notification_id) {
					alarm.completed = true
					break
				}
			}
		}

		entries = JSON.stringify(entries);
		await AsyncStorage.setItem('entries_json', entries);
	} catch (e) {
		console.error(e)
	}
}
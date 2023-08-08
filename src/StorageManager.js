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
		var json_dict = jsonValue != null ? JSON.parse(jsonValue) : [];
		json_dict.push(newEntry)
		jsonValue = JSON.stringify(json_dict);
		await AsyncStorage.setItem('entries_json', jsonValue);
	} catch (e) {
		console.error(e)
	}
}

export async function getEntry(granja, entrada) {
	const jsonValue = await AsyncStorage.getItem('entries_json');
	if (jsonValue != null) {
		var entries = JSON.parse(jsonValue)
		return entries.filter((entry) => entry.granja == granja && entry.entrada == entrada)[0]
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
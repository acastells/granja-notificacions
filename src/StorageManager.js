import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loadEntries() {
	try {
		const jsonValue = await AsyncStorage.getItem('entries_json');
		return jsonValue != null ? JSON.parse(jsonValue) : null;
	} catch (e) {
		console.error(e)
		return null
	}
}

export async function saveEntries(value) {
	try {
		const jsonValue = JSON.stringify(value);
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
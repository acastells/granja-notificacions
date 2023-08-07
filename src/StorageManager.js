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
import { StyleSheet } from 'react-native';

export const customStyle = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 10,
		textAlign: "center"
	},
	tableRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		textAlign: "center",
		paddingBottom: 20
	},
	headerCell: {
		fontWeight: 'bold',
		flex: 1,
		justifyContent: 'center',
		textAlign: "center",
	},
	dataCell: {
		flex: 1,
		justifyContent: 'center',
		textAlign: "center",
	},
});
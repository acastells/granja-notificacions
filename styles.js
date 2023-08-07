import { StyleSheet } from 'react-native';

export const customStyle = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 8,
	},
	tableRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	headerCell: {
		fontWeight: 'bold',
		flex: 1,
		marginRight: 8,
		textAlign:"center"
	},
	dataCell: {
		flex: 1,
		marginRight: 8,
		textAlign:"center"
	},
});
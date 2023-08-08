import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function LittleButton(props) {
	const { onPress, title = 'NO TITLE' } = props;
	return (
		<TouchableOpacity style={styles.button} onPress={onPress}>
			<Text style={styles.text}>{title}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		minWidth: 20,
		height: 20,
		paddingHorizontal:5,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 100,
		backgroundColor: 'orange',
		alignSelf: "center",
		marginHorizontal: 10
	},
	text: {
		fontSize: 10,
		fontWeight: 'bold',
		color: 'white',
	},
});

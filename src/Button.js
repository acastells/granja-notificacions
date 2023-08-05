import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Button(props) {
	const { onPress, title = 'Save' } = props;
	return (
		<TouchableOpacity style={styles.button} onPress={onPress}>
			<Text style={styles.text}>{title}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 10,
		paddingHorizontal: 10,
		borderRadius: 10,
		backgroundColor: 'black',
		flex:1,
		width:"100%"
	},
	text: {
		fontSize: 14,
		lineHeight: 18,
		fontWeight: 'bold',
		letterSpacing: 0.25,
		color: 'white',
	},
});

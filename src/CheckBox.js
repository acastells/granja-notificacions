import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';

export function Checkbox(props) {
	return (
		<TouchableOpacity
			style={[styles.checkboxBase, props.checked && styles.checkboxChecked]}
			onPress={props.onPress}>
			{props.checked && <Ionicons name="checkmark" size={24} color="white" />}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	checkboxBase: {
		width: 30,
		height: 30,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: 'coral',
		backgroundColor: 'coral',
	},
	checkboxChecked: {
		backgroundColor: 'coral',
	}
});

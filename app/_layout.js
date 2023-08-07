import { Tabs } from 'expo-router/tabs';
import { Text, View } from 'react-native';

export default function AppLayout() {
	return (
		<Tabs screenOptions={{
			header: () => (
				<View style={{ flexDirection: "row", paddingHorizontal: 20, fontWeight: "bold", marginTop: 50, paddingBottom: 10, borderBottomWidth: 1 }}>
					<Text style={{ textAlign: "left", fontWeight: "bold", fontSize: 24, }}>GLOBAL ALARMS</Text>
				</View>)
		}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Lista",
					tabBarIcon: () => <Text style={{ fontWeight: "bold", fontSize: 14 }}>Lista</Text>,
					tabBarStyle: {
						backgroundColor: "#ffffff",
					}
				}}
			/>
			<Tabs.Screen
				name="program"
				options={{
					title: "Programar",
					tabBarIcon: () => <Text style={{ fontWeight: "bold", fontSize: 14 }}>Programar</Text>,
					tabBarStyle: {
						backgroundColor: "#ffffff",
					}
				}}
			/>
			<Tabs.Screen
				name="modal"
				options={{ href: null,  }}
			/>
		</Tabs>
	);
}
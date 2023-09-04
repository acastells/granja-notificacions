import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import * as React from 'react';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainScreen from './app/index';
import DetailScreen from './app/modal';
import ProgramScreen from './app/program';
import LittleButton from './src/LittleButton';

import * as Notifications from 'expo-notifications';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


function handleVersionButton() {
	Notifications.getAllScheduledNotificationsAsync().then(scheduled_notifications => {
		console.log(scheduled_notifications.length)
		for (var notification of scheduled_notifications) { 
			console.log(notification)
		}
	})
}

function customHeader() {
	return (
		<SafeAreaView>
			<View style={{ flexDirection: "row", paddingHorizontal: 20, paddingVertical: 10, fontWeight: "bold", borderBottomWidth: 1 }}>
				<Text style={{ textAlign: "left", fontWeight: "bold", fontSize: 24 }}>GLOBAL ALARMS</Text>
				<LittleButton title="v.0.17" onPress={handleVersionButton}></LittleButton>
			</View>
		</SafeAreaView>
	)
}

function TabNavigator() {
	return (
		<Tab.Navigator screenOptions={{
			header: () => customHeader()
		}}>
			<Tab.Screen name="Main" component={MainScreen} options={{ tabBarIcon: () => <Text style={{ fontWeight: "bold", fontSize: 14 }}>Lista</Text>, tabBarLabel: "Lista" }} />
			<Tab.Screen name="Program" component={ProgramScreen} options={{ tabBarIcon: () => <Text style={{ fontWeight: "bold", fontSize: 14 }}>Programar</Text>, tabBarLabel: "Programar" }} />
		</Tab.Navigator>
	);
}

export default function App() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<NavigationContainer>
				<Stack.Navigator headerShown="false" presentation="modal" screenOptions={{ header: () => { } }}>
					<Stack.Screen name="TabNavigator" component={TabNavigator} />
					<Stack.Screen name="Modal" component={DetailScreen} options={{ header: () => customHeader() }} />
				</Stack.Navigator>
			</NavigationContainer>
		</GestureHandlerRootView>
	);
}
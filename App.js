import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import * as React from 'react';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainScreen from './app/index';
import DetailScreen from './app/modal';
import ProgramScreen from './app/program';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function customHeader() {
	return (<View style={{ flexDirection: "row", paddingHorizontal: 20, fontWeight: "bold", marginTop: 50, paddingBottom: 10, borderBottomWidth: 1 }}>
		<Text style={{ textAlign: "left", fontWeight: "bold", fontSize: 24 }}>GLOBAL ALARMS</Text>
	</View>)
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
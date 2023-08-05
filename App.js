import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Platform, Text, ScrollView } from 'react-native';
import * as Notifications from 'expo-notifications';
import Button from "./src/Button";
import Constants from 'expo-constants';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { customStyle as styles } from "./styles";

import data from './defaultAlarms.json';

const defaultAlarmsJSON = require('./defaultAlarms.json')
const entriesJSON = require('./savedEntries.json')

const projectId = Constants.expoConfig.extra.eas.projectId;
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [date, setDate] = useState(new Date());
  const [granjaName, setGranjaName] = useState("")

  const notificationListener = useRef();
  const responseListener = useRef();

  const [defaultAlarms, setDefaultAlarms] = useState([])
  const [entries, setEntries] = useState([])

  useEffect(() => {
    registerForPushNotificationsAsync()

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log("NOTIFICATION", notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("RESPONSE", response);
    });

    loadDefaultAlarms()
    loadSavedEntries()

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


  async function loadDefaultAlarms() {
    try {
      const parsedData = JSON.parse(JSON.stringify(defaultAlarmsJSON));
      setDefaultAlarms(parsedData);
    } catch (error) {
      console.error('Error reading or parsing JSON:', error);
    }
  }

  async function loadSavedEntries() {
    try {
      const parsedData = JSON.parse(JSON.stringify(entriesJSON));
      setEntries(parsedData);
    } catch (error) {
      console.error('Error reading or parsing JSON:', error);
    }
  }

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: true,
        lightColor: "#FF231F7C",
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: true,
      });

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    }

    return token;
  }

  async function cancelNotification(notifId) {
    await Notifications.cancelScheduledNotificationAsync(notifId);
  }

  async function schedulePushNotification(title = "title text", body = "body text", seconds = 5) {
    var notifiId = await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: {
          data: 'goes here',
          notifId: "notifId here"
        },
      },
      trigger: { seconds: seconds },
    });

    console.log(notifiId)
  }


  const onChangeDatePicker = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: onChangeDatePicker,
      mode: "date",
      is24Hour: true,
    });
  };


  const AlarmBox = (props) => {
    return (<>
      <View style={{ padding: 5, marginVertical: 5, paddingHorizontal:10, backgroundColor: "grey", borderRadius: 10, alignItems: "flex-start", justifyContent: "flex-start" }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ flex: 6, color: "white",  }}>{props.item.name}</Text>
          <Text style={{ flex: 4, color: "white",  }}>a los {props.item.days} dias</Text>
        </View>
      </View>
    </>)
  }

  return (
    <>
      <Text style={{ textAlign: "center", fontWeight: "bold", paddingBottom: 10, marginTop: 55, fontSize: 24, borderBottomWidth: 1 }}>GLOBAL ALARMS</Text>
      <ScrollView style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#ffffef" }}>

        <Text style={{ textAlign: "center", fontWeight: "bold" }}>Fecha de entrada</Text>
        <Text style={{ textAlign: "center", fontWeight: "bold" }}>{date.toLocaleDateString("es-ES", options)}</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 10 }}>
          <Button title="Hoy" onPress={() => { setDate(new Date()) }} />
          <Button title="Mañana" onPress={() => { var date = new Date(); date.setDate(date.getDate() + 1); setDate(date) }} />
          <Button title="Otra fecha" onPress={() => showDatePicker()} />
        </View>

        <Text style={{ textAlign: "center", fontWeight: "bold", marginTop: 20 }}>Alarmas</Text>
        <View style={{ marginTop: 10 }}>
          {defaultAlarms.map(item => (
            <AlarmBox key={item.id} item={item} />
          ))}
        </View>


        <Text style={{ textAlign: "center", fontWeight: "bold", marginTop: 20 }}>Granja</Text>
        <View style={{ marginTop: 10 }}>
          <TextInput
            style={{ height: 40, padding: 10, borderWidth: 1, padding: 10, borderRadius: 10 }}
            onChangeText={setGranjaName}
            value={granjaName}
            placeholder="Nombre de la granja"
          />
        </View>

        <View style={{ marginTop: 10 }}>
          <Button title="Programar" onPress={() => schedulePushNotification()} />
        </View>

        <View style={{ marginTop: 40 }}>
          <Text>Alarmas Programadas</Text>

          <View style={styles.container}>
            <View style={styles.tableRow}>
              <Text style={styles.headerCell}>ID</Text>
              <Text style={styles.headerCell}>Granja</Text>
              <Text style={styles.headerCell}>Entrada</Text>
              <Text style={styles.headerCell}>Alarmas</Text>
            </View>
            {entries.map(item => (
              <View style={styles.tableRow} key={item.id}>
                <Text style={styles.dataCell}>{item.id}</Text>
                <Text style={styles.dataCell}>{item.granja}</Text>
                <Text style={styles.dataCell}>{item.entrada}</Text>
                <Text style={styles.dataCell}>---</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={{ marginVertical: 40, textAlign: "right" }}>v.0.4</Text>
      </ScrollView>

    </>
  );
};
import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Platform, Text, ScrollView } from 'react-native';
import * as Notifications from 'expo-notifications';
import Button from "./src/Button";
import Constants from 'expo-constants';
import { DateTimePicker, DateTimePickerAndroid } from '@react-native-community/datetimepicker';

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
  const [message, setMessage] = useState('');
  const [granjaName, setGranjaName] = useState("")

  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync()

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log("NOTIFICATION", notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("RESPONSE", response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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
      <View style={{ flexDirection: "row", padding: 8, marginVertical: 8, backgroundColor: "grey", borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ flex: 6, color: "white", marginLeft: 10 }}>{props.title}</Text>
        <Text style={{ flex: 4, color: "white", marginRight: 10 }}>a los {props.duration} dias</Text>
      </View>
    </>)
  }

  return (
    <>
      <ScrollView style={{ paddingVertical: 45, paddingHorizontal: 20 }}>

        <Text style={{ textAlign: "center", fontWeight: "bold" }}>Fecha de entrada</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 10 }}>
          <Button title="Hoy" onPress={() => { setDate(new Date()) }} />
          <Button title="Mañana" onPress={() => { var date = new Date(); date.setDate(date.getDate() + 1); setDate(date) }} />
          <Button title="Otra fecha" onPress={() => showDatePicker()} />
        </View>

        <Text style={{ textAlign: "center", fontWeight: "bold", marginTop: 20 }}>Alarmas</Text>
        <View style={{ marginTop: 10 }}>
          <AlarmBox title={"Vacunar"} duration={30} />
          <AlarmBox title={"Treure Sang"} duration={60} />
          <AlarmBox title={"Comprovar aigua"} duration={90} />
        </View>


        <Text style={{ textAlign: "center", fontWeight: "bold", marginTop: 20 }}>Granja</Text>
        <View style={{ marginTop: 10 }}>
          <TextInput
            style={{ height: 40, padding: 10, borderWidth: 1, padding: 10, borderRadius:10 }}
            onChangeText={setGranjaName}
            value={granjaName}
            placeholder="Nombre de la granja"
          />
        </View>

        <Text style={{ textAlign: "center", fontWeight: "bold", marginTop: 20 }}>{date.toLocaleDateString("es-ES", options)}</Text>
        <View style={{ marginTop: 10 }}>
          <Button title="Programar" onPress={() => schedulePushNotification()} />
        </View>

        <View style={{ marginTop: 40 }}>
          <Text>Alarmas Programadas</Text>
        </View>


        <Text style={{ marginTop: 40, textAlign: "right" }}>v.0.4</Text>
      </ScrollView>

    </>
  );
};
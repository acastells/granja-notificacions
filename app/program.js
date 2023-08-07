import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';

import Button from "../src/Button";

const defaultAlarmsJSON = require('../defaultAlarms.json')
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };


export default function App() {
  const [date, setDate] = useState(new Date());
  const [granjaName, setGranjaName] = useState("")

  const [defaultAlarms, setDefaultAlarms] = useState([])

  useEffect(() => {
    loadDefaultAlarms()

    return () => {
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


  async function schedulePushNotification(title = "title text", body = "body text", seconds = 5) {
    var notifiId = await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body
      },
      trigger: { seconds: seconds },
    });

    var new_entry = {
      "granja": granjaName, "entrada": date.toISOString(), "alarms": [
        {
          "name": "name1",
          "description": "descr1",
          "triggers_at": "11111111",
          "notification_id": notifiId
        },
      ]
    }
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
      <View style={{ padding: 5, marginVertical: 5, paddingHorizontal: 10, backgroundColor: "grey", borderRadius: 10, alignItems: "flex-start", justifyContent: "flex-start" }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ flex: 6, color: "white", }}>{props.item.name}</Text>
          <Text style={{ flex: 4, color: "white", textAlign: "right" }}>a los {props.item.days} dias</Text>
        </View>
      </View>
    </>)
  }

  return (
    <>
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
            <AlarmBox key={item.name + item.description} item={item} />
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
      </ScrollView>

    </>
  );
};
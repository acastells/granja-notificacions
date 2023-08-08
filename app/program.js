import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';

import Button from "../src/Button";
import { calculateTriggersAt, getDate7AM, transformDateTo7AM } from '../src/DateManager';
import LittleButton from "../src/LittleButton";
import { getExistentGranjas, saveEntry } from '../src/StorageManager';

const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };


export default function App() {
  const MULTIPLIER_SECS_TO_DAYS = 86400

  const [date, setDate] = useState(getDate7AM());
  const [granjaName, setGranjaName] = useState("")

  const [existentGranjas, setExistentGranjas] = useState([]);
  const [selectedGranja, setSelectedGranja] = useState();

  const [enabledAddAlarm, setEnabledAddAlarm] = useState(false)
  const [selectedAlarms, setSelectedAlarms] = useState([
    {
      "name": "Extracció Sang",
      "description": "S'ha de treure sang",
      "days": 5
    },
    {
      "name": "Vacunació PVRS",
      "description": "Trucar al veterenari per a que es vacuni aquesta explotació",
      "days": 10
    },
    {
      "name": "Comprovació nivells aigua",
      "description": "S'ha de comprovar que l'explotació animal estigui consumint el nivell d'aigua recomanat",
      "days": 15
    }
  ])

  useEffect(() => {
    getExistentGranjas().then(granjas => {
      setExistentGranjas(granjas)
    })
    return () => { }
  }, [])

  async function schedulePushNotification() {
    if (!granjaName.trim()) {
      alert('Introduzca el nombre de la granja');
      return;
    }

    var resultAlarms = []

    for (var alarm of selectedAlarms) {
      var notification_id = await Notifications.scheduleNotificationAsync({
        content: {
          title: alarm.name + " a " + granjaName,
          body: alarm.description
        },
        trigger: { seconds: alarm.days * MULTIPLIER_SECS_TO_DAYS },
      });

      alarm.triggers_at = calculateTriggersAt(new Date(date), alarm.days * MULTIPLIER_SECS_TO_DAYS)
      alarm.notification_id = notification_id
      alarm.completed = false
      resultAlarms.push(alarm)
    }

    var new_entry = {
      "granja": granjaName,
      "entrada": transformDateTo7AM(date).toString(),
      "alarms": resultAlarms
    }

    saveEntry(new_entry).then(() => {
      router.replace("/")
    })
  }


  const onChangeDatePicker = (event, selectedDate) => {
    setDate(selectedDate);
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

  const AlarmBoxInput = (props) => {
    const [name, setName] = useState("-")
    const [days, setDays] = useState(10)

    return (<>
      <View style={{ padding: 5, marginVertical: 5, paddingHorizontal: 10, backgroundColor: "grey", borderRadius: 10, alignItems: "flex-start", justifyContent: "flex-start" }}>
        <View style={{}}>
          <Text>Nombre: </Text>
          <TextInput onChangeText={setName} style={{ color: "white", }} value={name} placeholder={name} placeholderTextColor={"white"}></TextInput>
          <Text>Dias: </Text>
          <TextInput onChangeText={setDays} keyboardType='numeric' style={{ color: "white" }} value={days.toString()} placeholderTextColor={"white"} placeholder={days.toString()}></TextInput>
        </View>
      </View>
      <LittleButton title="Guardar" onPress={() => {
        setSelectedAlarms([...selectedAlarms, { "name": name, "days": parseInt(days), "description": "" }])
        setEnabledAddAlarm(false)
      }}></LittleButton>
    </>)
  }

  return (
    <>
      <ScrollView style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#ffffef" }}>
        <Text style={{ textAlign: "center", fontWeight: "bold" }}>Fecha de entrada</Text>
        <Text style={{ textAlign: "center", fontWeight: "bold" }}>{date.toLocaleDateString("es-ES", options)}</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 10 }}>
          <Button title="Hoy" onPress={() => { setDate(new Date()) }} />
          <Button title="Mañana" onPress={() => { var date_aux = new Date(); date_aux.setDate(date_aux.getDate() + 1); setDate(date_aux) }} />
          <Button title="Otra fecha" onPress={() => showDatePicker()} />
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
          <Text style={{ textAlign: "center", fontWeight: "bold", }}>Alarmas</Text>
          <LittleButton onPress={() => setEnabledAddAlarm(!enabledAddAlarm)} title="+"></LittleButton>
        </View>

        <View style={{ marginTop: 10 }}>
          {selectedAlarms.map(item => (
            <AlarmBox key={item.name + item.description} item={item} />
          ))}
          {enabledAddAlarm &&
            <AlarmBoxInput />
          }
        </View>


        <Text style={{ textAlign: "center", fontWeight: "bold", marginTop: 20 }}>Granja</Text>
        <View style={{ marginTop: 0, textAlign: "center" }}>
          <Picker
            style={{}}
            selectedValue={selectedGranja}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedGranja(itemValue)
              setGranjaName(itemValue)
            }}>
            <Picker.Item key={""} label={"Nueva Granja"} value={""} />
            {existentGranjas.map(item => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
          </Picker>
          {(selectedGranja === "" || existentGranjas.length === 0) &&
            <TextInput
              style={{ height: 40, padding: 10, borderWidth: 1, padding: 10, borderRadius: 10 }}
              onChangeText={setGranjaName}
              value={granjaName}
              placeholder="Nombre de la granja"
            />
          }
        </View>

        <View style={{ marginVertical: 40 }}>
          <Button title="Programar" onPress={() => schedulePushNotification()} />
        </View>
      </ScrollView>

    </>
  );
};
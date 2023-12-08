import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Agenda } from 'react-native-calendars';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone';

const CalendarView = () => {
  const [items, setItems] = useState({});
  const [markedDates, setMarkedDates] = useState({});

  const fetchTasks = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await axios.get(`http://192.168.18.50:8000/tasks/user/${userId}`);
      const fetchedTasks = response.data;

      const agendaItems = processTasksForAgenda(fetchedTasks);
      setItems(agendaItems);

      const newMarkedDates = processTasksForMarking(fetchedTasks);
      setMarkedDates(newMarkedDates);
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Agenda
        items={items}
        markedDates={markedDates}
        markingType={'period'}
        renderItem={(item) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

const processTasksForAgenda = (tasks) => {
  const agendaItems = {};

  tasks.forEach((task) => {
    const startDate = moment.utc(task.startDate).format('YYYY-MM-DD');
    const endDate = moment.utc(task.endDate).format('YYYY-MM-DD');

    let currentDate = moment(startDate);

    while (currentDate <= moment(endDate)) {
      const dateStr = currentDate.format('YYYY-MM-DD');

      // Asegurarse de que solo se añada la tarea al día específico
      if (!agendaItems[dateStr]) {
        agendaItems[dateStr] = [{ name: task.name, height: 50 }];
      } else {
        // Si ya existen tareas para ese día, añadir esta tarea también
        agendaItems[dateStr].push({ name: task.name, height: 50 });
      }

      currentDate.add(1, 'day');
    }
  });

  return agendaItems;
};

const processTasksForMarking = (tasks) => {
  const markedDates = {};

  tasks.forEach((task) => {
    const startDate = moment.utc(task.startDate).format('YYYY-MM-DD'); // Ajustar la zona horaria según sea necesario
    const endDate = moment.utc(task.endDate).format('YYYY-MM-DD'); // Ajustar la zona horaria según sea necesario

    if (startDate === endDate) {
      // Tarea de un solo día
      markedDates[startDate] = { marked: true, dotColor: 'red' };
    } else {
      // Tarea de varios días
      let currentDate = moment(startDate);
      const end = moment(endDate);

      while (currentDate <= end) {
        const dateStr = currentDate.format('YYYY-MM-DD');

        if (currentDate.isSame(startDate, 'day')) {
          // Primer día del rango
          markedDates[dateStr] = { startingDay: true, color: 'blue', textColor: 'white' };
        } else if (currentDate.isSame(end, 'day')) {
          // Último día del rango
          markedDates[dateStr] = { endingDay: true, color: 'blue', textColor: 'white' };
        } else {
          // Días intermedios
          markedDates[dateStr] = { color: 'blue', textColor: 'white' };
        }
        currentDate.add(1, 'day');
      }
    }
  });

  return markedDates;
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginRight: 10,
    marginTop: 17,
  },
  itemText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CalendarView;
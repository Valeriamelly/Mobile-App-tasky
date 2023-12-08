import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Agenda } from 'react-native-calendars';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone';

const CalendarView = ({ navigation }) => {
  const [allTasks, setAllTasks] = useState({}); // Almacenar todas las tareas aquí
  const [items, setItems] = useState({});
  const [markedDates, setMarkedDates] = useState({});

  const fetchTasks = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await axios.get(`http://192.168.1.7:8000/tasks/user/${userId}`);
      const fetchedTasks = response.data;

      const agendaItems = processTasksForAgenda(fetchedTasks);
      setItems(agendaItems);

      const newMarkedDates = processTasksForMarking(fetchedTasks);
      setMarkedDates(newMarkedDates);
      setAllTasks(fetchedTasks); // Actualizar allTasks con las tareas obtenidas
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTasks();
    });
    return () => unsubscribe();
  }, [navigation]);

  // Función para manejar la selección de un día en el calendario
  const onDaySelected = (day) => {
    const selectedDate = day.dateString;
    const tasksForSelectedDay = filterTasksForDay(selectedDate);
    setItems(tasksForSelectedDay);
  };

  // Función para filtrar las tareas para un día específico
  const filterTasksForDay = (selectedDate) => {
    let filteredItems = {};
  
    allTasks.forEach((task) => {
      const startDate = moment.utc(task.startDate).format('YYYY-MM-DD');
      const endDate = moment.utc(task.endDate).format('YYYY-MM-DD');
  
      if (startDate <= selectedDate && endDate >= selectedDate) {
        // Añadir la tarea si el día seleccionado está dentro del rango de la tarea
        if (!filteredItems[selectedDate]) {
          filteredItems[selectedDate] = [{ name: task.name, height: 50 }];
        } else {
          filteredItems[selectedDate].push({ name: task.name, height: 50 });
        }
      }
    });
  
    return filteredItems;
  };

  return (
    <View style={{ flex: 1 }}>
      <Agenda
        items={items}
        markedDates={markedDates}
        markingType={'period'}
        onDayPress={onDaySelected} // Agregar aquí el manejador
        renderItem={(item) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
          </View>
        )}
        // ... otros props
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
    const startDate = moment.utc(task.startDate).format('YYYY-MM-DD');
    const endDate = moment.utc(task.endDate).format('YYYY-MM-DD');

    if (startDate === endDate) {
      // Tarea puntual
      if (!markedDates[startDate]) {
        markedDates[startDate] = { marked: true, dotColor: 'red' };
      } else {
        // Añadir marcado de punto a una fecha ya marcada como rango
        markedDates[startDate] = { ...markedDates[startDate], marked: true, dotColor: 'red' };
      }
    } else {
      // Tarea de rango
      let currentDate = moment(startDate);
      const end = moment(endDate);

      while (currentDate <= end) {
        const dateStr = currentDate.format('YYYY-MM-DD');

        if (markedDates[dateStr] && markedDates[dateStr].marked) {
          // Si ya existe un marcado de punto en esta fecha, combinarlo con el marcado de rango
          const existingMark = markedDates[dateStr];
          markedDates[dateStr] = {
            ...existingMark,
            startingDay: currentDate.isSame(startDate, 'day') || existingMark.startingDay,
            endingDay: currentDate.isSame(end, 'day') || existingMark.endingDay,
            color: 'blue',
            textColor: 'white'
          };
        } else {
          // Marcado de rango sin punto existente
          markedDates[dateStr] = {
            startingDay: currentDate.isSame(startDate, 'day'),
            endingDay: currentDate.isSame(end, 'day'),
            color: 'blue',
            textColor: 'white'
          };
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
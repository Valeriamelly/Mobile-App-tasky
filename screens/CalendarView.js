import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Agenda } from 'react-native-calendars';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CalendarView = () => {
  const [items, setItems] = useState({});

  const fetchTasks = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const response = await axios.get(`http://192.168.18.50:8000/tasks/user/${userId}`);
      console.log(response.data);
      const fetchedTasks = response.data;

      // Procesar las tareas para adaptarlas al formato requerido por Agenda
      const formattedTasks = fetchedTasks.reduce((acc, task) => {
        const date = task.startDate.split('T')[0]; // Asume que startDate tiene formato 'YYYY-MM-DD'
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push({ name: task.name, height: 50 }); // Ajusta esto según sea necesario
        return acc;
      }, {});

      setItems(formattedTasks);
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
        renderItem={(item) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginRight: 10,
    marginTop: 17
  },
  item: {
    backgroundColor: 'lightblue', // Cambia el color de fondo para mayor visibilidad
    borderRadius: 10, // Bordes redondeados
    padding: 20,
    marginRight: 10,
    marginTop: 17,
    shadowColor: '#000', // Sombra para un efecto 3D
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // Elevación para Android
  },
  itemText: {
    color: '#333', // Color de texto
    fontSize: 16, // Tamaño de fuente
    fontWeight: 'bold', // Peso de la fuente
  },

});

export default CalendarView;
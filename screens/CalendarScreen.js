import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Agenda } from 'react-native-calendars';

const CalendarScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <Agenda
        items={{
          '2023-12-01': [
            { name: 'Reunión importante', height: 80 },
            { name: 'Tarea pendiente' },
          ],
          // Puedes agregar más eventos aquí
        }}
        renderItem={(item) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Cambia el color de fondo según tus preferencias
    marginTop: 50,
  },
});

export default CalendarScreen;

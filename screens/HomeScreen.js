import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
    const projects = [
        { id: '1', name: 'Proyecto 1', descripcion: "Descripción: software desarrollo" },
        { id: '2', name: 'Proyecto 2', descripcion: "Descripción: software desarrollo" },
        // ... otros proyectos
    ];

    const [menuVisible, setMenuVisible] = React.useState(false);

    const renderProject = ({ item }) => (
        <TouchableOpacity
            style={styles.projectItem}
            onPress={() => navigation.navigate('Task', { projectId: item.id })}
        >
            <Text style={styles.projectTitle}>{item.name}</Text>
            <Text style={styles.descripcion}>{item.descripcion}</Text>
            <AntDesign name="edit" size={24} color="black" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={projects}
                keyExtractor={(item) => item.id}
                renderItem={renderProject}
            />
            {menuVisible && (
                <View style={styles.menuContainer}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {/* Lógica para "Crear Tarea" */ }}>
                        <Text>Crear Tarea</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {/* Lógica para "Crear Proyecto" */ }}>
                        <Text>Crear Proyecto</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity
                onPress={() => setMenuVisible(!menuVisible)}
                style={styles.floatingButton}>
                <AntDesign name="plus" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    floatingButton: {
        backgroundColor: '#007bff', // Puedes elegir el color que prefieras
        width: 56, // Tamaño del botón
        height: 56,
        borderRadius: 28, // Para hacerlo circular
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute', // Importante para posicionarlo sobre los demás elementos
        bottom: 20, // Margen desde la parte inferior
        right: 20, // Margen desde la parte derecha
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    projectItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    projectTitle: {
        fontSize: 18,
    },
    menuContainer: {
        position: 'absolute',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        right: 70, // Ajustar según la ubicación del botón flotante
        bottom: 30, // Ajustar según la ubicación del botón flotante
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default HomeScreen;
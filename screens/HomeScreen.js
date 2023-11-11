import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
    const [projects, setProjects] = useState([]); // Estado para almacenar los proyectos
    const [menuVisible, setMenuVisible] = useState(false); // Estado para controlar la visibilidad del menú

    useEffect(() => {
        axios.get('http://192.168.1.8:8000/projects') // Asegúrate de que la URL sea correcta
            .then(response => {
                setProjects(response.data); // Actualiza el estado con los proyectos obtenidos
            })
            .catch(error => {
                console.error('Error al obtener los proyectos:', error);
            });
    }, []); // Array vacío para que se ejecute solo una vez al montar el componente

    const renderProject = ({ item }) => (
        <TouchableOpacity
            style={styles.projectItem}
            onPress={() => navigation.navigate('Task', { projectId: item.id })}
        >
            <Text style={styles.projectTitle}>{item.name}</Text>
            <Text style={styles.projectDescription}>{item.description}</Text>
            <AntDesign name="edit" size={24} color="black" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={projects}
                keyExtractor={(item) => item._id.toString()}
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
                        onPress={() => navigation.navigate('AddProject')}>
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
        backgroundColor: '#1ba8ed', // Puedes elegir el color que prefieras
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
        padding: 35,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    projectTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    projectDescription: {
        fontSize: 14,
        color: 'gray', // Elige un estilo que se ajuste a tu diseño
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



// HomeScreen.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Ensure the correct import statement

const HomeScreen = ({ navigation }) => {
    const [projects, setProjects] = useState([]); // Estado para almacenar los proyectos

    // Función para cargar proyectos
    const loadProjects = async () => {
        const userId = await AsyncStorage.getItem("userId");

        axios.get(`http://192.168.18.50:8000/projects?userId=${userId}`)
            .then(response => {
                setProjects(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los proyectos:', error);
            });
    };

    const deleteProject = (projectId) => {
        // Aquí llamarás a tu API para eliminar el proyecto
        axios.delete(`http://192.168.18.50:8000/projects/${projectId}`)
            .then(response => {
                // Recargar los proyectos después de eliminar
                loadProjects();
            })
            .catch(error => {
                console.error('Error al eliminar el proyecto:', error);
            });
    };

    useEffect(() => {
        loadProjects(); // Carga inicial de proyectos

        // Listener para recargar proyectos cuando la pantalla gane foco
        const unsubscribe = navigation.addListener('focus', () => {
            loadProjects(); // Recarga proyectos cada vez que la pantalla gane foco
        });
        // Función de limpieza para desuscribirse del listener
        return unsubscribe;
    }, [navigation]);


    const renderProject = ({ item }) => {
        // Formatear fecha y hora de inicio
        const formattedStartDate = item.startDate ? new Date(item.startDate).toLocaleString() : 'Sin fecha y hora';
        // Formatear fecha y hora de fin
        const formattedEndDate = item.endDate ? new Date(item.endDate).toLocaleString() : 'Sin fecha y hora';

        return (
            <View style={styles.projectItem}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => navigation.navigate('ProjectScreen', { projectId: item._id })}
                >
                    <Text style={styles.projectTitle}>{item.name}</Text>
                    <Text style={styles.projectDescription}>{item.description}</Text>
                    <Text style={styles.projectDate}>Inicio: {formattedStartDate} | Fin: {formattedEndDate}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('UpdateProject', { projectId: item._id, currentName: item.name, currentDescription: item.description })}
                >
                    <AntDesign name="edit" size={24} color="black" />
                    
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteProject(item._id)}>
                    <AntDesign name="delete" size={24} color="red" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={projects}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderProject}
            />


            <TouchableOpacity
                onPress={() => navigation.navigate('AddProject')}
                style={styles.floatingButton}>
                <AntDesign name="plus" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    projectDate: {
        fontSize: 14,
        color: 'grey',
    },
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
        backgroundColor: '#f0f0f0',
    },
    projectCard: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    projectTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    projectDates: {
        fontSize: 14,
        color: 'grey',
    },
    tasksContainer: {
        flex: 1,
        marginTop: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    taskCard: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        marginHorizontal: 10,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    taskName: {
        fontSize: 18,
    },
    taskDate: {
        color: 'gray',
    },
    addButton: {
        backgroundColor: '#008E97',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        margin: 10,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default HomeScreen;

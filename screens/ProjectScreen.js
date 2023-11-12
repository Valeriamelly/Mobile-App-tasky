// ProjectScreen.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const ProjectScreen = ({ route, navigation }) => {
    const { projectId } = route.params;
    const [projectData, setProjectData] = useState({ tasks: [], projectName: '' });

    useEffect(() => {
        axios.get(`http://192.168.18.50:8000/projects/${projectId}/tasks`)
            .then(response => {
                setProjectData({ tasks: response.data.tasks, projectName: response.data.projectName });
            })
            .catch(error => {
                console.error('Error al obtener las tareas:', error);
            });
    }, [projectId]);

    const renderTask = ({ item }) => {
        const formattedStartDate = item.startDate ? new Date(item.startDate).toLocaleDateString() : 'Sin fecha';
        const formattedEndDate = item.endDate ? new Date(item.endDate).toLocaleDateString() : 'Sin fecha';
    
        return (
            <View style={styles.taskCard}>
                <Text style={styles.taskName}>{item.name}</Text>
                <Text style={styles.taskDescription}>{item.description}</Text>
                <Text style={styles.taskDate}>Inicio: {formattedStartDate}</Text>
                <Text style={styles.taskDate}>Fin: {formattedEndDate}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.projectTitle}>Proyecto {projectData.projectName}</Text>
            <AntDesign name="edit" size={24} color="black" />
            <FlatList
                data={projectData.tasks}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderTask}
            />
            <TouchableOpacity
                onPress={() => navigation.navigate('AddTask', { projectId })}
                style={styles.floatingButton}>
                <AntDesign name="plus" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    taskDate: {
        fontSize: 14,
        color: 'grey', // Puedes ajustar el estilo según tus preferencias
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
    projectTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    taskCard: {
        backgroundColor: '#f5f5f5',
        padding: 15,
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
    taskDescription: {
        fontSize: 16,
        color: 'grey', // Ajusta los estilos según tus preferencias
    },
    taskDate: {
        color: 'gray',
    },
});

export default ProjectScreen;

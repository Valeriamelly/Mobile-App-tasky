import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';


const ProjectScreen = ({ route, navigation }) => { // Incluye navigation aquí
    const { projectId } = route.params; // Extrae projectId de route.params
    const [tasks, setTasks] = useState([]); // Estado para almacenar las tareas

    
    const loadTasks = () => {
        axios.get(`http://192.168.1.11:8000/projects/${projectId}/tasks`)
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                console.error('Error al obtener las tareas:', error);
            });
    };
    // Función para eliminar una tarea específica
    const deleteTask = (taskId) => {
        axios.delete(`http://192.168.1.11:8000/tasks/${taskId}`)
            .then(response => {
                // Recargar las tareas después de eliminar
                loadTasks(); // Asegúrate de tener una función que recargue las tareas
            })
            .catch(error => {
                console.error('Error al eliminar la tarea:', error);
            });
    };   

    useEffect(() => {
        loadTasks(); // Carga inicial de tareas

        const unsubscribe = navigation.addListener('focus', () => {
            loadTasks(); // Recarga tareas cada vez que la pantalla gane foco
        });

        return unsubscribe; // Desuscripción al desmontar
    }, [navigation, projectId]);

    const toggleTaskCompletion = (taskId, isCurrentlyCompleted) => {
        axios.put(`http://192.168.1.11:8000/tasks/${taskId}`, { isCompleted: !isCurrentlyCompleted })
            .then(() => {
                // Actualiza el estado para reflejar el cambio
                setProjectData(prevData => {
                    const updatedTasks = prevData.tasks.map(task => {
                        if (task._id === taskId) {
                            return { ...task, isCompleted: !isCurrentlyCompleted };
                        }
                        return task;
                    });
                    return { ...prevData, tasks: updatedTasks };
                });
            })
            .catch(error => console.error('Error al actualizar el estado de la tarea:', error));
    };

    const renderTask = ({ item }) => {
        // Formatear fecha y hora de inicio
        const formattedStartDate = item.startDate ? new Date(item.startDate).toLocaleString() : 'Sin fecha y hora';
        // Formatear fecha y hora de fin
        const formattedEndDate = item.endDate ? new Date(item.endDate).toLocaleString() : 'Sin fecha y hora';
    
        return (
            <View style={styles.taskCard}>
                <Text style={styles.taskName}>{item.name}</Text>
                <Text style={styles.taskDescription}>{item.description}</Text>
                <Text style={styles.taskDate}>Inicio: {formattedStartDate}</Text>
                <Text style={styles.taskDate}>Fin: {formattedEndDate}</Text>
                <TouchableOpacity onPress={() => toggleTaskCompletion(item._id, item.isCompleted)}>
                    <Text style={item.isCompleted ? styles.completed : styles.markComplete}>
                        {item.isCompleted ? 'Done' : 'Marcar como Completada'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTask(item._id)}>
                    <AntDesign name="delete" size={24} color="red" />
                </TouchableOpacity>
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <Text style={styles.projectTitle}>Proyecto {projectId}</Text>
            <AntDesign name="edit" size={24} color="black" onPress={() => { }} />
            <FlatList
                data={tasks}
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
    markComplete: {
        color: 'blue',
        marginTop: 10,
        fontWeight: 'bold'
    },
    completed: {
        color: 'green', // o cualquier color que prefieras
        marginTop: 10,
        fontWeight: 'bold'
    },
    deleteIcon: {
        padding: 10,
    },
    
});

export default ProjectScreen;
// ProjectScreen.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const ProjectScreen = ({ route, navigation }) => {
    const { projectId } = route.params;
    const [projectData, setProjectData] = useState({ tasks: [], projectName: '' });

    const loadTasks = () => {
        axios.get(`http://192.168.1.7:8000/projects/${projectId}/tasks`)
            .then(response => {
                setProjectData(response.data);
            })
            .catch(error => {
                console.error('Error al obtener las tareas:', error);
            });
    };

    // Función para eliminar una tarea específica
    const deleteTask = (taskId) => {
        axios.delete(`http://192.168.1.7:8000/tasks/${taskId}`)
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
        axios.put(`http://192.168.1.7:8000/tasks/${taskId}`, { isCompleted: !isCurrentlyCompleted })
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
                <TouchableOpacity style={styles.checkButton} onPress={() => toggleTaskCompletion(item._id, item.isCompleted)}>
                {item.isCompleted ? (
                    <AntDesign name="checkcircle" size={30} color="#985af2" />
                ) : (
                    <AntDesign name="checkcircleo" size={30} color="grey" />
                )}
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('UpdateTask', {
                        taskId: item._id,
                        projectId: item.projectId,
                        existingName: item.name,
                        existingDescription: item.description,
                        existingStartDate: item.startDate,
                        existingEndDate: item.endDate
                    })}
                >
                    <AntDesign name="edit" size={24} color="gray" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteTask(item._id)}
                >
                    <AntDesign name="delete" size={24} color="gray" />
                </TouchableOpacity>
            </View>
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <Text style={styles.projectTitle}>Proyecto: {projectData.projectName}</Text>
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
        fontSize: 16,
        color: 'grey', // Puedes ajustar el estilo según tus preferencias
        marginBottom: 10,

    },
    floatingButton: {
        backgroundColor: '#8139e4', // Puedes elegir el color que prefieras
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
        backgroundColor: 'white',
    },
    projectTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    taskCard: {
        padding: 15,
        marginBottom: 10,
        marginTop: 20,
        borderRadius: 10,
        borderColor: '#f1e9fe',  // Color del borde
        borderWidth: 1,         // Ancho del borde
        backgroundColor: '#f9f5ff',  // Color de fondo pastel (ajusta según tus preferencias)
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      
    taskName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    taskDescription: {
        fontSize: 16,
        color: 'grey', // Ajusta los estilos según tus preferencias
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between',
    },
    editButton: {
        //backgroundColor: '#17BEBB',  
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    deleteButton: {
        //backgroundColor: '#26547C',  
        padding: 10,
        borderRadius: 5,
    },
    checkButton: {
        position: 'absolute',  // Posiciona el icono de manera absoluta
        top: 15,  // Ajusta la posición desde la parte superior
        right: 15,
    }


});

export default ProjectScreen;

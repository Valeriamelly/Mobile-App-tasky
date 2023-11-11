import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ProjectScreen = ({ route }) => {
    const { projectId } = route.params; // Asegúrate de que esta línea esté recogiendo el projectId correctamente

    const tasks = [
        { id: '1', projectId: '1', name: 'Tarea 1', startDate: '2023-01-01', endDate: '2023-01-05' },
        { id: '2', projectId: '1', name: 'Tarea 2', startDate: '2023-01-06', endDate: '2023-01-10' },
        { id: '3', projectId: '2', name: 'Tarea 1', startDate: '2023-01-11', endDate: '2023-01-15' },
        { id: '4', projectId: '2', name: 'Tarea 2', startDate: '2023-01-06', endDate: '2023-01-10' },
        { id: '5', projectId: '2', name: 'Tarea 3', startDate: '2023-01-11', endDate: '2023-01-15' },
        // ... otras tareas
    ];
    
    // Filtrar las tareas para el proyecto seleccionado
    const tasksForProject = tasks.filter(task => task.projectId === projectId);

    const renderTask = ({ item }) => (
        <View style={styles.taskCard}>
            <Text style={styles.taskName}>{item.name}</Text>
            <Text style={styles.taskDate}>{item.startDate} - {item.endDate}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.projectTitle}>Proyecto {projectId}</Text>
            <AntDesign name="edit" size={24} color="black" onPress={() => {}} />
            
            {/* Utiliza tasksForProject en lugar de tasks */}
            <FlatList
                data={tasksForProject}
                keyExtractor={(item) => item.id}
                renderItem={renderTask}
            />
        </View>
    );
};

const styles = StyleSheet.create({
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
    taskDate: {
        color: 'gray',
    },
});

export default ProjectScreen;

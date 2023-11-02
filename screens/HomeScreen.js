import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const HomeScreen = () => {
    const [projects, setProjects] = useState([
        { id: '1', name: 'Proyecto 1' },
        { id: '2', name: 'Proyecto 2' },
        // ... puedes agregar más proyectos de ejemplo aquí
    ]);

    const [allTasks, setAllTasks] = useState([
        { id: '1', projectId: '1', name: 'Tarea 1', startDate: '2023-01-01', endDate: '2023-01-05', reminder: true },
        { id: '2', projectId: '2', name: 'Tarea 2', startDate: '2023-01-06', endDate: '2023-01-10', reminder: false },
        // ... puedes agregar más tareas de ejemplo aquí
    ]);

    const [selectedProjectId, setSelectedProjectId] = useState(null);

    // Calcula las fechas de inicio y fin para cada proyecto
    const projectDates = useMemo(() => {
        return projects.map(project => {
            const projectTasks = allTasks.filter(task => task.projectId === project.id);
            if (projectTasks.length === 0) {
                return { ...project, startDate: 'N/A', endDate: 'N/A' };
            }
            const startDates = projectTasks.map(task => new Date(task.startDate));
            const endDates = projectTasks.map(task => new Date(task.endDate));
            const startDate = new Date(Math.min.apply(null, startDates)).toLocaleDateString();
            const endDate = new Date(Math.max.apply(null, endDates)).toLocaleDateString();
            return { ...project, startDate, endDate };
        });
    }, [projects, allTasks]);

    const selectedProject = projects.find(p => p.id === selectedProjectId);
    const tasks = allTasks.filter(task => task.projectId === selectedProjectId);

    return (
        <View style={styles.container}>
            <FlatList
                data={projectDates}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => setSelectedProjectId(item.id)} style={styles.projectCard}>
                        <Text style={styles.projectTitle}>{item.name}</Text>
                        <Text style={styles.projectDates}>{item.startDate} - {item.endDate}</Text>
                    </TouchableOpacity>
                )}
                ListHeaderComponent={
                    <Text style={styles.sectionTitle}>Proyectos</Text>
                }
            />

            {selectedProject && (
                <View style={styles.tasksContainer}>
                    <View style={styles.header}>
                        <Text style={styles.projectTitle}>{selectedProject.name}</Text>
                        <AntDesign name="edit" size={24} color="black" onPress={() => {/* Aquí iría la lógica para editar el nombre del proyecto */}} />
                    </View>

                    <FlatList
                        data={tasks}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.taskCard}>
                                <Text style={styles.taskName}>{item.name}</Text>
                                <Text style={styles.taskDate}>{item.startDate} - {item.endDate}</Text>
                                {item.reminder && <AntDesign name="bells" size={20} color="blue" />}
                            </View>
                        )}
                        ListHeaderComponent={
                            <Text style={styles.sectionTitle}>Tareas del Proyecto</Text>
                        }
                    />

                    <TouchableOpacity style={styles.addButton} onPress={() => {/* Aquí iría la lógica para añadir una nueva tarea */}}>
                        <Text style={styles.addButtonText}>Añadir Nueva Proyecto</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
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


/*import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const HomeScreen = () => {
    const [projects, setProjects] = useState([
        { id: '1', name: 'Proyecto 1' },
        { id: '2', name: 'Proyecto 2' },
        // ... puedes agregar más proyectos de ejemplo aquí
    ]);
    
    const [selectedProject, setSelectedProject] = useState(null);
    const [tasks, setTasks] = useState([
        { id: '1', name: 'Tarea 1', startDate: '2023-01-01', endDate: '2023-01-05', reminder: true },
        { id: '2', name: 'Tarea 2', startDate: '2023-01-06', endDate: '2023-01-10', reminder: false },
        // ... puedes agregar más tareas de ejemplo aquí
    ]);


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.projectTitle}>{selectedProject ? selectedProject.name : 'Selecciona un proyecto'}</Text>
                {selectedProject && <AntDesign name="edit" size={24} color="black" />}
            </View>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.taskCard}>
                        <Text style={styles.taskName}>{item.name}</Text>
                        <Text style={styles.taskDate}>{item.startDate} - {item.endDate}</Text>
                        {item.reminder && <AntDesign name="bells" size={20} color="blue" />}
                    </View>
                )}
            />

            <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Añadir Nuevo Proyecto</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    projectTitle: {
        fontSize: 24,
        fontWeight: 'bold',
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
    addButton: {
        backgroundColor: '#008E97',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default HomeScreen;
*/
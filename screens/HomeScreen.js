import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
    const [projects, setProjects] = useState([]); // Estado para almacenar los proyectos
    const [menuVisible, setMenuVisible] = useState(false); // Estado para controlar la visibilidad del menú

    // Función para cargar proyectos
    const loadProjects = () => {
        axios.get('http://192.168.1.11:8000/projects')
            .then(response => {
                setProjects(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los proyectos:', error);
            });
    };

    const deleteProject = (projectId) => {
        // Aquí llamarás a tu API para eliminar el proyecto
        axios.delete(`http://192.168.1.11:8000/projects/${projectId}`)
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
            <TouchableOpacity
                style={styles.projectItem}
                onPress={() => navigation.navigate('Project', { projectId: item._id })}
            >
                <Text style={styles.projectTitle}>{item.name}</Text>
                <Text style={styles.projectDescription}>{item.description}</Text>
                <Text style={styles.projectDate}>Inicio: {formattedStartDate} | Fin: {formattedEndDate}</Text>
                <AntDesign name="edit" size={24} color="black" />
                <TouchableOpacity onPress={() => deleteProject(item._id)}>
                    <AntDesign name="delete" size={24} color="red" />
                </TouchableOpacity>

            </TouchableOpacity>
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



import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as KssUtil from '../util/Utils'
import PaginationButton from "../components/PaginationButton";


export default function EventsScreen() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);


    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedImage(null);
    };

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://10.0.2.2:8080/api/kss/events/latest?page=${page}&limit=${limit}`);
            const data = await response.json();
            const eventsWithImages = await Promise.all(data.map(async (event) => {
                const imageUrl = `http://10.0.2.2:8080/api/kss/events/${event.id}/image`
                return {...event, imageUrl};
            }));
            setEvents(prevEvents => [...eventsWithImages]);
        } catch (error) {
            console.error(error);
            setEvents([])
        } finally {
            setIsLoading(false);
        }
    };

    const fetchImage = async (eventId) => {
        try {
            const response = await fetch(``);
            const blob = await response.blob();
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Błąd podczas pobierania obrazu:', error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [page, limit]);

    const renderEvent = ({item}) => (
        <View
            style={[styles.eventItem, item.important ? styles.importantEvent : null, !item.read ? styles.unreadEventItem : null]}>
            {!item.read && <Text style={styles.eventText}>NOWY</Text>}
            <Text style={styles.eventText}>Nazwa: {item.name}</Text>
            <Text style={styles.eventText}>Ilość: {item.count}</Text>
            <Text style={styles.eventText}>Pewność: {Number(item.confidence * 100).toFixed(2)}%</Text>
            <Text style={styles.eventText}>Data: {new Date(item.date).toLocaleString()}</Text>
            <Text style={styles.eventText}>Ważne: {item.important ? 'Tak' : 'Nie'}</Text>
            {item.imageUrl && (
                <>
                    <TouchableOpacity onPress={() => openModal(item.imageUrl)}>
                        <Image source={{uri: item.imageUrl}} style={styles.image}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => KssUtil.handleDownload(item.imageUrl)} style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>Zapisz Obraz</Text>
                    </TouchableOpacity>
                </>

            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={events}
                keyExtractor={(item, index) => 'event-' + index}
                renderItem={renderEvent}
                ListFooterComponent={isLoading && <ActivityIndicator/>}
            />
            <Modal
                animationType="slide"
                transparent={false}
                visible={isModalVisible}
                onRequestClose={closeModal}>
                <View style={styles.fullscreenModal}>
                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                        <Text style={styles.closeButtonText}>Zamknij</Text>
                    </TouchableOpacity>
                    {selectedImage && <Image source={{uri: selectedImage}} style={styles.fullscreenImage}/>}
                </View>
            </Modal>
            <View style={styles.paginationContainer}>
                <PaginationButton
                    onPress={() => setPage(page - 1)}
                    iconName="arrow-back"
                    text="Poprzednia"
                    disabled={page === 1}
                />
                <Text style={styles.pageNumberText}>Strona {page}</Text>
                <PaginationButton
                    onPress={() => setPage(page + 1)}
                    iconName="arrow-forward"
                    text="Następna"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    eventItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,  // dla Androida
    },
    unreadEventItem: {
        borderColor: '#5ba6ff', // jasnoniebieski kolor tła
        borderWidth: 5,
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    importantEvent: {
        margin: 10,
        backgroundColor: '#E6AA68', // Czerwony kolor tła dla ważnych eventów
        borderRadius: 10
    },
    eventText: {
        fontSize: 18,
        fontFamily: 'Lato-Black'
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        marginVertical: 10,
        borderRadius: 5
    },
    fullscreenModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    fullscreenImage: {
        width: '100%',
        height: '80%',
        resizeMode: 'contain',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 20,
    },
    saveButton: {
        padding: 10,
        backgroundColor: '#F3D06C',
        borderRadius: 5,
        shadowColor: "#000",
        elevation: 2,
    },
    saveButtonText: {
        fontSize: 16,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    paginationText: {
        fontSize: 16,
        color: 'blue',
    },
    pageNumberText: {
        fontSize: 16,
        color: 'black',
    },
});

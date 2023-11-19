import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ThemeContext} from "../context/ThemeContext";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function HomeScreen({navigation}) {

    const [isConnected, setIsConnected] = useState(false);
    const [lastChecked, setLastChecked] = useState(null);
    const {isDarkTheme, themes} = useContext(ThemeContext);
    const theme = isDarkTheme ? themes.dark : themes.light;

    const checkConnection = async () => {
        setLastChecked(new Date());
        try {
            const response = await fetch('http://rpi.local:8080/api/kss/health');
            if (response.status === 200) {
                setIsConnected(true);
            } else {
                setIsConnected(false);
            }
        } catch (error) {
            setIsConnected(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(checkConnection, 5000);

        return () => clearInterval(interval);
    }, []);


    return (
        <View style={[styles.container, {backgroundColor: theme.background}]}>
            <View style={styles.lastCheckedContainer}>
                {isConnected ? <Ionicons name="md-checkmark-circle" size={32} color="green"/> :
                    <Ionicons name="md-alert-circle" size={32} color="red"/>}
                <Text>{isConnected ? 'Połączono z urządzeniem' : 'Brak połączenia z urządzeniem'}</Text>
                {lastChecked && (
                    <Text style={styles.lastCheckedText}>
                        Ostatnie sprawdzenie: {lastChecked.toLocaleString()}
                    </Text>
                )}
                {!isConnected && <ActivityIndicator size="large" color="#0000ff"/>}
            </View>
            <Text style={[styles.title, {color: theme.text}]}>Witaj w KSS!</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Events')}
                              style={{padding: 10, backgroundColor: theme.buttonBackground, borderRadius: 5}}>
                <Text style={{color: theme.buttonText, backgroundColor: theme.buttonBackground}}>Historia zdarzeń</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}
                              style={{padding: 10, backgroundColor: theme.buttonBackground, borderRadius: 5}}>
                <Text style={{color: theme.buttonText, backgroundColor: theme.buttonBackground}}>Ustawienia</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    lastCheckedText: {
        fontSize: 12,
        color: 'gray',
        marginTop: 5,
    },
    lastCheckedContainer: {
        gap: 5,
        backgroundColor: '#f3f3f3',
        padding: 10,
        borderRadius: 10
    }
});

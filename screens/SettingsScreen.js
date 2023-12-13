import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';
import Slider from "@react-native-community/slider";
import {KSS_SERVER_URL} from "../util/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {objectTranslations} from "../util/Utils";

export default function SettingsScreen() {
    const {isDarkTheme, setIsDarkTheme, themes} = useContext(ThemeContext);
    const [inputThreshold, setInputThreshold] = useState(0);
    const [outputThreshold, setOutputThreshold] = useState(0);
    const [eventsConfig, setEventsConfig] = useState([{}]);
    const [isLoading, setIsLoading] = useState(true);
    const theme = isDarkTheme ? themes.dark : themes.light;

    useEffect(() => {
        loadSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch(`${KSS_SERVER_URL}/api/kss/preferences`);
            if (!response.ok) {
                throw new Error('Nie można pobrać ustawień');
            }
            const data = await response.json();
            setInputThreshold(data.inputThreshold);
            setOutputThreshold(data.outputThreshold);
            setEventsConfig(data.eventsConfig)
        } catch (error) {
            Alert.alert('Błąd', 'Nie udało się pobrać ustawień: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const loadSettings = async () => {
        const settings = JSON.parse(await AsyncStorage.getItem('themeSettings'))

        console.debug(settings)

        if (settings) {
            setIsDarkTheme(settings.isDarkTheme)
        }

        await fetchSettings()
    };

    const handleSaveSettings = async () => {
        const settings = {
            inputThreshold,
            outputThreshold,
            eventsConfig
        };

        try {
            // Zapisanie ustawień motywu lokalnie
            await AsyncStorage.setItem('themeSettings', JSON.stringify({isDarkTheme}));

            // Wysłanie pozostałych ustawień na serwer
            const response = await fetch(`${KSS_SERVER_URL}/api/kss/preferences`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                console.log('Ustawienia zapisane pomyślnie.');
                Alert.alert(
                    "Hura!",
                    "Ustawienia zapisane pomyślnie.",
                    [{text: "OK"}]
                );
            } else {
                Alert.alert(
                    "Błąd Zapisu",
                    "Nie udało się zapisać ustawień. Spróbuj ponownie.",
                    [{text: "OK"}]
                );
            }
        } catch (error) {
            Alert.alert(
                "Błąd Zapisu",
                "Nie udało się zapisać ustawień. Spróbuj ponownie.",
                [{text: "OK"}]
            );
        }
    };

    const updateEventConfig = (eventName, precisionThreshold, important) => {
        setEventsConfig(prev => prev.map(event =>
            event.eventName === eventName
                ? {...event, important, precisionThreshold}
                : event
        ));
    };

    if (isLoading) {
        return <ActivityIndicator size="large"/>;
    }

    return (
        <ScrollView>
            <View style={[styles.container, {backgroundColor: theme.background}]}>
                <Text style={[styles.title, {color: theme.text}]}>Ustawienia</Text>
                <View style={styles.settingItem}>
                    <Text style={[styles.settingText, {color: theme.text}]}>Tryb ciemny</Text>
                    <Switch
                        value={isDarkTheme}
                        onValueChange={(value) => setIsDarkTheme(value)}
                    />
                </View>
                <View style={styles.settingItemH}>
                    <Text style={[styles.settingText, {color: theme.text}]}>Stabilizacja
                        wejściowa: {inputThreshold}s</Text>
                    <Slider
                        style={{width: 200}}
                        minimumValue={0}
                        maximumValue={10}
                        step={1}
                        value={inputThreshold}
                        onValueChange={value => setInputThreshold(value)}
                    />
                </View>
                <View style={styles.settingItemH}>
                    <Text style={[styles.settingText, {color: theme.text}]}>Stabilizacja
                        wyjściowa: {outputThreshold}s</Text>
                    <Slider
                        style={{width: 200}}
                        minimumValue={0}
                        maximumValue={10}
                        step={1}
                        value={outputThreshold}
                        onValueChange={value => setOutputThreshold(value)}
                    />
                </View>
                {eventsConfig.map(event => (
                    <View style={styles.settingItemSegmentH} key={event.eventName}>
                        <View style={styles.settingItem}>
                            <Text
                                style={[styles.settingText, {color: theme.text}]}>{objectTranslations[event.eventName]} -
                                ważny?</Text>
                            <Switch
                                value={event.important}
                                onValueChange={(value) => updateEventConfig(event.eventName, event.precisionThreshold, value)}
                            />
                        </View>
                        <View>

                        </View>
                        <Text style={[styles.settingText, {color: theme.text}]}>Próg
                            pewności {event.precisionThreshold}%</Text>
                        <Slider
                            style={{width: 200}}
                            minimumValue={50}
                            maximumValue={100}
                            step={1}
                            value={event.precisionThreshold}
                            onValueChange={(value) => updateEventConfig(event.eventName, value, event.important)}
                        />
                    </View>
                ))}
                <TouchableOpacity onPress={() => handleSaveSettings()}
                                  style={{
                                      padding: 10,
                                      backgroundColor: theme.buttonBackground,
                                      borderRadius: 5,
                                      shadowColor: "#000",
                                      elevation: 2,
                                      margin: 20
                                  }}>
                    <Text style={{color: theme.buttonText, backgroundColor: theme.buttonBackground}}>Zapisz
                        ustawienia</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%',
        padding: 10,
        marginBottom: 10
    },
    settingItemH: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%',
        padding: 10,
        marginBottom: 10,
        gap: 15
    },
    settingItemSegmentH: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%',
        padding: 10,
        marginBottom: 10,
        gap: 10,
        borderTopColor: 'black',
        borderTopWidth: 1
    },
    settingText: {
        fontSize: 18,
    },
});

import React, {useCallback, useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ThemeContext, ThemeProvider} from './context/ThemeContext';
import HomeScreen from './screens/HomeScreen';
import EventsScreen from './screens/EventsScreen';
import SettingsScreen from './screens/SettingsScreen';
import {useFonts} from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const Stack = createNativeStackNavigator();

function AppInner() {
    const {isDarkTheme, themes} = useContext(ThemeContext);
    const theme = isDarkTheme ? themes.dark : themes.light;

    const [fontsLoaded, fontError] = useFonts({
        'Lato-Black': require('./assets/fonts/Lato-Regular.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <NavigationContainer theme={{
            colors: {
                background: theme.background,
                text: theme.text,
            }
        }}>
            <Stack.Navigator initialRouteName="Home" screenOptions={{
                headerStyle: {
                    backgroundColor: '#7FB069', // Ustaw swój kolor
                },
            }}>
                <Stack.Screen name="Home" component={HomeScreen}/>
                <Stack.Screen name="Events" component={EventsScreen}/>
                <Stack.Screen name="Settings" component={SettingsScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <AppInner/>
        </ThemeProvider>
    );
}

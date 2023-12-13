import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ThemeContext, ThemeProvider} from './context/ThemeContext';
import HomeScreen from './screens/HomeScreen';
import EventsScreen from './screens/EventsScreen';
import SettingsScreen from './screens/SettingsScreen';
import {useFonts} from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import {KSS_SERVER_URL} from "./util/Config";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig.extra.eas.projectId,
        });
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token.data;
}


const Stack = createNativeStackNavigator();

function AppInner() {
    const {isDarkTheme, themes} = useContext(ThemeContext);
    const theme = isDarkTheme ? themes.dark : themes.light;

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {

    registerForPushNotificationsAsync().then(token => {
        setExpoPushToken(token);

        fetch(`${KSS_SERVER_URL}/api/kss/preferences/pushToken`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Nie udało się zapisać tokena');
                }
                console.log('Token push został zapisany');
            })
            .catch(error => {
                console.error('Błąd podczas zapisywania tokena push:', error);
            });
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
    });

    return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
    };
}

,
[]
)
;

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

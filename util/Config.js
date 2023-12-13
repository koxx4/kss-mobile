import { Platform } from 'react-native';

const isEmulator = Platform.OS === 'android' && Platform.isTV === false;

export const KSS_SERVER_ADDRESS =  isEmulator ? 'http://10.0.2.2' : 'http://100.102.37.135';
export const KSS_SERVER_PORT =  isEmulator ? '8080' : '8080';
export const KSS_SERVER_URL = `http://100.102.37.135:${KSS_SERVER_PORT}`;

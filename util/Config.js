import { Platform } from 'react-native';

const isEmulator = Platform.OS === 'android' && Platform.isTV === false;

export const KSS_SERVER_ADDRESS =  isEmulator ? 'http://10.0.2.2' : 'http://localhost';
export const KSS_SERVER_PORT =  isEmulator ? '8080' : '8080';
export const KSS_SERVER_URL = `${KSS_SERVER_ADDRESS}:${KSS_SERVER_PORT}`;

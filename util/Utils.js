import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import moment from 'moment';

export const objectTranslations = {
    "fire": "Ogień",
    "smoke": "Dym",
    "human": "Człowiek",
    "other": "Inne",
    "open_pot": "Otwarty garnek",
    "open_pot_boiling": "Gotujący się otwarty garnek",
    "closed_pot": "Zamknięty garnek",
    "closed_pot_boiling": "Gotujący się zamknięty garnek",
    "dish": "Naczynie",
    "gas": "Gaz",
    "pan": "Patelnia",
    "closed_pan": "Zamknięta patelnia",
};
export const handleDownload = async (url) => {
    let date = moment().format('YYYYMMDDhhmmss')
    let fileUri = FileSystem.documentDirectory + `${date}.jpg`;
    try {
        const res = await FileSystem.downloadAsync(url, fileUri)
        await saveFile(res.uri)
    } catch (err) {
        console.log("FS Err: ", err)
    }
}

const saveFile = async (fileUri) => {
    const {status} = await MediaLibrary.getPermissionsAsync(true);

    if (status !== 'granted') {
        alert('Brak uprawnień do zapisu obrazów w galerii');
        return;
    }

    try {
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        const album = await MediaLibrary.getAlbumAsync('KSS');
        if (album == null) {
            await MediaLibrary.createAlbumAsync('KSS', asset, false);
        } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
    } catch (err) {
        alert(`Błąd przy zapisie zdjęcia ${err}`);
    }
}
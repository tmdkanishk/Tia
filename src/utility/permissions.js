import { PermissionsAndroid } from "react-native";
import { Platform } from "react-native";

export const checkPermission = async () => {
    // Function to check the platform
    // If iOS then start downloading
    // If Android then ask for permission

    if (Platform.OS === 'ios') {
        return true;
    } else {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Tia App Storage Permission',
                    message:
                        'Tia App needs access to your Storage ' +
                        'so you can download files.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );

            console.log("granted", granted);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // Once user grant the permission start downloading
                console.log('Storage Permission Granted.');
                // downloadImage();
                return true;
            } else {
                // If permission denied then show alert
                alert('Storage Permission Not Granted');
                return false;
            }
        } catch (err) {
            // To handle permission related exception
            throw err;
        }
    }
};

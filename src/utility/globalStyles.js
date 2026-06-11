import { StyleSheet } from "react-native";
import { color } from '../utility/color';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.screenBackground,
        paddingHorizontal: 12,
        paddingVertical: 40,
        paddingBottom: 80,
        height: '100%',
    },


    newContainer: {
        // backgroundColor: color.screenBackground,
        backgroundColor: color.cardBackground,
        // paddingHorizontal: 12,
        height: '100%',
        width: '100%',
        backgroundColor: color.primaryBlueDark,
    },

    mainContainer: {
        backgroundColor: color.screenBackground,
        height: '100%',
    },

    innerContainer: {
        flex: 1,
        backgroundColor: color.screenBackground,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: 12
    }
})


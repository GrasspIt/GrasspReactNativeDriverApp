import React from 'react';
import { View } from "react-native";
import { Button, useTheme } from "react-native-paper";

type AlertSuccessButtonsForRemainingScansProps = {
    navigation;
    closeSuccessAlert: () => any;
    goBackOnPress?: () => any;
    scanAnotherText?: string;
    backText?: string;
}

/**Renders a View with 2 buttons whenever an item has a remaining quantity to scan
 *  Buttons rendered are a 'go back' button and 'scan another' button. Button text is customizable
 * */
const AlertSuccessButtonsForRemainingScans = ({
                                                  navigation,
                                                  closeSuccessAlert,
                                                  scanAnotherText = 'Scan Another',
                                                  backText = 'Go Back',
                                                  goBackOnPress = () => navigation.goBack()
                                              }: AlertSuccessButtonsForRemainingScansProps) => {
    const {colors} = useTheme();

    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '100%'}}>
            <Button
                mode={'outlined'}
                onPress={goBackOnPress}
                style={{marginBottom: 20,}}
                color={colors.text}
            >
                {backText}
            </Button>
            <Button mode={'contained'}
                    onPress={closeSuccessAlert}
                    style={{
                        backgroundColor: colors.primary,
                        marginBottom: 20,
                    }}
                    labelStyle={{color: 'white'}}
            >
                {scanAnotherText}
            </Button>
        </View>
    )
}

export default AlertSuccessButtonsForRemainingScans;
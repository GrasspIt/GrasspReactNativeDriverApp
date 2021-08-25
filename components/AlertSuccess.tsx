import React from 'react';
import LottieView from 'lottie-react-native';
import { ActivityIndicator, Button, Dialog, Paragraph, Portal, useTheme } from "react-native-paper";
import { StyleSheet, View } from "react-native";

type AlertSuccessProps = {
    isVisible: boolean;
    onDismiss: () => any;
    title: string;
    message: string;
    isLoading?: boolean;
    buttonText?: string;
    buttonOnPressSubmit: () => any;
}

const AlertSuccess = ({
                          isVisible,
                          onDismiss,
                          title,
                          message,
                          buttonOnPressSubmit,
                          isLoading = false,
                          buttonText = 'Ok'
                      }: AlertSuccessProps) => {
    const {colors} = useTheme();

    return (
        <Portal>
            <Dialog visible={isVisible} onDismiss={onDismiss} style={styles.dialogContainer}>
                <Dialog.Title style={styles.title}>{title}</Dialog.Title>

                <Dialog.Content>
                        <LottieView
                            source={require('../assets/success-check-mark-animated-grassp.json')}
                            //source={'../assets/success-check-mark-animated-grassp'}
                            autoPlay={true}
                            loop={false}
                            //progress={0}
                            speed={2}
                            style={styles.animation}
                            //style={styles.animation}
                        />
                    <Paragraph>{message}</Paragraph>
                </Dialog.Content>

                <Dialog.Actions style={styles.actions}>
                    <Button mode={'contained'} onPress={buttonOnPressSubmit} style={styles.button} labelStyle={{color: 'white'}}>{buttonText}</Button>
                </Dialog.Actions>
        </Dialog>
</Portal>
)
}

//TODO: Style button

const styles = StyleSheet.create({
    dialogContainer: {
        flexDirection: 'column',
        paddingBottom: 10
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
    },
    actions: {
        flexDirection: 'column'
    },
    animation: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 20
    },
    button: {
        alignSelf: 'center',
        width: '75%',
    }
});

export default AlertSuccess;
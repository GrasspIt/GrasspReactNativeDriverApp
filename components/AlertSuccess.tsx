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
                {isLoading
                    ? <ActivityIndicator size='large' color={colors.primary}/>
                    :
                    <React.Fragment>
                        <Dialog.Title style={styles.title}>{title}</Dialog.Title>

                        <Dialog.Content>
                                <LottieView
                                    //source={require('../assets/success-check-mark-animated-grassp.json')}
                                    source={'../assets/success-check-mark-animated-grassp'}
                                    autoPlay={true}
                                    style={styles.animation}
                                />
                            <Paragraph>{message}</Paragraph>
                        </Dialog.Content>

                        <Dialog.Actions>
                            <Button mode={'contained'} onPress={buttonOnPressSubmit}>{buttonText}</Button>
                        </Dialog.Actions>
                    </React.Fragment>
                }
            </Dialog>
        </Portal>
    )
}

//TODO: Style button

const styles = StyleSheet.create({
    dialogContainer: {
      //flex: 1,
        flexDirection: 'column',
    },
    title: {
        textAlign: 'center',
    },
    animation: {
        flex: 1,
        position: 'relative'
    }
});

export default AlertSuccess;
import React from 'react';
import LottieView from 'lottie-react-native';
import { ActivityIndicator, Button, Dialog, Paragraph, Portal, Title, useTheme } from "react-native-paper";
import { StyleSheet, Text, View } from "react-native";

type AlertSuccessOrErrorProps = {
    isVisible: boolean;
    onDismiss: () => any;
    title: string;
    message: string | JSX.Element;
    buttonOnPressSubmit: () => any;
    isLoading?: boolean;
    buttonText?: string;
    isError?: boolean;
    buttonsContainer?: JSX.Element;
}

const AlertSuccessOrError = ({
                                 isVisible,
                                 onDismiss,
                                 title,
                                 message,
                                 buttonOnPressSubmit,
                                 isLoading = false,
                                 buttonText = 'Ok',
                                 isError = false,
                                 buttonsContainer,
                             }: AlertSuccessOrErrorProps) => {
    const {colors} = useTheme();

    return (
        <Portal>
            <Dialog visible={isVisible} onDismiss={onDismiss} style={styles.dialogContainer}>

                <Dialog.Content style={{paddingBottom: 20}}>
                    <View style={[styles.animation, {width: isError ? 150 : 100, height: isError ? 150 : 100}]}>
                        <LottieView
                            source={isError ? require('../assets/error-message-lottie-grassp.json') : require('../assets/success-check-mark-animated-grassp.json')}
                            autoPlay={true}
                            loop={isError ? true : false}
                            speed={1}
                        />
                    </View>
                    <Title style={styles.title}>{title}</Title>
                    {
                        typeof message === 'string'
                            ? <Paragraph style={styles.message}>{message}</Paragraph>
                            : message
                    }
                </Dialog.Content>

                <Dialog.Actions style={styles.actions}>
                    {
                        buttonsContainer
                            ? buttonsContainer
                            : <Button mode={'contained'}
                                      onPress={buttonOnPressSubmit}
                                      style={[styles.button, {
                                          backgroundColor: isError ? colors.error : colors.primary,
                                          marginBottom: 20
                                      }]}
                                      labelStyle={{color: 'white'}}>{buttonText}</Button>
                    }
                </Dialog.Actions>

            </Dialog>
        </Portal>
    )
}

const styles = StyleSheet.create({
    dialogContainer: {
        flexDirection: 'column',
    },
    title: {
        textAlign: 'center',
        //marginBottom: 20,
    },
    message: {
        textAlign: 'center',
    },
    actions: {
        flexDirection: 'column',
    },
    animation: {
        alignSelf: 'center',
        //marginBottom: 10,
    },
    button: {
        alignSelf: 'center',
        width: '75%',
    }
});

export default AlertSuccessOrError
import React from 'react';
import LottieView from 'lottie-react-native';
import { ActivityIndicator, Button, Dialog, Paragraph, Portal, useTheme } from "react-native-paper";
import { StyleSheet, View } from "react-native";

type AlertSuccessOrErrorProps = {
    isVisible: boolean;
    onDismiss: () => any;
    title: string;
    message: string;
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
                                 buttonsContainer
                             }: AlertSuccessOrErrorProps) => {
    const {colors} = useTheme();

    return (
        <Portal>
            <Dialog visible={isVisible} onDismiss={onDismiss} style={styles.dialogContainer}>
                <Dialog.Title style={styles.title}>{title}</Dialog.Title>

                <Dialog.Content>
                    <LottieView
                        source={isError ? require('../assets/error-message-lottie-grassp.json') : require('../assets/success-check-mark-animated-grassp.json')}
                        autoPlay={true}
                        loop={isError ? true : false}
                        speed={1}
                        style={[styles.animation, {width: isError ? 150 : 100, height: isError ? 150 : 100}]}
                    />
                    <Paragraph>{message}</Paragraph>
                </Dialog.Content>

                <Dialog.Actions style={styles.actions}>
                    {
                        buttonsContainer
                            ? buttonsContainer

                            : <Button mode={'contained'}
                                onPress={buttonOnPressSubmit}
                                style={[styles.button, {
                                    backgroundColor: isError ? colors.error : colors.primary,
                                    marginBottom: isError ? 0 : 20
                                }]}
                                labelStyle={{color: 'white'}}>{buttonText}</Button>
                    }
                    {/*<Button mode={'contained'}*/}
                    {/*        onPress={buttonOnPressSubmit}*/}
                    {/*        style={[styles.button, {*/}
                    {/*            backgroundColor: isError ? colors.error : colors.primary,*/}
                    {/*            marginBottom: isError ? 0 : 20*/}
                    {/*        }]}*/}
                    {/*        labelStyle={{color: 'white'}}>{buttonText}</Button>*/}
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
    },
    button: {
        alignSelf: 'center',
        width: '75%',
    }
});

export default AlertSuccessOrError
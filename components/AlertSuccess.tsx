import React from 'react';
import LottieView from 'lottie-react-native';
import { ActivityIndicator, Button, Dialog, Paragraph, Portal, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";

type AlertSuccessProps = {
    isVisible: boolean;
    onDismiss: () => any;
    title: string;
    message: string;
    isLoading?: boolean;
    buttonText?: string;
}

const AlertSuccess = ({
                          isVisible,
                          onDismiss,
                          title,
                          message,
                          isLoading = false,
                          buttonText = 'Ok'
                      }: AlertSuccessProps) => {
    const {colors} = useTheme();

    return (
        <Portal>
            <Dialog visible={isVisible} onDismiss={onDismiss}>
                {isLoading
                    ? <ActivityIndicator size='large' color={colors.primary}/>
                    :
                    <React.Fragment>
                        <Dialog.Title>{title}</Dialog.Title>

                        <Dialog.Content>
                            <LottieView
                                //source={require('../assets/success-check-mark-animated-grassp.json')}
                                source={'../assets/success-check-mark-animated-grassp.json'}
                            />
                            <Paragraph>{message}</Paragraph>
                        </Dialog.Content>

                        <Dialog.Actions>
                            <Button mode={'contained'}>{buttonText}</Button>
                        </Dialog.Actions>
                    </React.Fragment>
                }
            </Dialog>
        </Portal>
    )
}

const styles = StyleSheet.create({
});

export default AlertSuccess;
import React from 'react';
import LottieView from 'lottie-react-native';
import { ActivityIndicator, Button, Dialog, Paragraph, Portal, Title, useTheme } from "react-native-paper";
import { StyleSheet, Text, View } from "react-native";
import lottieAssets, { LottieAnimationNames } from "../assets/lottie-animations/lottie-animation-asset-map";

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
    loop?: boolean;
    customAnimationName?: LottieAnimationNames;
    animationViewStyles?: { [key: string]: string | number };
    titleStyles?: { [key: string]: string | number };
    messageTextStyles?: { [key: string]: string | number };
}


/**Renders animated modal
 *
 * -> to pass in a new animation, add the lottie JSON to assets/lottieAnimations.
 * -> then, update lottie-animation-asset-map with the new import. Also update the LottieAnimationNames type found in that file
 * */
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
                                 loop,
                                 customAnimationName,
                                 animationViewStyles,
                                 titleStyles,
                                 messageTextStyles,
                             }: AlertSuccessOrErrorProps) => {
    const {colors} = useTheme();

    const determineSource = () => {
        if (customAnimationName) return lottieAssets[customAnimationName];
        if (isError) return lottieAssets['error'];
        return lottieAssets['checkmarkSuccess'];
    }

    const lottieSource = determineSource();

    return (
        <Portal>
            <Dialog visible={isVisible} onDismiss={onDismiss} style={styles.dialogContainer}>

                <Dialog.Content style={{paddingBottom: 20}}>
                    <View style={[styles.animation, {width: isError ? 150 : 100, height: isError ? 150 : 100}, {...animationViewStyles}]}>
                        <LottieView
                            //source={customAnimationFileName ? require(`../assets/${customAnimationFileName}`) : isError ? require('../assets/error-message-lottie-grassp.json') : require('../assets/success-check-mark-animated-grassp.json')}
                            source={lottieSource}
                            //source={require('../assets/error-message-lottie-grassp.json')}
                            //source={require(sourceForLottie)}
                            autoPlay={true}
                            loop={loop ? loop : isError ? true : false}
                            speed={1}
                        />
                    </View>
                    <Title style={[styles.title, {...titleStyles}]}>{title}</Title>
                    {
                        typeof message === 'string'
                            ? <Paragraph style={[styles.message, {...messageTextStyles}]}>{message}</Paragraph>
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
    },
    message: {
        textAlign: 'center',
    },
    actions: {
        flexDirection: 'column',
    },
    animation: {
        alignSelf: 'center',
    },
    button: {
        alignSelf: 'center',
        width: '75%',
    }
});

export default AlertSuccessOrError
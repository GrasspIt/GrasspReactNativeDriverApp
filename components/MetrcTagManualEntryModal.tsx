import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import {
    Button,
    Caption,
    Card,
    IconButton,
    Paragraph,
    Subheading,
    TextInput,
    Title,
    useTheme,
} from "react-native-paper";
import AlertSuccessOrError from "./AlertSuccessOrError";
import { successAlertMessageStyle } from "./MetrcTagScanner";
import AlertSuccessButtonsForRemainingScans from "./buttons/AlertSuccessButtonsForRemainingScans";

interface MetrcTagManualEntryModalProps {
    submitTagEntry: (data) => any;
    productName: string;
    productId: string;
    orderDetailid: string;
    orderId: string;
    navigation;
    successAlertVisible: boolean;
    errorAlertVisible: boolean;
    closeSuccessAlert: () => any;
    closeErrorAlert: () => any;
    scanCountForOrderDetail: number;
    orderDetailQuantity: number | undefined;
}

const MetrcTagManualEntryModal = ({
                                      submitTagEntry,
                                      productName,
                                      productId,
                                      orderDetailid,
                                      orderId,
                                      navigation,
                                      successAlertVisible,
                                      errorAlertVisible,
                                      closeSuccessAlert,
                                      closeErrorAlert,
                                      scanCountForOrderDetail,
                                      orderDetailQuantity,
                                  }: MetrcTagManualEntryModalProps) => {
    const {colors} = useTheme();

    const [text, setText] = useState<string>('');
    const textInputRef = useRef<any>(null);

    useEffect(() => {
        //if (textInputRef !== null) {
        //    //textInputRef.current.focus()
        //    alert(`The component is focused. : ${textInputRef.current.isFocused()}`)
        //}
        Platform.OS === 'ios'
            ? textInputRef.current.focus()
            : setTimeout(() => textInputRef.current.focus(), 40)
    }, [])

    const handleSubmit = () => {
        if (text.trim() === '') {
            alert('A tag must be inputted!')
        } else {
            textInputRef.current.blur();
            submitTagEntry(text);
        }
    }

    //TODO: Change 'Scanned' to another word?
    /**Message to display when a tag submission is successful*/
    const successAlertMessage = (
        <View style={successAlertMessageStyle.view}>
            <Subheading style={successAlertMessageStyle.subheading}>{productName}</Subheading>
            <Paragraph>-- {scanCountForOrderDetail} of {orderDetailQuantity} Scanned --</Paragraph>
        </View>
    )

    return (
        <SafeAreaView style={styles.componentContainer}>
            <Card style={styles.card}>
                <Card.Title title="Metrc Tag Manual Entry" subtitle={productName}/>
                <Card.Content style={styles.cardContent}>
                    {/*<Title>Card title</Title>*/}
                    <Paragraph style={{fontSize: 16}}>Please enter the Metrc Tag below:</Paragraph>

                    <View style={{marginTop: 20}}>
                        <TextInput
                            //label={'Metrc Tag'}
                            value={text}
                            onChangeText={text => setText(text)}
                            placeholder={'1A40A03000005DD000003479'}
                            ref={textInputRef}
                            autoCorrect={false}
                            autoFocus={true}
                            //blurOnSubmit={true}
                            onSubmitEditing={handleSubmit}
                            returnKeyType={'done'}
                            textContentType={'none'}
                            right={<TextInput.Icon
                                name={'close-circle'}
                                onPress={() => setText('')}
                                style={{opacity: .7}}
                            />}
                        />
                    </View>
                    <View style={{marginTop: 16}}>
                        <Caption style={{marginTop: 10}}>Metrc tag will sometimes be labeled with 'PKID'</Caption>
                        <Caption>The tag will be long - about 24 characters</Caption>
                    </View>

                    <Card.Actions style={styles.cardActions}>
                        <Button
                            onPress={() => navigation.goBack()}
                            mode={'contained'}
                            labelStyle={{padding: 4, color: 'black'}}
                            style={{backgroundColor: '#FFBBAD',}}
                        >
                            Cancel
                        </Button>
                        <Button
                            mode={'contained'}
                            labelStyle={{padding: 4, color: colors.surface}}
                            style={{width: '50%',}}
                            onPress={handleSubmit}
                        >
                            Submit
                        </Button>
                    </Card.Actions>
                </Card.Content>

            </Card>

            {/*Success Alert*/}
            <AlertSuccessOrError isVisible={successAlertVisible}
                                 onDismiss={closeSuccessAlert}
                                 title={'Tag Submission Successful!'}
                                 message={successAlertMessage}
                                 buttonOnPressSubmit={closeSuccessAlert}
                                 buttonsContainer={(orderDetailQuantity && scanCountForOrderDetail < orderDetailQuantity)
                                     ? <AlertSuccessButtonsForRemainingScans
                                         navigation={navigation}
                                         closeSuccessAlert={closeSuccessAlert}
                                     />
                                     : undefined}
            />

            {/*TODO - Test for different errors. Change error message to be whatever is returned from the backend*/}
            {/*Error Alert*/}
            <AlertSuccessOrError
                isVisible={errorAlertVisible}
                onDismiss={closeErrorAlert}
                title={'Error Encountered!'}
                message={`The Metrc tag submission for ${productName} was not successful`}
                buttonText={'Retry'}
                buttonOnPressSubmit={closeErrorAlert}
                isError={true}
            />

        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    componentContainer: {
        flex: 1,
        //borderColor: 'green',
        //borderWidth: 4,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    card: {
        flex: 1,
        //borderColor: 'blue',
        //borderWidth: 2,
    },
    cardContent: {
        marginTop: 16,
        //borderColor: 'tomato',
        //borderWidth: 2,
        flex: 1
    },
    cardActions: {
        //flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 32,
        //borderColor: 'brown',
        //borderWidth: 2,
        paddingLeft: 0,
        paddingRight: 0,
    }
});

export default MetrcTagManualEntryModal;
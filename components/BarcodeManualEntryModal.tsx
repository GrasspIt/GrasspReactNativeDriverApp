import React, { useEffect, useState, useRef } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import {
    Button,
    Caption,
    Card,
    Paragraph,
    Subheading,
    TextInput,
    useTheme,
} from "react-native-paper";
import AlertSuccessOrError from "./AlertSuccessOrError";
import { successAlertMessageStyle } from "./BarcodeScanner";
import AlertSuccessButtonsForRemainingScans from "./buttons/AlertSuccessButtonsForRemainingScans";

interface BarcodeManualEntryModalProps {
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
    errorText: string;
    isMetrcDSPR: boolean;
}

const BarcodeManualEntryModal = ({
                                     submitTagEntry,
                                     productName,
                                     navigation,
                                     successAlertVisible,
                                     errorAlertVisible,
                                     closeSuccessAlert,
                                     closeErrorAlert,
                                     scanCountForOrderDetail,
                                     orderDetailQuantity,
                                     errorText,
                                     orderId,
                                     isMetrcDSPR,
                                 }: BarcodeManualEntryModalProps) => {
    const {colors} = useTheme();

    const [text, setText] = useState<string>('');
    const textInputRef = useRef<any>(null);

    /**On Mount, focus the TextInput to show keyboard*/
    useEffect(() => {
        Platform.OS === 'ios'
            ? textInputRef.current.focus()
            : setTimeout(() => textInputRef.current.focus(), 40)
    }, [])

    /**Submit metrc tag entry
     *  if there is no text inputed, an alert is shown and nothing is submitted
     *  on submit, the textInput is blurred
     * */
    const handleSubmit = () => {
        if (text.trim() === '') {
            alert('A tag must be inputted!')
        } else {
            textInputRef.current.blur();
            submitTagEntry(text);
        }
    }

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
                <Card.Title title={isMetrcDSPR ? 'Metrc Tag Manual Entry' : 'Barcode Manual Entry'} subtitle={productName}/>
                <Card.Content style={styles.cardContent}>

                    <Paragraph style={{fontSize: 16}}>{`Please enter the ${isMetrcDSPR ? 'Metrc Tag' : 'Barcode'} below:`}</Paragraph>

                    <View style={{marginTop: 20}}>
                        <TextInput
                            value={text}
                            onChangeText={text => setText(text)}
                            placeholder={isMetrcDSPR ? '1A40A03000005DD000003479' : '4352-11'}
                            ref={textInputRef}
                            autoCorrect={false}
                            autoFocus={true}
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
                    {isMetrcDSPR &&
                    <View style={{marginTop: 16}}>
                        <Caption style={{marginTop: 10}}>The tag will be long - about 24 characters</Caption>
                    </View>
                    }

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
                                         goBackOnPress={() => navigation.navigate('OrderToScan', {orderId})}
                                     />
                                     : undefined}
            />

            {/*Error Alert*/}
            <AlertSuccessOrError
                isVisible={errorAlertVisible}
                onDismiss={closeErrorAlert}
                title={'Error Encountered!'}
                message={errorText || `The Metrc tag submission for "${productName}" was not successful`}
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
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    card: {
        flex: 1,
    },
    cardContent: {
        marginTop: 16,
        flex: 1
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 32,
        paddingLeft: 0,
        paddingRight: 0,
    }
});

export default BarcodeManualEntryModal;
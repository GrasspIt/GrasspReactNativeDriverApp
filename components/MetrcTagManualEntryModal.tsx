import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { Button, Caption, Card, IconButton, Paragraph, TextInput, Title, useTheme, } from "react-native-paper";
import AlertSuccess from "./AlertSuccess";

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
                                      closeSuccessAlert
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
            submitTagEntry(text);
        }
    }

    return (
        <SafeAreaView style={styles.componentContainer}>
            <Card style={styles.card}>
                <Card.Title title="Metrc Tag Manual Entry" subtitle={productName}/>
                <Card.Content style={styles.cardContent}>
                    {/*<Title>Card title</Title>*/}
                    <Paragraph style={{fontSize: 16}}>Please enter the Metrc Tag below:</Paragraph>
                    <Caption>Note: text will autocapitalize</Caption>

                    <View style={{marginTop: 16}}>
                        <TextInput
                            //label={'Metrc Tag'}
                            value={text}
                            onChangeText={text => setText(text)}
                            placeholder={'1A40A03000005DD000003479'}
                            ref={textInputRef}
                            autoCorrect={false}
                            autoFocus={true}
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

            <AlertSuccess isVisible={successAlertVisible}
                          onDismiss={closeSuccessAlert}
                          title={'Success!'}
                          buttonOnPressSubmit={closeSuccessAlert}
                          message={`The Metrc Tag for ${productName} has been successfully entered`}
            />

        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    componentContainer: {
        flex: 1,
        borderColor: 'green',
        borderWidth: 4,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    card: {
        flex: 1,
        borderColor: 'blue',
        borderWidth: 2,
    },
    cardContent: {
        marginTop: 16,
        borderColor: 'tomato',
        borderWidth: 2,
        flex: 1
    },
    cardActions: {
        //flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 32,
        borderColor: 'brown',
        borderWidth: 2,
        paddingLeft: 0,
        paddingRight: 0,
    }
    //centeredView: {
    //    flex: 1,
    //    justifyConstent: "center",
    //    alignItems: "center",
    //    borderColor: 'tomato',
    //    borderWidth: 4,
    //    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    //},
    //modalView: {
    //    //height: '100%',
    //    //width: '100%',
    //    //margin: 20,
    //    backgroundColor: "blue",
    //    //borderRadius: 20,
    //    padding: 35,
    //    alignItems: "center",
    //    justifyContent: 'center',
    //},
    //button: {
    //    borderRadius: 20,
    //    padding: 10,
    //    elevation: 2
    //},
    //buttonOpen: {
    //    backgroundColor: "#F194FF",
    //},
    //buttonClose: {
    //    backgroundColor: "#2196F3",
    //},
    //textStyle: {
    //    color: "white",
    //    fontWeight: "bold",
    //    textAlign: "center"
    //},
    //modalText: {
    //    marginBottom: 15,
    //    textAlign: "center"
    //}
});

export default MetrcTagManualEntryModal;
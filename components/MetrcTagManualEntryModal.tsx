import React, { useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { Button, Caption, Card, IconButton, Paragraph, TextInput, Title, useTheme, } from "react-native-paper";


interface MetrcTagManualEntryModalProps {
    submitTagEntry: (data) => any;
    productName: string;
    navigation;
}

const MetrcTagManualEntryModal = ({ submitTagEntry, productName, navigation }: MetrcTagManualEntryModalProps) => {
    const { colors } = useTheme();

    const [text, setText] = useState('');

    return (
        <SafeAreaView style={styles.componentContainer}>
            <Card style={styles.card}>
                <Card.Title title="Metrc Tag Manual Entry" />
                <Card.Content style={styles.cardContent}>
                    {/*<Title>Card title</Title>*/}
                    <Paragraph style={{ fontSize: 16}}>Please enter the Metrc Tag below:</Paragraph>

                    <View style={{ marginTop: 16}}>
                        <TextInput
                            //label={'Metrc Tag'}
                            value={text}
                            onChangeText={text => setText(text)}
                            placeholder={'1A40A03000005DD000003479'}
                            //right={() => <IconButton icon={'close'} color={'black'} size={50} onPress={() => setText('')} />}
                            right={<TextInput.Icon
                                name={'close-circle'}
                                onPress={() => setText('')}
                                style={{opacity: .7}}
                            />}
                        />
                    </View>
                    <View style={{ marginTop: 16}}>
                        <Caption style={{marginTop: 10}}>This will sometimes be labeled with 'PKID'</Caption>
                        <Caption>The tag will be long - about 24 characters</Caption>
                    </View>

                    <Card.Actions style={styles.cardActions}>
                        <Button
                            onPress={() => navigation.goBack()}
                            mode={'outlined'}
                            labelStyle={{ padding: 4, color: 'black', opacity: .8 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            mode={'contained'}
                            labelStyle={{ padding: 4, color: colors.surface }}
                        >
                            Submit
                        </Button>
                    </Card.Actions>
                </Card.Content>

            </Card>

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
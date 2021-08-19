import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, StatusBar, SafeAreaView, Platform } from "react-native";
import { Button, Card, Paragraph, Title } from "react-native-paper";

interface MetrcTagEntryModalProps {
    isVisible: boolean;
    toggleModalVisibility: () => any;
}

const MetrcTagEntryModal = ({ isVisible, toggleModalVisibility }:MetrcTagEntryModalProps) => {

    return (
        <SafeAreaView style={styles.componentContainer}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    toggleModalVisibility();
                }}
                statusBarTranslucent={true}
                style={styles.modal}
            >

                <Card style={styles.card}>
                    <Card.Title title="Card Title" subtitle="Card Subtitle" />
                    <Card.Content>
                        <Title>Card title</Title>
                        <Paragraph>Card content</Paragraph>
                    </Card.Content>
                    <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                    <Card.Actions>
                        <Button>Cancel</Button>
                        <Button>Ok</Button>
                    </Card.Actions>

                </Card>

            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    componentContainer: {
        flex: 1,
        //justifyContent: "center",
        //alignItems: "center",
        borderColor: 'green',
        borderWidth: 4,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    modal: {
        //flex: 1,
        marginTop: 30,
    },
    card: {

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


export default MetrcTagEntryModal;


//<View style={styles.centeredView}>
//    <View style={styles.modalView}>
//        <Text style={styles.modalText}>Hello World!</Text>
//        <Pressable
//            style={[styles.button, styles.buttonClose]}
//            onPress={() => toggleModalVisibility()}
//        >
//            <Text style={styles.textStyle}>Hide Modal </Text>
//        </Pressable>
//    </View>
//</View>
import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import { ProductInOrder } from "../selectors/orderSelectors";
import { useTheme, Button } from "react-native-paper";
import { BarCodeScanner } from 'expo-barcode-scanner';


type MetrcTagScannerProps = {}

const MetrcTagScanner = ({}: MetrcTagScannerProps) => {

    const [hasPermission, setHasPermission] = useState<boolean | 'requesting-permission'>('requesting-permission');
    const [scanned, setScanned] = useState<boolean>(false);

    const {colors} = useTheme();

    useEffect(() => {
        (async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        console.log('Scanner has mounted!!!');

        return () => {
            console.log('Scanner has unmounted!!!!');
        }
    }, [])

    const handleBarCodeScanned = (result) => {
        setScanned(true);

        const {type, data} = result;

        console.log('Result from barcode scanner:', result);
        console.log('Barcode Type:', BarCodeScanner.Constants.BarCodeType[type]);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };

    if (hasPermission === 'requesting-permission') {
        return <Text>Requesting for camera permission</Text>;
    }
    if (!hasPermission) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>

            {/*Expo's implementation*/}
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={[StyleSheet.absoluteFill, styles.container]}
            >
                <View style={styles.layerTop} />
                <View style={styles.layerCenter}>
                    <View style={styles.layerLeft} />
                    <View style={styles.focused} />
                    <View style={styles.layerRight} />
                </View>
                <View style={styles.layerBottom} />
            </BarCodeScanner>

            {/*Alternative Implementation*/}
            {/*<BarCodeScanner*/}
            {/*    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}*/}
            {/*    style={StyleSheet.absoluteFillObject}*/}
            {/*/>*/}

            {/*<View style={styles.overlay}>*/}
            {/*    <View style={styles.unfocusedContainer} />*/}
            {/*    <View style={styles.middleContainer}>*/}
            {/*        <View style={styles.unfocusedContainer} />*/}

            {/*        /!*SCAN AREA*!/*/}
            {/*        <View style={styles.focusedContainer} />*/}

            {/*        <View style={styles.unfocusedContainer} />*/}
            {/*    </View>*/}
            {/*    <View style={styles.unfocusedContainer} />*/}
            {/*</View>*/}

            {scanned && <Button onPress={() => setScanned(false)}> Tap to Scan Again </ Button>}
        </View>
    );
}

//Expo Implementation Styles
const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    layerTop: {
        flex: 2,
        backgroundColor: opacity
    },
    layerCenter: {
        flex: 1,
        flexDirection: 'row'
    },
    layerLeft: {
        flex: 1,
        backgroundColor: opacity
    },
    focused: {
        flex: 10
    },
    layerRight: {
        flex: 1,
        backgroundColor: opacity
    },
    layerBottom: {
        flex: 2,
        backgroundColor: opacity
    },
});

//Alternative Implementation Styles
//const styles = StyleSheet.create({
//    container: {
//        flex: 1,
//    },
//
//    overlay: {
//        position: 'absolute',
//        top: 0,
//        left: 0,
//        right: 0,
//        bottom: 0,
//    },
//    unfocusedContainer: {
//        flex: 1,
//        backgroundColor: 'rgba(0,0,0,0.7)',
//    },
//    middleContainer: {
//        flexDirection: 'row',
//        flex: 1.5,
//    },
//    focusedContainer: {
//        flex: 6,
//    },
//});


export default MetrcTagScanner;
import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet } from "react-native";
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

    const handleBarCodeScanned = ({type, data}) => {
        setScanned(true);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };

    if (hasPermission === 'requesting-permission') {
        return <Text>Requesting for camera permission</Text>;
    }
    if (!hasPermission) {
        return <Text>No access to camera</Text>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {scanned && <Button onPress={() => setScanned(false)}> Tap to Scan Again </ Button>}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default MetrcTagScanner;
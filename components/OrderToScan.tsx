import React, { useLayoutEffect } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Pressable, TouchableHighlight, TouchableOpacity
} from "react-native";
import { ProductInOrder } from "../selectors/orderSelectors";
import { Card, Divider, useTheme, List, IconButton } from "react-native-paper";

/**
 * check, check-bold
 *
 * barcode-scan
 *
 * alert-circle, alert-circle-outline
 * */
type OrderToScanProps = {
    orderId: number;
    products: ProductInOrder[];
    navigation;
}

const OrderToScan = ({
                         orderId,
                         products,
                         navigation
                     }: OrderToScanProps) => {
    const {colors} = useTheme();

    /**Add menu button to header
     *  - created here, rather than in OrderListNavigator, so the onPress property has access to this component's functions
     * */
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton
                    icon={'dots-vertical'}
                    onPress={() => alert('Pressed Header Button!')}
                    style={{alignSelf: 'center', marginLeft: 'auto', }}
                />
            ),
        })
    })


    /**Creates a touchable row for each product in the order
     *  tapping a row opens up the scanner
     * */
    const renderProductRow = ({item}) => (
        <React.Fragment key={item.productId}>
            <Divider/>
            <Pressable
                onPress={() => navigation.navigate('MetrcTagScanner', {productName: item.name, productId: item.productId, orderDetailId: item.orderDetailId, orderId})}
                style={({ pressed }) => [
                    {
                        opacity: pressed
                            ? .2
                            : 1,
                    },
                ]}
            >
            {/*<TouchableOpacity*/}
            {/*        onPress={() => navigation.navigate('MetrcTagScanner', {productName: item.name, productId: item.productId})}*/}
            {/*>*/}
                <List.Item
                    title={item.name}
                    titleNumberOfLines={2}
                    titleStyle={{fontSize: 14}}
                    style={{paddingLeft: 0, paddingRight: 0}}
                    left={props => (
                        <List.Icon {...props}
                                   icon={item.orderDetailId % 3 === 0 ? "alert-circle" : item.orderDetailId % 2 === 0 ? 'check' : 'barcode-scan'}
                                   color={item.orderDetailId % 3 === 0 ? colors.error : item.orderDetailId % 2 === 0 ? colors.primary : colors.backdrop}
                                   style={{alignSelf: 'center', marginRight: 10}}
                        />
                    )}
                    right={() => (
                        <IconButton
                            icon={'dots-vertical'}
                            onPress={() => alert('Pressed!')}
                            style={{alignSelf: 'center', marginRight: 0}}
                        />
                    )}
                    description={() => (
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10}}>
                            <Text style={{color: colors.backdrop}}>Quantity: {item.quantity}</Text>
                            {/*TODO - remove hard coded icons and scanned totals once backend endpoints are avaiable*/}
                            <Text style={{color: colors.backdrop, marginRight: 16}}>Scanned: {item.orderDetailId % 3 === 0 ? 100 : item.orderDetailId % 2 === 0 ? item.quantity : 0}</Text>
                        </View>
                    )}
                >

                </List.Item>
            {/*</TouchableOpacity>*/}
            </Pressable>
            <Divider/>
        </React.Fragment>
    )

    //TODO: create complete order button
    // button is disabled if order has not been fully scanned

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1, backgroundColor: colors.background}}>

                <Card style={[styles.cardContainer, {flex: 1}]}>
                        <Card.Title title={'Products to Scan'} />
                    <Card.Content>
                        <FlatList
                            data={products}
                            renderItem={renderProductRow}
                            keyExtractor={(item) => item.name}
                        />
                        <Divider/>
                    </Card.Content>
                </Card>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        margin: 10,
    },
    fillScreen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scroll: {
        flex: 1,
        paddingBottom: 30,
    },
    empty: {
        justifyContent: 'center',
        padding: 14,
    },
});

export default OrderToScan;
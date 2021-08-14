import React from 'react';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { ProductsInOrder } from "../selectors/orderSelectors";
import { Card, Divider, useTheme, List } from "react-native-paper";

type OrderToScanProps = {
    orderId: number;
    products: ProductsInOrder[]
}

const OrderToScan = ({
                         orderId,
                         products
                     }: OrderToScanProps) => {
    const {colors} = useTheme();

    //const renderItemPrev = ({item}) => (
    //    <View key={item.orderDetailId}>
    //        <Text>{item.name}</Text>
    //        <Text>{item.quantity}</Text>
    //    </View>
    //)
    //
    //const listHeader = (
    //    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
    //        <Text>Name</Text>
    //        <Text>Quantity</Text>
    //    </View>
    //)

    const renderItem = ({item}) => (
        <React.Fragment>
            <Divider/>
            <List.Item
                title={item.name}
                titleNumberOfLines={2}
                titleStyle={{fontSize: 14}}
                description={ () => (
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10}}>
                        <Text style={{color: colors.backdrop}}>Quantity: {item.quantity}</Text>
                        <Text style={{color: colors.backdrop}}>Scanned: 0</Text>
                    </View>
                )}
            >

            </List.Item>
            <Divider />
        </React.Fragment>
    )

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1, backgroundColor: colors.background}}>
                <Card style={[styles.cardContainer]}>
                    <Card.Title title='Order Id'/>
                    <Card.Content>
                        <Text>Hi!</Text>
                        <Text>The Order Id is {orderId}</Text>
                    </Card.Content>
                </Card>

                <Card style={[styles.cardContainer, {flex: 1}]}>
                    <Card.Title title={'Products to Scan'}/>
                    <Card.Content>
                        <FlatList
                            data={products}
                            renderItem={renderItem}
                        />
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
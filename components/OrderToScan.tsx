import React from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Pressable
} from "react-native";
import { ProductInOrder } from "../selectors/orderSelectors";
import { Card, Divider, useTheme, List } from "react-native-paper";

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
        <React.Fragment key={item.productId}>
            <Divider/>
            <Pressable
                onPress={() => navigation.navigate('MetrcTagScannerScreen', {productName: item.name, productId: item.productId})}
            >
                <List.Item
                    title={item.name}
                    titleNumberOfLines={2}
                    titleStyle={{fontSize: 14}}
                    style={{paddingLeft: 0}}
                    left={props => (
                        <List.Icon {...props}
                                   icon={item.orderDetailId % 3 === 0 ? "alert-circle" : item.orderDetailId % 2 === 0 ? 'check' : 'barcode-scan'}
                                   color={item.orderDetailId % 3 === 0 ? colors.error : item.orderDetailId % 2 === 0 ? colors.primary : colors.backdrop}
                                   style={{alignSelf: 'center', marginRight: 10}}
                        />
                    )}
                    description={() => (
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10}}>
                            <Text style={{color: colors.backdrop}}>Quantity: {item.quantity}</Text>
                            {/*TODO - remove hard coded icons and scanned totals once backend endpoints are avaiable*/}
                            <Text style={{color: colors.backdrop}}>Scanned: {item.orderDetailId % 3 === 0 ? 100 : item.orderDetailId % 2 === 0 ? item.quantity : 0}</Text>
                        </View>
                    )}
                >

                </List.Item>
            </Pressable>
            <Divider/>
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
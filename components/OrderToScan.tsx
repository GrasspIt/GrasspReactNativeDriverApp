import React, { useLayoutEffect, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Pressable, TouchableHighlight, TouchableOpacity
} from "react-native";
import { ProductInOrder } from "../selectors/orderSelectors";
import { Card, Divider, useTheme, List, IconButton, Menu, Dialog, Portal, Paragraph, Button } from "react-native-paper";
import { number } from "prop-types";

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
    handleCompleteOrder: () => any;
}

const OrderToScan = ({
                         orderId,
                         products,
                         navigation,
                         handleCompleteOrder
                     }: OrderToScanProps) => {
    const {colors} = useTheme();

    const [productMenuVisible, setProductMenuVisible] = useState<number | null>(null);
    const [orderMenuVisible, setOrderMenuVisible] = useState<boolean>(false);
    const [productResetDialogVisible, setProductResetDialogVisible] = useState<boolean>(false);
    const [productToReset, setProductToReset] = useState<{id: number, name: string} | null>(null);
    const [orderResetDialogVisible, setOrderResetDialogVisible] = useState<boolean>(false);

    //TODO: Decide how you want to determine when scans are complete. Selector? State?
    const [scansComplete, setScansComplete] = useState<boolean>(false);

    const openProductMenu = (id: number) => setProductMenuVisible(id);
    const openOrderMenu = () => setOrderMenuVisible(true);
    const closeProductMenu = () => setProductMenuVisible(null);
    const closeOrderMenu = () => setOrderMenuVisible(false);
    const showProductResetDialog = (id: number, name: string) => {
        setProductResetDialogVisible(true);
        setProductToReset({id, name});
    }
    const hideProductResetDialog = () => {
        setProductResetDialogVisible(false);
        setProductToReset(null)
    }
    const showOrderResetDialog = () => setOrderResetDialogVisible(true);
    const hideOrderResetDialog = () => setOrderResetDialogVisible(false);

    /**Add menu button to header
     *  - created here, rather than in OrderListNavigator, so the onPress property has access to this component's functions
     * */
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Menu
                    visible={orderMenuVisible}
                    onDismiss={closeOrderMenu}
                    anchor={
                        <IconButton
                            icon={'dots-vertical'}
                            onPress={openOrderMenu}
                            style={{alignSelf: 'center', marginLeft: 'auto', }}
                        />
                    }
                    >
                    <Menu.Item
                        icon={'refresh'}
                        onPress={() => {
                            closeOrderMenu();
                            showOrderResetDialog();
                        }}
                        title={'Reset Order Scans'}
                    />
                </Menu>
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
                        <Menu
                            visible={productMenuVisible !== null && productMenuVisible === item.productId}
                            onDismiss={closeProductMenu}
                            anchor={
                                <View
                                    onTouchEnd={(e) => e.stopPropagation()}
                                >
                                    <IconButton
                                        icon={'dots-vertical'}
                                        onPress={() => {
                                            openProductMenu(item.productId)
                                        }}
                                        style={{alignSelf: 'center', marginRight: 0}}
                                    />
                                </View>
                            }
                        >
                            <Menu.Item
                                icon={'refresh'}
                                onPress={() => {
                                    setProductMenuVisible(null);
                                    showProductResetDialog(item.productId, item.name)
                                }}
                                title={'Reset Product Scans'}
                            />
                        </Menu>
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

    //TODO: create runing tally next to header of total scans (2/7 Products Scanned)

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

            <View>
                <Button
                    disabled={!scansComplete}
                    icon='check'
                    mode='contained'
                    color={colors.primary}
                    style={styles.buttons}
                    labelStyle={{ paddingVertical: 4, color: colors.surface }}
                    onPress={handleCompleteOrder}
                >
                    Complete Order
                </Button>
            </View>

            <Portal>
                {/*Reset Product Dialog*/}
                <Dialog visible={productResetDialogVisible} onDismiss={hideProductResetDialog}>
                    <Dialog.Title>Reset all scans for this product?</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>This action will reset {productToReset && productToReset.name} scans to 0</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        <Button onPress={hideProductResetDialog} color={colors.backdrop}>Cancel</Button>
                        <Button onPress={() => {}}>Reset</Button>
                    </Dialog.Actions>
                </Dialog>

                {/*Reset Order Dialog*/}
                <Dialog visible={orderResetDialogVisible} onDismiss={hideOrderResetDialog}>
                    <Dialog.Title>Reset all scans for this order?</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>This action will reset order scans to 0</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        <Button onPress={hideOrderResetDialog} color={colors.backdrop}>Cancel</Button>
                        <Button onPress={() => {}}>Reset</Button>
                    </Dialog.Actions>
                </Dialog>

            </Portal>
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
    buttons: {
        flex: 1,
        marginHorizontal: 10,
        marginBottom: 10,
        borderRadius: 50,
        elevation: 2,
    },
});

export default OrderToScan;
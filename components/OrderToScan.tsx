import React, { useLayoutEffect, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Pressable,
    Image
} from "react-native";
import { ProductInOrder } from "../selectors/orderSelectors";
import {
    Card,
    Divider,
    useTheme,
    List,
    IconButton,
    Menu,
    Dialog,
    Portal,
    Paragraph,
    Button,
} from "react-native-paper";
import { OrderScan } from "../store/reduxStoreState";
import { infoColor } from "../App";

type OrderToScanProps = {
    orderId: number;
    products: ProductInOrder[];
    navigation;
    resetOrderDetailScans: (orderDetailId: number) => any;
    resetOrderScans: (orderId: string) => any;
    totalRequiredScansForOrder: number;
    currentNumberOfScansForOrder: number;
    orderScans: { [orderDetailId: number]: OrderScan[] };
}

const OrderToScan = ({
                         orderId,
                         products,
                         navigation,
                         resetOrderDetailScans,
                         resetOrderScans,
                         totalRequiredScansForOrder,
                         currentNumberOfScansForOrder,
                         orderScans,
                     }: OrderToScanProps) => {
    const {colors} = useTheme();

    const [productMenuVisible, setProductMenuVisible] = useState<number | null>(null);
    const [orderMenuVisible, setOrderMenuVisible] = useState<boolean>(false);
    const [productResetDialogVisible, setProductResetDialogVisible] = useState<boolean>(false);
    const [productToReset, setProductToReset] = useState<{ id: number, name: string, orderDetailId: number } | null>(null);
    const [orderResetDialogVisible, setOrderResetDialogVisible] = useState<boolean>(false);

    const openProductMenu = (id: number) => setProductMenuVisible(id);
    const openOrderMenu = () => setOrderMenuVisible(true);
    const closeProductMenu = () => setProductMenuVisible(null);
    const closeOrderMenu = () => setOrderMenuVisible(false);
    const showProductResetDialog = (id: number, name: string, orderDetailId: number) => {
        setProductResetDialogVisible(true);
        setProductToReset({id, name, orderDetailId});
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
                            style={{alignSelf: 'center', marginLeft: 'auto',}}
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
                        accessibilityLabel={'Reset Order Scans'}
                    />
                </Menu>
            ),
        })
    })

    /**Resets scans for an Order Detail and closes the reset order detail scans dialog*/
    const handleResetScansForOrderDetail = () => {
        productToReset && resetOrderDetailScans(productToReset.orderDetailId);
        hideProductResetDialog();
    }

    /**Resets scans for an order and closes the reset order scans dialog*/
    const handleResetScansForOrder = () => {
        resetOrderScans(orderId.toString());
        hideOrderResetDialog();
    }

    /**Creates a touchable row for each product in the order.
     *  tapping a row opens up the scanner
     * */
    const renderProductRow = ({item}) => {
        const scanCountForItem = orderScans[item.orderDetailId] ? orderScans[item.orderDetailId].length : 0;
        var requiredScans = 0;
        if(item){
            let detailQuantity = item.quantity
            switch (item.unit) {
                case "oz":
                    detailQuantity *= 8;
                    break;
                case "half":
                    detailQuantity *= 4;
                    break;
                case "quarter":
                    detailQuantity *= 2;
                    break;
                case "eighth":
                default:
                    break; 
            }
            requiredScans = detailQuantity
        }
        /**Determines which icon to render for an item, depending upon its scan progress (complete, in-progress, not-started, error)*/
        const determineListIcon = () => {
            if (scanCountForItem > requiredScans) return {icon: 'alert-circle', color: colors.error};
            if (scanCountForItem === requiredScans) return {icon: 'check-circle-outline', color: colors.primary};
            //alternative color for dots-horizontal: #FFB800
            if (scanCountForItem > 0 && scanCountForItem < requiredScans) return {
                icon: 'dots-horizontal-circle-outline',
                color: '#f8b302'
            };
            //if the switch is made to qr codes, use the icon 'data-matrix-scan'
            return {icon: 'barcode-scan', color: colors.backdrop};
        }

        const {icon: listIcon, color: listIconColor} = determineListIcon();

        return (
            <React.Fragment key={item.productId}>
                <Divider/>
                <Pressable
                    onPress={() => navigation.navigate('BarcodeScanner', {
                        productName: item.name,
                        productId: item.productId,
                        orderDetailId: item.orderDetailId,
                        orderId,
                        dsprId: item.dsprId
                    })}
                    disabled={scanCountForItem >= requiredScans}
                    style={({pressed}) => [
                        {
                            opacity: pressed
                                ? .2
                                : 1,
                        },
                    ]}
                >
                    <List.Item
                        title={item.name}
                        titleNumberOfLines={2}
                        titleStyle={{fontSize: 14}}
                        style={{paddingLeft: 0, paddingRight: 0}}
                        left={props => (
                            <List.Icon {...props}
                                //icon={item.orderDetailId % 3 === 0 ? "alert-circle" : item.orderDetailId % 2 === 0 ? 'check' : 'barcode-scan'}
                                       icon={listIcon}
                                       color={listIconColor}
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
                                        showProductResetDialog(item.productId, item.name, item.orderDetailId)
                                    }}
                                    title={'Reset Product Scans'}
                                    accessibilityLabel={'Reset Product Scans'}
                                />
                            </Menu>
                        )}
                        description={() => (
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10}}>
                                <Text style={{color: colors.backdrop}}>Qty: {item.quantity} {item.unit ? item.unit : ''}</Text>
                                <Text style={{
                                    color: colors.backdrop,
                                    marginRight: 16
                                }}>Scanned: {scanCountForItem}{item.unit ? " Eighths" : ' Units'}</Text>
                            </View>
                        )}
                    >

                    </List.Item>
                </Pressable>
                <Divider/>
            </React.Fragment>
        )
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1, backgroundColor: colors.background}}>
                <Card style={[styles.cardContainer, {flex: 1}]}>
                    <Card.Title
                        title={'Products to Scan'}
                        subtitle={`Scanned: ${currentNumberOfScansForOrder}/${totalRequiredScansForOrder}`}
                    />
                    <Card.Content>
                        <FlatList
                            data={products}
                            renderItem={renderProductRow}
                            keyExtractor={(item: ProductInOrder) => item.name}
                        />
                        <Divider/>
                    </Card.Content>

                    <View style={{marginTop: 'auto'}}>
                        <Button
                            icon='arrow-left'
                            mode='outlined'
                            color={infoColor}
                            labelStyle={{
                                paddingVertical: 4,
                            }}
                            style={[styles.buttons, {backgroundColor: colors.surface}]}
                            onPress={() => navigation.goBack()}
                        >
                            Back to Order Details
                        </Button>
                    </View>
                </Card>
            </View>

            <Portal>
                {/*Reset Product Dialog*/}
                <Dialog visible={productResetDialogVisible} onDismiss={hideProductResetDialog}>
                    <Dialog.Title style={styles.dialogTitle}>Reset all scans for this product?</Dialog.Title>
                    <Dialog.Content style={styles.dialogContentContainer}>
                        <Paragraph style={styles.dialogParagraph}>This action will
                            reset {productToReset && productToReset.name} scans to 0</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        <Button onPress={hideProductResetDialog} color={colors.backdrop}>Cancel</Button>
                        <Button onPress={handleResetScansForOrderDetail}>Reset</Button>
                    </Dialog.Actions>
                </Dialog>

                {/*Reset Order Dialog*/}
                <Dialog visible={orderResetDialogVisible} onDismiss={hideOrderResetDialog}>
                    <Dialog.Title style={styles.dialogTitle}>Reset all scans for this order?</Dialog.Title>
                    <Dialog.Content style={styles.dialogContentContainer}>
                        <Paragraph style={styles.dialogParagraph}>This action will reset order scans to 0</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        <Button onPress={hideOrderResetDialog} color={colors.backdrop}>Cancel</Button>
                        <Button onPress={handleResetScansForOrder}>Reset</Button>
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
        marginHorizontal: 10,
        marginBottom: 10,
        borderRadius: 50,
        elevation: 2,
    },
    dialogTitle: {
        textAlign: 'center',
    },
    dialogContentContainer: {
        marginTop: 4,
        //alignItems: 'center',
    },
    dialogParagraph: {
        textAlign: 'center',
    },
});

export default OrderToScan;
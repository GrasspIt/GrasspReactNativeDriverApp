import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { useTheme } from 'react-native-paper';
import { OrderDetail } from '../store/reduxStoreState';

interface OrderDetailListItemProps {
  orderDetail: Partial<OrderDetail>;
}

const OrderDetailListItem: React.FC<OrderDetailListItemProps> = (props) => {
  const { colors } = useTheme();
  const { orderDetail } = props;
  const { product } = orderDetail;
  const unit = orderDetail && orderDetail.unit ? orderDetail.unit + ' oz of' : ' x ';
  const productColor =
    product?.flowerType == 'hybrid'
      ? '#fc952a'
      : product?.flowerType == 'sativa'
      ? '#67cb33'
      : product?.flowerType == 'indica'
      ? '#cc99ff'
      : product?.flowerType == 'cbd'
      ? '#3075e5'
      : product?.flowerType == 'vaporizer'
      ? '#ddd'
      : colors.primary;
  return (
    <>
      {orderDetail && product && (
        <>
          <ListItem topDivider>
            <ListItem.Content>
              <ListItem.Title>{`${orderDetail.quantity} ${unit} ${product.name}`}</ListItem.Title>
              <View style={styles.subtitle}>
                <View>
                  <Text style={{ color: productColor, fontWeight: 'bold' }}>
                    {product.flowerType.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text>${orderDetail.pricePreDiscount}</Text>
                </View>
              </View>
            </ListItem.Content>
          </ListItem>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default OrderDetailListItem;

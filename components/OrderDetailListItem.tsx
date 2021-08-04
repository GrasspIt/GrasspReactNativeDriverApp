import React from 'react';
import { Text, View } from 'react-native';
import { useTheme, List, Divider } from 'react-native-paper';
import { CalculatedOrderDetail } from '../store/reduxStoreState';

interface OrderDetailListItemProps {
  orderDetail: Partial<CalculatedOrderDetail>;
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
          <View>
            <Divider />
            <List.Item
              title={<View><Text>{orderDetail.quantity} {unit} {product.name}</Text></View>}
              description={ () => (
                orderDetail.appliedCoupon
                  ? <Text>{product.flowerType
                    .replace('_', ' ')
                    .toUpperCase()} - {orderDetail?.appliedCoupon?.code?.toUpperCase() || undefined}</Text>
                  : <Text>{product.flowerType.replace('_', ' ').toUpperCase()}</Text>)
              }
              descriptionStyle={{ color: productColor, fontWeight: 'bold' }}
              titleNumberOfLines={2}
              descriptionNumberOfLines={2}
              right={() => (
                <View style={{ alignSelf: 'flex-end' }}>
                  <Text
                    style={
                      orderDetail.discount !== 0 ? { textDecorationLine: 'line-through' } : null
                    }
                  >
                    ${orderDetail.pricePreDiscount}
                  </Text>
                  <Text>
                  {orderDetail && orderDetail.pricePreDiscount && orderDetail.discount && orderDetail.discount !== 0 ? (
                    "$" + (orderDetail.pricePreDiscount - (orderDetail?.discount || 0))) : null}
                  </Text>
                </View>
              )}
            />
          </View>
        </>
      )}
    </>
  );
};

export default OrderDetailListItem;

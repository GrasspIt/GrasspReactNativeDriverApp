import React from 'react';
import { Text, View } from 'react-native';
import { useTheme, List, Divider } from 'react-native-paper';
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
          <View>
            <Divider />
            <List.Item
              title={`${orderDetail.quantity} ${unit} ${product.name}`}
              description={`${product.flowerType.replace('_', ' ').toUpperCase()}`}
              descriptionStyle={{ color: productColor, fontWeight: 'bold' }}
              titleNumberOfLines={2}
              descriptionNumberOfLines={2}
              right={() => (
                <View style={{ alignSelf: 'flex-end' }}>
                  <Text>${orderDetail.pricePreDiscount}</Text>
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

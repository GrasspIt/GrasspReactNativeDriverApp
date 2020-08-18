import React from 'react';
import { Header, Image } from 'react-native-elements';
import Colors from '../constants/Colors';

const TopNavBar = ({navigation}) => {

    return (
        <Header
            leftComponent={{
                icon: 'menu',
                color: Colors.black,
                onPress: () => navigation.toggleDrawer()
            }}
            centerComponent={
                <Image
                    source={require('../assets/grassp_health.png')}
                    style={{marginLeft: 20, height: 40, width: 200}}
                />
            }
            containerStyle={{
                backgroundColor: Colors.light,
                borderBottomWidth: 2,
                borderBottomColor: Colors.medium
            }}
        />
)}

export default TopNavBar;
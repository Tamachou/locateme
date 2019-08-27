import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import LoginInput from '../components/LoginForm';
import LoginButton from '../components/Button';
import imageLogo from '../pictures/wall1.png';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export default class HomeScreen extends  React.Component {
  state ={
    phoneNumber: '0612345678',
  };
  handlePhoneChange = (phone: string) => {
        this.setState({phoneNumber: phone})
  }
  login = (data) =>
  {
    return new Promise( (resolve, reject) => {
      axios.post('https://locatemeapi.herokuapp.com/login', data)
          .then(function (response) {
            resolve(response.data)
          }) .catch(function (err) {
        console.log(err)
      })
    })
  }

  handleLoginPress = async () => {
    const {phoneNumber} = this.state;
    console.log('Login pressed');
    const RegFr = /^[0]{1}[6-7]{1}[0-9]{8}$/si;
    if (phoneNumber.match(RegFr))
    {
      const { status, permission} = await Permissions.askAsync(Permissions.LOCATION);
      if ( status === 'granted')
      {
        const location = await Location.getCurrentPositionAsync();
         const res = await this.login({ phoneNumber, lat: location.coords.latitude, lng: location.coords.longitude})
        if (res)
        {
          SecureStore.setItemAsync('ID', `${res._id}`);
          this.props.navigation.navigate('Link');
        }

      }
    }
  }

  render() {
    return (
        <View style={styles.container}>
          <Image source={imageLogo} style={styles.logo} />
          <View style={styles.form}>
              <LoginInput
                value={this.state.phone}
                onChangeText={this.handlePhoneChange}
                placeholder='Enter your phone number'
              />
              <LoginButton label='LOGIN' onPress={this.handleLoginPress}/>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logo: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  form: {
    flex: 1,
    justifyContent: "center",
    width: "80%"
  }
});
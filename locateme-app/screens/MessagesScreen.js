import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import axios from "axios";
import * as geolib from "geolib";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import CheckBox from 'react-native-checkbox';
import LoginButton from '../components/Button';
import * as SMS from 'expo-sms';

export default class MessScreen extends  React.Component {

  state = {
    token: '',
    myLocation: {
      latitude: 0,
      longitude: 0
    },
    mapCircle: [],
  };

  componentDidMount = async () => {
    const token =  await SecureStore.getItemAsync('ID');
    const mapCircle = await this.getAll();

    this.setState({
      token,
      mapCircle
    });
  };

  mappingNum = async (response) => {
    const myLocation = await Location.getCurrentPositionAsync();
    const {data} = response;
    const mapCircle = [];

    for (let i = 0; i < data.length; i++) {
      const inside = await geolib.isPointWithinRadius({latitude: data[i].lat, longitude: data[i].lng}, {...myLocation.coords}, 5000);
      if (inside) {
        data[i].checked = false;
        mapCircle.push(data[i]);
      }
    }
    return mapCircle;
  }

  getCheckUser = () => {
    const {mapCircle} = this.state;
    num = [];
    for(let i = 0; i<mapCircle.length; i++ )
    {
      if (mapCircle[i].checked)
      {
       num.push(mapCircle[i].phoneNumber)
      }
    }
    return num;
  };

  handleSendMessage = async () => {
    const peons = this.getCheckUser();
    if (peons.length > 0) {
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
      await  SMS.sendSMSAsync(peons,'Nice to meet you! Wanna chat?');
      } else {
        console.log("misfortune... there's no SMS available on this device");
      }
    }
  }

  getAll = () =>
  {
    return new Promise( (resolve, reject) => {
      axios.get('https://locatemeapi.herokuapp.com/all')
          .then(async (response) => {
            resolve(await this.mappingNum(response));
          }) .catch(function (err) {
        console.log(err)
      })
    })
  };

onChange = (key) => {
  const mapCircle = this.state.mapCircle.map((user) => {
    if(user._id === key) {
      user.checked = !user.checked;
    }
    return user;
  })

  this.setState({mapCircle})
};

  render() {
    return (
        <View style={styles.container}>
    <ScrollView
    style={styles.container}
    contentContainerStyle={styles.contentContainer}>
        <View style={styles.getStartedContainer}>
        <Text style={styles.getStartedText}>Send some word</Text>
    {this.state.mapCircle.map( numPeon => (
        <CheckBox
          key ={numPeon._id}
          label={numPeon.phoneNumber}
          checked={numPeon.checked}
          onChange={() => this.onChange(numPeon._id)}
        />
    ))}
        <LoginButton label='Send' onPress={this.handleSendMessage}/>
    </View>
    </ScrollView>
    </View>
  );
  }
}

MessScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});

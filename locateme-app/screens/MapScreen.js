import React from 'react';
import { StyleSheet, View} from 'react-native';
import MapView from 'react-native-maps';
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import { withNavigationFocus } from 'react-navigation';
import axios from 'axios';
import { Marker, Circle } from 'react-native-maps';
import * as Contacts from 'expo-contacts';
import * as Permissions from "expo-permissions";

class MapScreen extends React.Component {

  state = {
  token: '',
  region: {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  myLocation: {
    latitude: 0,
    longitude: 0
  },
  allLocation: []
  };

componentDidMount = async () => {
  const token =  await SecureStore.getItemAsync('ID');
  const myLocation = await Location.getCurrentPositionAsync();
  const allLocation = await this.getAll();
  this.setState({ token, myLocation: myLocation.coords, allLocation,
    region: {latitude: myLocation.coords.latitude,
      longitude: myLocation.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421}
  });
  this._interval = setInterval( this.upMap, 5000);
};

  componentWillUnmount() {
    clearInterval(this._interval);
    console.log('clear map')
  }

  getAll = () =>
  {
    return new Promise( (resolve, reject) => {
      axios.get('https://locatemeapi.herokuapp.com/all')
          .then(function (response) {
            resolve(response.data);
          }) .catch(function (err) {
        console.log(err)
      })
    })
  };

  updateMe = (pos) =>
  {
    return new Promise( async (resolve, reject) => {

      axios.put(`https://locatemeapi.herokuapp.com/update/${this.state.token}`, {'lat': pos.coords.latitude, 'lng': pos.coords.longitude} )
          .then(function (response) {
            resolve(response.data);
          }) .catch(function (err) {
        console.log(err)
      })
    })
  };

onRegionChange = (region) => {
  this.setState({region})
};

upMap =  async () =>
{
    let pos = await Location.getCurrentPositionAsync();
   await this.updateMe(pos);
    this.setState({allLocation : await this.getAll()});
    this.setState({myLocation : pos.coords});
    console.log('updated')
};

addContact = async (number) => {
    const {status, permission} = await Permissions.askAsync(Permissions.CONTACTS);
    if (status === 'granted') {
        const contact = {
            [Contacts.Fields.FirstName]: 'Jane',
            [Contacts.Fields.LastName]: 'Doe',
            [Contacts.Fields.PhoneNumbers]: [{
                label: 'mobile',
                number
            }],
        }
        const contactId = await Contacts.addContactAsync(contact);
        console.log('Contact added')
    };
}

  render() {
    return (
        <View style={styles.container}>
        <MapView
            style={styles.map}
            region={this.state.region}
            onRegionChangeComplete ={this.onRegionChange}>
              {this.state.allLocation.map(pins => (
                  <Marker
                  key = {pins._id}
                 pinColor= {(pins._id === this.state.token ? 'plum' : 'red')}
                coordinate={{
                latitude: pins.lat,
                    longitude: pins.lng,
              }}
                title= {pins.phoneNumber}
                onCalloutPress={() => {this.addContact(pins.phoneNumber)}}>

                    </Marker>
              ))}
                    <Circle
                        center= {{
                            latitude: this.state.myLocation.latitude,
                            longitude: this.state.myLocation.longitude,
                        }}
                        radius = {5000}
                        fillColor = 'rgba(147,112,219, 0.4)'
                        />

      </MapView>
    </View>
  );
  }
}

export default withNavigationFocus(MapScreen);

MapScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});

import React from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import LoginButton from "../components/Button";
import axios from "axios";

export default class LogScreen extends React.Component {

    logout = (token) =>
    {
        return new Promise( (resolve, reject) => {

            axios.get(`https://locatemeapi.herokuapp.com/logout/${token}`)
                .then(function (response) {
                    resolve(response.data)
                }) .catch(function (err) {
                console.log(err)
            })
        })
    }

    handleLogPress = async () => {
        console.log('Logout pressed');
        const token =  await SecureStore.getItemAsync('ID');
        console.log(token)
         const log = await this.logout(token);
         if (log)
         {
             SecureStore.deleteItemAsync('ID');
             this.props.navigation.navigate('Home');
         }

    }
    render() {
        return (
            <View style={styles.container}>
            <LoginButton label='LOGOUT' onPress={this.handleLogPress}/>
        </View>
    );
    }
}

LogScreen.navigationOptions = {
    header: null,
};


const styles = StyleSheet.create({
    container: {
        marginTop: 150,
        flex: 1,
        backgroundColor: '#fff',
    },
});
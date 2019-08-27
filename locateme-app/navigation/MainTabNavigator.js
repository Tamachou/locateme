import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import SettingsScreen from '../screens/MessagesScreen';
import LogoutScreen from '../screens/LogoutScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

HomeStack.path = '';

const LinkStack = createStackNavigator(
    {
        Link: MapScreen,
    },
    config
);

LinkStack.navigationOptions = {
    tabBarLabel: 'Link',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
    focused={focused}
    name={
        Platform.OS === 'ios'
            ? `ios-information-circle${focused ? '' : '-outline'}`
            : 'md-information-circle'
    }
/>
),
};

LinkStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Messages',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

SettingsStack.path = '';

const LogoutStack = createStackNavigator(
    {
        Logout: LogoutScreen,
    },
    config
);

LogoutStack.navigationOptions = {
    tabBarLabel: 'Logout',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
    focused={focused}
    name={
        Platform.OS === 'ios'
            ? `ios-information-circle${focused ? '' : '-outline'}`
            : 'md-information-circle'
    }
/>
),
};

LogoutStack.path = '';

const Auth = createSwitchNavigator({
   HomeStack,
});

Auth.path = '';

const tabNavigator = createBottomTabNavigator({
    LinkStack,
  SettingsStack,
    LogoutStack,
});

tabNavigator.path = '';

const navigator = createSwitchNavigator({
    Auth,
    tabNavigator
})
navigator.path = '';
export default navigator;

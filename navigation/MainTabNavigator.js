import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import Home from '../screens/HomeScreen';
import Search from '../screens/SearchScreen';
import Lists from '../screens/ListsScreen';
import Itineraries from '../screens/ItinerariesScreen';
import SettingsScreen from '../screens/SettingsScreen';


// Home Tab
const HomeStack = createStackNavigator({
  HomeScreen: Home,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={ Platform.OS === 'ios' ? 'ios-home' : 'md-home' }
    />
  ),
};

// Search Tab
const SearchStack = createStackNavigator({
  SearchScreen: Search,
});

SearchStack.navigationOptions = {
  tabBarLabel: 'Search',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={ Platform.OS === 'ios' ? 'ios-search' : 'md-search' }
    />
  ),
};

// Lists Tab
const ListsStack = createStackNavigator({
  ListsScreen: Lists,
});

ListsStack.navigationOptions = {
  tabBarLabel: 'Lists',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={ Platform.OS === 'ios' ? 'ios-list': 'md-list' }
    />
  ),
};

// Itineraries Tab
const ItinerariesStack = createStackNavigator({
  ItinerariesScreen: Itineraries,
});

ItinerariesStack.navigationOptions = {
  tabBarLabel: 'Itineraries',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={ Platform.OS === 'ios' ? 'ios-paper' : 'md-paper' }
    />
  ),
};

// Settings Tab
const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  SearchStack,
  ListsStack,
  ItinerariesStack,
  SettingsStack,
});

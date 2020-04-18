import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../Compenents/Home'
import Statistiques from '../Compenents/Statistiques'
import StatistiquesDetails from '../Compenents/StatistiquesDetails'
import Settings from '../Compenents/Settings'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createMaterialBottomTabNavigator();
const Tabs = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Home"
      component={Home}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="heart-pulse" color={color} size={26} />
        ),
      }}
    />

    <Tab.Screen
      name="Statistiques"
      component={Stacks}

      options={{
        tabBarLabel: 'Statistiques',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="account-heart" color={color} size={26} />
        ),
      }}
    >

    </Tab.Screen>

    <Tab.Screen
      name="Settings"
      component={Settings}
      options={{
        tabBarLabel: 'Paramètres',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="settings" color={color} size={26} />
        ),
      }}
    />
  </Tab.Navigator>
)

const Stack = createStackNavigator();
const Stacks = () => (
  <Stack.Navigator>
    <Stack.Screen name="Statistiques" component={Statistiques}  />
    <Stack.Screen name="StatistiquesDetails" component={StatistiquesDetails} options={{
      headerTitle: "Détails du patient"
    }}/>
  </Stack.Navigator>
)

export default function Navigation() {
  return (
  <NavigationContainer>
      <Tabs />
  </NavigationContainer>
  );
}


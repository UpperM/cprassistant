import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../Compenents/Home'
import Statistiques from '../Compenents/Statistiques'
import StatistiquesDetails from '../Compenents/StatistiquesDetails'
import Settings from '../Compenents/Settings'
import StatistiquesEdit from '../Compenents/StatistiquesEdit'
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
        tabBarLabel: 'Comptes rendus',
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
    <Stack.Screen name="Statistiques" component={Statistiques} options={{
      headerTitle: "Comptes rendus"
    }}  />
    <Stack.Screen name="StatistiquesDetails" component={StatistiquesDetails} options={{
      headerTitle: "Détails du compte rendu",
    }}/>

  <Stack.Screen name="StatistiquesEdit" component={StatistiquesEdit} options={{
      headerTitle: "Edition du compte rendu",
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


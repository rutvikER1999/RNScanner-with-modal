/**
 * @format
 */
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {AppRegistry} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import App from './App';
import {name as appName} from './app.json';
import Form from './Form';

const Stack = createNativeStackNavigator();
const Mystack =()=>{
    
    return(
        <Stack.Navigator>
      <Stack.Screen name="Scanner" component={App} options={{headerShown: false}} />
      <Stack.Screen name="Form" component={Form} options={{ headerBackVisible: false}}/>
    </Stack.Navigator>
    )
}

const NavigationComponent = () => {
    return (
        <NavigationContainer>
            <Mystack/>
        </NavigationContainer>
    )
}

AppRegistry.registerComponent(appName, () => NavigationComponent);

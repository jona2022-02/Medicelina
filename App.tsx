// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddMedicineScreen from './screens/AddMedicineScreen';
import { RootStackParamList } from './types/types';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Medicamentos' }} />
        <Stack.Screen name="AddMedicine" component={AddMedicineScreen} options={{ title: 'Agregar / Editar' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

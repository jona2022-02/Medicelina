import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './screens/LoginScreen';
import RegistroScreen from './screens/RegistroScreen';
import MainTabs from './MainTabs';
import PerfilClienteScreen from './screens/PerfilClienteScreen';
import SucursalFormScreen from './screens/SucursalFormScreen';
import UsuarioFormScreen from './screens/UsuarioFormScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Registro" component={RegistroScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />

            {/* ✅ Nuevas pantallas agregadas */}
            <Stack.Screen name="PerfilCliente" component={PerfilClienteScreen} options={{ title: 'Mi Perfil' }} />
            <Stack.Screen name="SucursalForm" component={SucursalFormScreen} options={{ title: 'Agregar/Editar Sucursal' }} />
            <Stack.Screen name="UsuarioForm" component={UsuarioFormScreen} options={{ title: 'Agregar/Editar Usuario' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

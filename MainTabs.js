// MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import HomeClienteScreen from './screens/HomeClienteScreen';
import ClientesScreen from './screens/vista/clientes/ClientesScreen';
import MedicationsScreen from './screens/vista/medicamentos/MedicationsScreen';
import PedidoScreen from './screens/vista/pedidos/PedidoScreen';
import HistorialPedidosScreen from './screens/vista/pedidos/HistorialPedidosScreen';
import SucursalesScreen from './screens/vista/sucursales/SucursalesScreen';
import UsuariosScreen from './screens/UsuariosScreen';


import { puedeAcceder } from './autenticacion';

const Tab = createBottomTabNavigator();

export default function MainTabs({ route }) {
  const rol = route.params?.rol || 'cliente';
  const usuarioId = route.params?.usuarioId || null;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1976d2',
        tabBarStyle: { backgroundColor: '#f2f2f2' },
        headerShown: false
      }}
    >
      {(rol === 'admin' || rol === 'cliente') && (
        <Tab.Screen
          name="Inicio"
          component={rol === 'admin' ? HomeScreen : HomeClienteScreen}
          initialParams={{ rol, usuarioId }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name={rol === 'admin' ? 'home' : 'home-account'}
                color={color}
                size={size}
              />
            )
          }}
        />
      )}

      {puedeAcceder(rol, 'Medicamentos') && (
        <Tab.Screen
          name="Medicamentos"
          component={MedicationsScreen}
          initialParams={{ rol, usuarioId }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="pill" color={color} size={size} />
            )
          }}
        />
      )}

      {puedeAcceder(rol, 'Clientes') && (
        <Tab.Screen
          name="Clientes"
          component={ClientesScreen}
          initialParams={{ rol, usuarioId }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-group" color={color} size={size} />
            )
          }}
        />
      )}

      {puedeAcceder(rol, 'Pedido') && (
        <Tab.Screen
          name="Pedido"
          component={PedidoScreen}
          initialParams={{ rol, usuarioId }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cart" color={color} size={size} />
            )
          }}
        />
      )}

      {puedeAcceder(rol, 'Historial') && (
        <Tab.Screen
          name="HistorialPedidos"
          component={HistorialPedidosScreen}
          initialParams={{ rol, usuarioId }}
          options={{
            tabBarLabel: 'Historial',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="history" color={color} size={size} />
            )
          }}
        />
      )}

      {puedeAcceder(rol, 'Sucursales') && (
        <Tab.Screen
          name="Sucursales"
          component={SucursalesScreen}
          initialParams={{ rol, usuarioId }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="map-marker" color={color} size={size} />
            )
          }}
        />
      )}

      {puedeAcceder(rol, 'Usuarios') && (
        <Tab.Screen
          name="Usuarios"
          component={UsuariosScreen}
          initialParams={{ rol, usuarioId }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="shield-account" color={color} size={size} />
            )
          }}
        />
      )}
    </Tab.Navigator>
  );
}

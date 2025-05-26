// HomeClienteScreen.js mejorado con diseño estilo HomeScreen

import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, ImageBackground, Alert, View } from 'react-native';
import { Text, Button, Card, Title, IconButton } from 'react-native-paper';
import { collection, getDoc, getDocs, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import fondo from '../assets/fondo.jpeg';
import { puedeAcceder } from '../autenticacion';

export default function HomeClienteScreen() {
  const [totalMedicamentos, setTotalMedicamentos] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [saludo, setSaludo] = useState('');
  const isFocused = useIsFocused();

  const navigation = useNavigation();
  const route = useRoute();
  const rol = route.params?.rol || 'cliente';
  const usuarioId = route.params?.usuarioId || null;

  const contarDatos = async () => {
    const meds = await getDocs(collection(db, 'medicamentos'));
    const clts = await getDocs(collection(db, 'usuarios'));
    setTotalMedicamentos(meds.size);
    setTotalClientes(clts.size);
  };

  const obtenerNombreUsuario = async () => {
    if (usuarioId) {
      const userDoc = await getDoc(doc(db, 'usuarios', usuarioId));
      if (userDoc.exists()) {
        const nombre = userDoc.data().nombre;
        setNombreUsuario(nombre);
        setSaludo(obtenerSaludo(nombre));
      }
    }
  };

  const obtenerSaludo = (nombre) => {
    const hora = new Date().getHours();
    if (hora < 12) return `¡Buenos días, ${nombre}!`;
    if (hora < 18) return `¡Buenas tardes, ${nombre}!`;
    return `¡Buenas noches, ${nombre}!`;
  };

  const confirmarCerrarSesion = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Salir', style: 'destructive', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) }
      ]
    );
  };

  useEffect(() => {
    if (isFocused) {
      contarDatos();
      obtenerNombreUsuario();
    }
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="logout"
          iconColor="#fff"
          onPress={confirmarCerrarSesion}
        />
      ),
      headerStyle: {
        backgroundColor: '#1976d2'
      },
      headerTintColor: '#fff',
      headerTitleAlign: 'center'
    });
  }, [navigation]);

  return (
    <ImageBackground source={fondo} style={styles.background}>
      <View style={styles.header}>
        <Title style={styles.title}>Inicio del Cliente - Medicelina</Title>
        {saludo ? <Text style={styles.nombre}>{saludo}</Text> : null}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">💊 Total de Medicamentos:</Text>
            <Text variant="headlineLarge">{totalMedicamentos}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">👥 Total de Usuarios:</Text>
            <Text variant="headlineLarge">{totalClientes}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">🏥 Acerca de Medicelina</Text>
            <Text style={{ marginTop: 6 }}>
              Medicelina es una farmacia moderna enfocada en brindar salud, accesibilidad y confianza a nuestros clientes.
              Desde su creación, trabajamos para ofrecer un servicio eficiente y adaptado a las necesidades digitales.
            </Text>
            <Text style={{ marginTop: 10 }}>Fundadores:</Text>
            <Text>• Hernández Martínez Jonathan Alexander (25-0523-2021)</Text>
            <Text>• Hernández Lobos Yanci Janeth (25-1391-2021)</Text>
            <Text style={{ marginTop: 10 }}>
              Esta app fue desarrollada usando React Native con Expo y Firebase.
            </Text>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          icon="account"
          onPress={() => navigation.navigate('PerfilCliente', { usuarioId })}
          style={styles.button}
        >
          Ver Perfil
        </Button>

        <Button
          mode="contained"
          icon="logout"
          onPress={confirmarCerrarSesion}
          style={[styles.button, { backgroundColor: '#c62828' }]}
        >
          Cerrar sesión
        </Button>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover'
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center'
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.4)',
    fontWeight: 'bold'
  },
  nombre: {
    fontSize: 16,
    color: 'rgba(61, 3, 255, 0.4)',
    marginTop: 8
  },
  scrollContent: {
    flexGrow: 1,
    padding: 30,
    alignItems: 'center'
  },
  card: {
    width: '90%',
    marginBottom: 20,
    padding: 8,
    backgroundColor: '#fffde7',
    borderRadius: 12
  },
  button: {
    marginBottom: 20,
    width: '90%',
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#1976d2'
  }
});

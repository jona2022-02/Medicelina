import React, { useState } from 'react';
import { View, StyleSheet, Alert, ImageBackground } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import fondo from '../assets/fondo.jpeg';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [mostrarClave, setMostrarClave] = useState(false);
  const [loading, setLoading] = useState(false);

  const manejarDui = (valor) => {
    const limpio = valor.replace(/[^0-9]/g, '');
    if (limpio.length <= 9) {
      const formateado = limpio.length > 8 ? limpio.slice(0, 8) + '-' + limpio.slice(8) : limpio;
      setUsuario(formateado);
    }
  };

  const iniciarSesion = async () => {
    if (!usuario || !clave) {
      Alert.alert('Error', 'Completa ambos campos.');
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      const clientesSnap = await getDocs(collection(db, 'usuarios'));
      const cliente = clientesSnap.docs.find(
        doc => doc.data().dui === usuario && doc.data().clave === clave
      );

      setLoading(false);

      if (cliente) {
        const data = cliente.data();
        const rol = data.rol || 'cliente';

        navigation.reset({
          index: 0,
          routes: [{
            name: 'Main',
            params: {
              rol,
              usuarioId: cliente.id
            }
          }]
        });
      } else {
        Alert.alert('Error', 'Usuario o clave incorrectos');
      }
    }, 3000);
  };

  return (
    <ImageBackground source={fondo} style={styles.background}>
      <View style={styles.container}>
        <Title style={styles.title}>Iniciar Sesión</Title>

        <TextInput
          label="DUI (12345678-9)"
          value={usuario}
          onChangeText={manejarDui}
          mode="outlined"
          style={styles.input}
          keyboardType="numeric"
          left={<TextInput.Icon icon="card-account-details" />}
        />

        <TextInput
          label="Contraseña"
          value={clave}
          onChangeText={setClave}
          secureTextEntry={!mostrarClave}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={mostrarClave ? 'eye-off' : 'eye'}
              onPress={() => setMostrarClave(!mostrarClave)}
            />
          }
        />

        <Button
          mode="contained"
          onPress={iniciarSesion}
          style={styles.button}
          loading={loading}
          disabled={loading}
          icon="login"
        >
          {loading ? 'Cargando...' : 'Entrar'}
        </Button>

        <Button
          onPress={() => navigation.navigate('Registro')}
          style={styles.registerButton}
          icon="account-plus"
        >
          Registrarse
        </Button>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover'
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    margin: 20,
    padding: 25,
    borderRadius: 16,
    justifyContent: 'center',
    elevation: 8
  },
  title: {
    textAlign: 'center',
    marginBottom: 25,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1565c0'
  },
  input: {
    marginBottom: 15
  },
  button: {
    marginVertical: 10,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: '#1976d2'
  },
  registerButton: {
    marginTop: 5
  }
});

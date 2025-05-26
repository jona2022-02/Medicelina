// UsuariosScreen.js - CRUD de usuarios con mejor UIX y componentes reutilizables

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert, ImageBackground } from 'react-native';
import { Text, Card, Button, FAB, Chip, Title, IconButton, Divider } from 'react-native-paper';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import fondo from '../assets/fondo.jpeg';

export default function UsuariosScreen({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const isFocused = useIsFocused();

  const cargarUsuarios = async () => {
    const snapshot = await getDocs(collection(db, 'usuarios'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsuarios(data);
  };

  const eliminarUsuario = async (id) => {
    Alert.alert('Confirmar', '¿Deseas eliminar este usuario?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          await deleteDoc(doc(db, 'usuarios', id));
          cargarUsuarios();
        }
      }
    ]);
  };

  useEffect(() => {
    if (isFocused) cargarUsuarios();
  }, [isFocused]);

  const renderUsuario = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.nombre}
        subtitle={`🆔 ${item.dui || 'Sin DUI'} | 📧 ${item.email || 'Sin email'}`}
        titleStyle={{ color: '#004d40', fontWeight: 'bold' }}
      />
      <Card.Content>
        <Chip style={[styles.rol, item.rol === 'admin' ? styles.admin : styles.cliente]}>
          {item.rol === 'admin' ? 'Administrador' : 'Cliente'}
        </Chip>
        <Divider style={{ marginVertical: 10 }} />
        <Text>📱 Teléfono: {item.telefono || 'No disponible'}</Text>
        <Text>🏠 Dirección: {item.direccion || 'No disponible'}</Text>
        <Text>🎂 Edad: {item.edad || 'N/D'} años</Text>
      </Card.Content>
      <Card.Actions style={{ justifyContent: 'flex-end' }}>
        <Button
          icon="pencil"
          mode="text"
          onPress={() => navigation.navigate('UsuarioForm', { usuario: item })}
        >
          Editar
        </Button>
        <Button
          icon="delete"
          mode="contained"
          onPress={() => eliminarUsuario(item.id)}
          buttonColor="#d32f2f"
          textColor="#fff"
          style={{ borderRadius: 20, marginLeft: 10 }}
        >
          Eliminar
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <ImageBackground source={fondo} style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.cardContainer}>
          <Title style={styles.title}>👥 Gestión de Usuarios</Title>

          {usuarios.length === 0 ? (
            <View style={styles.vacioContenedor}>
              <IconButton icon="account" size={48} iconColor="#80cbc4" />
              <Text style={styles.vacioTexto}>No hay usuarios registrados</Text>
            </View>
          ) : (
            <FlatList
              data={usuarios}
              keyExtractor={item => item.id}
              renderItem={renderUsuario}
              contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('UsuarioForm')}
          label="Agregar"
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover'
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20
  },
  cardContainer: {
    width: '94%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingTop: 30,
    paddingBottom: 20,
    elevation: 5,
    flex: 1
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#00695c'
  },
  card: {
    marginBottom: 15,
    backgroundColor: '#e0f7fa',
    borderRadius: 12,
    elevation: 3,
    padding: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#4db6ac'
  },
  rol: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12
  },
  admin: {
    backgroundColor: '#00796b'
  },
  cliente: {
    backgroundColor: '#00838f'
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#00796b'
  },
  vacioContenedor: {
    alignItems: 'center',
    marginTop: 80
  },
  vacioTexto: {
    fontSize: 16,
    color: '#555'
  },
  actionButton: {
    marginVertical: 4,
    width: '100%',
    borderRadius: 20
  }
});

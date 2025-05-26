import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { addDoc, updateDoc, doc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function SucursalFormScreen({ navigation, route }) {
  const sucursal = route.params?.sucursal;
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (sucursal) {
      setNombre(sucursal.nombre);
      setDireccion(sucursal.direccion);
      setTelefono(sucursal.telefono);
    }
  }, [sucursal]);

  const formatearTelefono = (valor) => {
    const limpio = valor.replace(/\D/g, '');
    if (limpio.length <= 8) {
      const formateado = limpio.length > 4 ? `${limpio.slice(0, 4)}-${limpio.slice(4)}` : limpio;
      setTelefono(formateado);
    }
  };

  const validarTelefono = (valor) => /^\d{4}-\d{4}$/.test(valor);

  const guardarSucursal = async () => {
    if (!nombre || !direccion || !telefono) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos.');
      return;
    }

    if (!validarTelefono(telefono)) {
      Alert.alert('Formato incorrecto', 'El teléfono debe tener el formato ####-####');
      return;
    }

    setCargando(true);

    setTimeout(async () => {
      try {
        const datos = {
          nombre,
          direccion,
          telefono,
          updatedAt: serverTimestamp()
        };

        if (sucursal) {
          const docRef = doc(db, 'sucursales', sucursal.id);
          await updateDoc(docRef, datos);
          Alert.alert('Éxito', 'Sucursal actualizada correctamente');
        } else {
          await addDoc(collection(db, 'sucursales'), {
            ...datos,
            createdAt: serverTimestamp()
          });
          Alert.alert('Éxito', 'Sucursal guardada correctamente');
        }

        navigation.goBack();
      } catch (error) {
        Alert.alert('Error', 'No se pudo guardar la sucursal');
        console.error(error);
      } finally {
        setCargando(false);
      }
    }, 3000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text variant="titleLarge" style={styles.title}>
        {sucursal ? 'Editar Sucursal' : 'Nueva Sucursal'}
      </Text>

      <TextInput
        label="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
        left={<TextInput.Icon icon="office-building-marker" />}
      />

      <TextInput
        label="Dirección"
        value={direccion}
        onChangeText={setDireccion}
        style={styles.input}
        left={<TextInput.Icon icon="map-marker" />}
      />

      <TextInput
        label="Teléfono (####-####)"
        value={telefono}
        onChangeText={formatearTelefono}
        style={styles.input}
        keyboardType="phone-pad"
        maxLength={9}
        left={<TextInput.Icon icon="phone" />}
      />

      <Button
        mode="contained"
        onPress={guardarSucursal}
        style={styles.button}
        loading={cargando}
        disabled={cargando}
        icon="content-save"
      >
        {cargando ? 'Guardando...' : 'Guardar'}
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={styles.cancelButton}
        buttonColor="#b0bec5"
        textColor="#000"
        icon="cancel"
        disabled={cargando}
      >
        Cancelar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00796b',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  button: {
    marginVertical: 8,
    borderRadius: 30,
    backgroundColor: '#00796b'
  },
  cancelButton: {
    marginVertical: 8,
    borderRadius: 30
  }
});

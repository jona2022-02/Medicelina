import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Title, Snackbar, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function PerfilClienteScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const usuarioId = route.params?.usuarioId || null;

  const [usuario, setUsuario] = useState(null);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [clave, setClave] = useState('');
  const [verClave, setVerClave] = useState(false);
  const [rol, setRol] = useState('cliente');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (usuarioId) cargarPerfil();
  }, [usuarioId]);

  const cargarPerfil = async () => {
    try {
      const ref = doc(db, 'usuarios', usuarioId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setUsuario(data);
        setNombre(data.nombre || '');
        setTelefono(data.telefono || '');
        setDireccion(data.direccion || '');
        setClave(data.clave || '');
        setRol(data.rol || 'cliente');
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    }
  };

  const validarTelefono = (valor) => /^\d{4}-\d{4}$/.test(valor);
  const validarClave = (valor) => /^(?=.*[A-Z])(?=.*\d).{9,}$/.test(valor);

  const guardarCambios = async () => {
    let errores = [];
    if (!validarTelefono(telefono)) errores.push('Formato de teléfono inválido. Ej: 7686-1234');
    if (!validarClave(clave)) errores.push('La contraseña debe tener al menos 9 caracteres, 1 mayúscula y 1 número');

    if (errores.length > 0) {
      setMensaje(errores.join('\n'));
      return;
    }

    setCargando(true);
    setTimeout(async () => {
      try {
        await updateDoc(doc(db, 'usuarios', usuarioId), {
          nombre,
          telefono,
          direccion,
          clave
        });
        setMensaje('Datos actualizados con éxito');
      } catch (error) {
        console.error('Error al guardar:', error);
        setMensaje('Error al guardar los cambios');
      } finally {
        setCargando(false);
      }
    }, 3000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Title style={styles.title}>Mi Perfil</Title>

      <TextInput
        label="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Teléfono (####-####)"
        value={telefono}
        onChangeText={setTelefono}
        style={styles.input}
        mode="outlined"
        keyboardType="phone-pad"
      />
      <TextInput
        label="Dirección"
        value={direccion}
        onChangeText={setDireccion}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Contraseña"
        value={clave}
        onChangeText={setClave}
        style={styles.input}
        mode="outlined"
        secureTextEntry={!verClave}
        right={<TextInput.Icon icon={verClave ? 'eye-off' : 'eye'} onPress={() => setVerClave(!verClave)} />}
      />

      {cargando ? (
        <ActivityIndicator animating={true} size="large" style={{ marginVertical: 20 }} color="#1976d2" />
      ) : (
        <Button icon="content-save" mode="contained" onPress={guardarCambios} style={styles.button}>
          Guardar Cambios
        </Button>
      )}

      <Snackbar visible={!!mensaje} onDismiss={() => setMensaje('')} duration={3000}>
        {mensaje}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    flexGrow: 1,
    backgroundColor: '#f1fafe'
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#1976d2',
    fontWeight: 'bold'
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  button: {
    marginTop: 10,
    backgroundColor: '#1976d2',
    paddingVertical: 10,
    borderRadius: 30
  }
});

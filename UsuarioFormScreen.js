import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { TextInput, Button, Text, RadioButton, Title, Snackbar } from 'react-native-paper';
import { db } from '../firebaseConfig';
import { addDoc, updateDoc, doc, collection, getDocs } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function UsuarioFormScreen({ navigation, route }) {
  const usuario = route.params?.usuario;

  const [nombre, setNombre] = useState('');
  const [dui, setDui] = useState('');
  const [clave, setClave] = useState('');
  const [verClave, setVerClave] = useState(false);
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [correo, setCorreo] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(null);
  const [mostrarFecha, setMostrarFecha] = useState(false);
  const [edad, setEdad] = useState('');
  const [rol, setRol] = useState('cliente');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre || '');
      setDui(usuario.dui || '');
      setClave(usuario.clave || '');
      setTelefono(usuario.telefono || '');
      setDireccion(usuario.direccion || '');
      setCorreo(usuario.correo || '');
      setFechaNacimiento(usuario.fechaNacimiento ? new Date(usuario.fechaNacimiento) : null);
      setEdad(usuario.edad?.toString() || '');
      setRol(usuario.rol || 'cliente');
    }
  }, [usuario]);

  const formatearTelefono = (valor) => {
    const limpio = valor.replace(/\D/g, '');
    if (limpio.length <= 8) {
      const formateado = limpio.length > 4 ? `${limpio.slice(0, 4)}-${limpio.slice(4)}` : limpio;
      setTelefono(formateado);
    }
  };

  const formatearDui = (valor) => {
    const limpio = valor.replace(/\D/g, '');
    if (limpio.length <= 9) {
      const formateado = limpio.length > 8 ? `${limpio.slice(0, 8)}-${limpio.slice(8)}` : limpio;
      setDui(formateado);
    }
  };

  const calcularEdad = (fecha) => {
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const m = hoy.getMonth() - fecha.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }
    return edad;
  };

  const abrirSelectorFecha = () => setMostrarFecha(true);

  const onChangeFecha = (event, selectedDate) => {
    setMostrarFecha(Platform.OS === 'ios');
    if (selectedDate) {
      setFechaNacimiento(selectedDate);
      setEdad(calcularEdad(selectedDate).toString());
    }
  };

  const guardar = async () => {
    if (!nombre || !dui || !telefono || !direccion || !correo || !fechaNacimiento || !edad) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos.');
      return;
    }

    const edadNumerica = parseInt(edad);
    if (isNaN(edadNumerica) || edadNumerica < 18) {
      Alert.alert('Edad inválida', 'El usuario debe tener al menos 18 años.');
      return;
    }

    try {
      const snapshot = await getDocs(collection(db, 'usuarios'));
      const existeDui = snapshot.docs.find(
        doc => doc.data().dui === dui && doc.id !== usuario?.id
      );

      if (existeDui) {
        Alert.alert('DUI duplicado', 'Ya existe un usuario registrado con este número de DUI.');
        return;
      }

      setLoading(true);

      let claveFinal = clave;

      if (!usuario) {
        const dia = String(fechaNacimiento.getDate()).padStart(2, '0');
        const mes = String(fechaNacimiento.getMonth() + 1).padStart(2, '0');
        const anio = fechaNacimiento.getFullYear();
        claveFinal = `${dia}${mes}${anio}`;
      }

      const data = {
        nombre,
        dui,
        clave: claveFinal,
        telefono,
        direccion,
        correo,
        fechaNacimiento: fechaNacimiento.toISOString().split('T')[0],
        edad: edadNumerica,
        rol
      };

      setTimeout(async () => {
        if (usuario) {
          const ref = doc(db, 'usuarios', usuario.id);
          await updateDoc(ref, data);
          setMensaje('Usuario actualizado con éxito');
        } else {
          await addDoc(collection(db, 'usuarios'), data);
          setMensaje(`Usuario registrado. Clave: ${claveFinal}`);
        }

        setLoading(false);
        navigation.goBack();
      }, 3000);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'No se pudo guardar el usuario');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Title style={styles.title}>{usuario ? 'Editar Usuario' : 'Nuevo Usuario'}</Title>

      <TextInput label="Nombre completo" value={nombre} onChangeText={setNombre} style={styles.input} />
      <TextInput label="Correo electrónico" value={correo} onChangeText={setCorreo} style={styles.input} keyboardType="email-address" />
      <TextInput label="DUI (12345678-9)" value={dui} onChangeText={formatearDui} style={styles.input} keyboardType="numeric" />

      {usuario && (
        <TextInput
          label="Contraseña"
          value={clave}
          onChangeText={setClave}
          style={styles.input}
          secureTextEntry={!verClave}
          right={
            <TextInput.Icon
              icon={verClave ? 'eye-off' : 'eye'}
              onPress={() => setVerClave(!verClave)}
            />
          }
        />
      )}

      <TextInput
        label="Teléfono (####-####)"
        value={telefono}
        onChangeText={formatearTelefono}
        style={styles.input}
        keyboardType="phone-pad"
        maxLength={9}
      />
      <TextInput label="Dirección" value={direccion} onChangeText={setDireccion} style={styles.input} />

      <Button onPress={abrirSelectorFecha} style={styles.input} mode="outlined">
        {fechaNacimiento ? `Fecha: ${fechaNacimiento.toISOString().split('T')[0]}` : 'Seleccionar Fecha de Nacimiento'}
      </Button>

      {mostrarFecha && (
        <DateTimePicker
          value={fechaNacimiento || new Date()}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={onChangeFecha}
        />
      )}

      <TextInput
        label="Edad"
        value={edad}
        onChangeText={setEdad}
        style={styles.input}
        keyboardType="numeric"
        editable={false}
      />

      <Text style={styles.label}>Rol:</Text>
      <RadioButton.Group onValueChange={setRol} value={rol}>
        <RadioButton.Item label="Cliente" value="cliente" />
        <RadioButton.Item label="Administrador" value="admin" />
      </RadioButton.Group>

      <Button
        mode="contained"
        onPress={guardar}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        {loading ? 'Guardando...' : 'Guardar'}
      </Button>

      <Button onPress={() => navigation.goBack()} style={styles.button}>Cancelar</Button>

      <Snackbar visible={!!mensaje} onDismiss={() => setMensaje('')} duration={4000}>
        {mensaje}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 50, // ✅ Padding inferior agregado
    backgroundColor: '#f5f5f5'
  },
  title: {
    marginBottom: 20,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1976d2'
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  button: {
    marginTop: 10,
    borderRadius: 25
  }
});

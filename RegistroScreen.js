// RegistroScreen.js - Registro de clientes con validación avanzada, DUI y teléfono formateado, diseño UIX celeste y acqua, scroll y barra de estado visible

import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Alert, Platform, ScrollView, SafeAreaView } from 'react-native';
import { TextInput, Button, Text, Title, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function RegistroScreen() {
  const navigation = useNavigation();

  const [nombre, setNombre] = useState('');
  const [dui, setDui] = useState('');
  const [clave, setClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [edad, setEdad] = useState('');
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [verClave, setVerClave] = useState(false);
  const [verConfirmarClave, setVerConfirmarClave] = useState(false);

  const calcularEdad = (fecha) => {
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const abrirCalendario = () => setMostrarPicker(true);

  const seleccionarFecha = (event, selectedDate) => {
    setMostrarPicker(false);
    if (selectedDate) {
      const fechaStr = selectedDate.toISOString().split('T')[0];
      const edadCalculada = calcularEdad(fechaStr);
      setFechaNacimiento(fechaStr);
      setEdad(edadCalculada.toString());
    }
  };

  const manejarDui = (valor) => {
    const limpio = valor.replace(/[^0-9]/g, '');
    if (limpio.length <= 9) {
      const formateado = limpio.length > 8 ? limpio.slice(0, 8) + '-' + limpio.slice(8) : limpio;
      setDui(formateado);
    }
  };

  const manejarTelefono = (valor) => {
    const limpio = valor.replace(/[^0-9]/g, '');
    if (limpio.length <= 8) {
      const formateado = limpio.length > 4 ? limpio.slice(0, 4) + '-' + limpio.slice(4) : limpio;
      setTelefono(formateado);
    }
  };

  const validarClave = (clave) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{9,}$/;
    return regex.test(clave);
  };

  const registrar = async () => {
    try {
      if (!nombre || !dui || !clave || !confirmarClave || !telefono || !direccion || !fechaNacimiento) {
        Alert.alert('Campos requeridos', 'Completa todos los campos.');
        return;
      }

      if (!validarClave(clave)) {
        Alert.alert('Contraseña inválida', 'Debe tener al menos 9 caracteres, una mayúscula y un número.');
        return;
      }

      if (clave !== confirmarClave) {
        Alert.alert('Error', 'Las contraseñas no coinciden.');
        return;
      }

      const edadNum = parseInt(edad);
      if (isNaN(edadNum) || edadNum < 18) {
        Alert.alert('Edad no válida', 'Debes ser mayor de 18 años para registrarte.');
        return;
      }

      const usuariosSnap = await getDocs(collection(db, 'usuarios'));
      const existe = usuariosSnap.docs.find(doc => doc.data().dui === dui);

      if (existe) {
        Alert.alert('Ya registrado', 'Este número de DUI ya está registrado.');
        return;
      }

      await addDoc(collection(db, 'usuarios'), {
        nombre,
        dui,
        clave,
        telefono,
        direccion,
        fechaNacimiento,
        edad: edadNum,
        rol: 'cliente'
      });

      Alert.alert('Registrado', 'Usuario registrado correctamente');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al registrar:', error);
      Alert.alert('Error', 'Ocurrió un problema al registrar.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Title style={styles.title}>Registro de Cliente</Title>

          <TextInput label="Nombre completo" value={nombre} onChangeText={setNombre} style={styles.input} mode="outlined" />
          <TextInput label="DUI (12345678-9)" value={dui} onChangeText={manejarDui} style={styles.input} keyboardType="numeric" mode="outlined" />
          <TextInput
            label="Contraseña"
            value={clave}
            onChangeText={setClave}
            style={styles.input}
            secureTextEntry={!verClave}
            mode="outlined"
            right={<TextInput.Icon icon={verClave ? "eye-off" : "eye"} onPress={() => setVerClave(!verClave)} />}
          />
          <TextInput
            label="Confirmar Contraseña"
            value={confirmarClave}
            onChangeText={setConfirmarClave}
            style={styles.input}
            secureTextEntry={!verConfirmarClave}
            mode="outlined"
            right={<TextInput.Icon icon={verConfirmarClave ? "eye-off" : "eye"} onPress={() => setVerConfirmarClave(!verConfirmarClave)} />}
          />
          <TextInput label="Teléfono" value={telefono} onChangeText={manejarTelefono} style={styles.input} keyboardType="numeric" mode="outlined" />
          <TextInput label="Dirección" value={direccion} onChangeText={setDireccion} style={styles.input} mode="outlined" />

          <Pressable onPress={abrirCalendario}>
            <TextInput
              label="Fecha de Nacimiento"
              value={fechaNacimiento}
              editable={false}
              style={styles.input}
              right={<TextInput.Icon icon="calendar" />}
              mode="outlined"
            />
          </Pressable>

          {mostrarPicker && (
            <DateTimePicker
              mode="date"
              value={new Date()}
              onChange={seleccionarFecha}
              maximumDate={new Date()}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            />
          )}

          <TextInput label="Edad" value={edad} editable={false} style={styles.input} mode="outlined" />

          <Button mode="contained" onPress={registrar} style={styles.button}>Registrarse</Button>
          <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.buttonCancelar}>Cancelar</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa'
  },
  scrollContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 16,
    elevation: 5,
    borderColor: '#4dd0e1',
    borderWidth: 1
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#00796b',
    fontSize: 24,
    fontWeight: 'bold'
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#f9f9f9'
  },
  button: {
    marginTop: 10,
    backgroundColor: '#4dd0e1',
    borderRadius: 25,
    paddingVertical: 8
  },
  buttonCancelar: {
    marginTop: 10,
    borderColor: '#4dd0e1',
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 8
  }
});

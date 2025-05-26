
# 💊 Medicelina - App de Farmacia

**Medicelina** es una aplicación móvil desarrollada con **React Native** usando **Expo** y **Firebase**. Permite la gestión de usuarios, medicamentos, pedidos, sucursales y más. Está diseñada tanto para clientes como para administradores de la farmacia.

---

## 🚀 Funcionalidades Principales

- Registro e inicio de sesión de usuarios (clientes y administradores)
- Gestión de medicamentos (CRUD)
- Gestión de usuarios (CRUD)
- Registro de pedidos con selección de productos, método de entrega y forma de pago
- Historial de pedidos
- Gestión de sucursales
- Perfil de usuario editable
- Notificaciones visuales y validaciones

---

## 🧰 Tecnologías Usadas

- **React Native 0.79.2**
- **Expo ~53.0.9**
- **Firebase 11.7.3**
- **React Navigation**
- **React Native Paper**
- **React Native Vector Icons**
- **DateTime Picker**
- **React Native Animatable**

---

## 📦 Requisitos para Ejecutar Localmente

Antes de clonar y ejecutar este proyecto en tu máquina, asegúrate de tener lo siguiente instalado:

### 🔧 Prerrequisitos

| Herramienta                  | Versión Requerida       |
|-----------------------------|--------------------------|
| [Node.js](https://nodejs.org/)           | ≥ 18.x                  |
| [Expo CLI](https://docs.expo.dev/get-started/installation/)       | `npm install -g expo-cli` |
| [Git](https://git-scm.com/)               | Cualquier versión        |
| [Android Studio (opcional)] | Para correr en emulador |

---

## 🧪 Clonar y Ejecutar el Proyecto

### 1. Clona el repositorio



### 2. Instala las dependencias

```bash
npm install
```

---

### 3. Ejecuta la app con Expo

```bash
npm start
```

O directamente en Android:

```bash
npm run android
```

> Se abrirá automáticamente una ventana en tu navegador con el panel de control de Expo. Puedes escanear el QR con tu teléfono (usando Expo Go) o correrlo en un emulador.

---

## 🔑 Configurar Firebase

Antes de ejecutar correctamente el sistema, debes crear tu propio proyecto en Firebase y agregar tu archivo `firebaseConfig.js` en la raíz del proyecto con lo siguiente:

```js
// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'TU_API_KEY',
  authDomain: 'TU_DOMINIO.firebaseapp.com',
  projectId: 'ID_DEL_PROYECTO',
  storageBucket: '...',
  messagingSenderId: '...',
  appId: '...',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```



---




---

## 👨‍💻 Autor

- **Jonathan Hernández** - [@[tu-usuario](https://github.com/tu-usuario](https://github.com/jona2022-02/Medicelina/edit/main/README.md))


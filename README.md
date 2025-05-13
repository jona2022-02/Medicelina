# 💊 medicelina-app

Una aplicación móvil creada con **React Native** + **TypeScript**, diseñada para gestionar un inventario de medicamentos. Con **medicelina-app**, puedes agregar, editar, eliminar y listar medicamentos de manera sencilla y rápida. Ideal para clínicas pequeñas, farmacias o uso personal.

---

## 📲 Características principales

- 📋 Visualizar un listado de medicamentos
- ➕ Agregar nuevos medicamentos
- ✏️ Editar medicamentos existentes
- 🗑️ Eliminar medicamentos
- 💾 Almacenamiento persistente usando `AsyncStorage`
- 🧭 Navegación intuitiva entre pantallas

---

## 🧰 Tecnologías utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Navigation](https://reactnavigation.org/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

---

## 📁 Estructura del proyecto
medicelina-app/
├── App.tsx
├── navigation/
│ └── AppNavigator.tsx
├── screens/
│ ├── HomeScreen.tsx
│ └── AddMedicineScreen.tsx
├── services/
│ └── MedicineService.ts
├── types/
│ └── types.ts
├── assets/
│ └── [imágenes opcionales]
└── README.md


---

## ⚙️ Instalación y ejecución local

### Requisitos previos

- Tener Node.js instalado
- Tener Expo CLI instalado:  
  ```bash
  npm install -g expo-cli
Tener instalada la app Expo Go en tu dispositivo móvil (Android/iOS)

# Clonar este repositorio
git clone

# Entrar al directorio del proyecto
cd medicelina-app

# Instalar las dependencias
npm install

# Iniciar el proyecto
expo start

Escanea el código QR con Expo Go desde tu celular para probar la app en tiempo real.




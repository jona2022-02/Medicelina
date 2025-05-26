// autenticacion.js

// Define los permisos por rol
const permisosPorRol = {
  admin: [
    'Inicio',
    'Medicamentos',
    'Clientes',
    'Pedido',
    'Historial',
    'Sucursales',
    'Usuarios',
    'PerfilCliente'
  ],
  cliente: [
    'Pedido',
    'Historial',
    'PerfilCliente'
  ]
};

// Función para validar acceso
export function puedeAcceder(rol, pantalla) {
  const pantallasPermitidas = permisosPorRol[rol] || [];
  return pantallasPermitidas.includes(pantalla);
}

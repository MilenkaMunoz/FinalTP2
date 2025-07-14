export interface Client {
  id: number;              // Identificador único del cliente
  nationalId: string;      // DNI o identificación nacional
  firstName: string;       // Nombres del cliente
  lastName: string;        // Apellidos del cliente
  email: string;           // Dirección de correo electrónico
  phone: string;           // Teléfono del cliente
  address: string;         // Dirección del cliente
  district: string;        // Distrito del cliente
  status: string;          // Estado del cliente (Activo/Inactivo)
}

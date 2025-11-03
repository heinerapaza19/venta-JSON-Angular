export interface Cliente {
  id?: number;
  dni: string;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  fechaRegistro?: string;
}

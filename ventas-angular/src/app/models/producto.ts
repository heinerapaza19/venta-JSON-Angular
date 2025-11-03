export interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string; // ✅ este campo es el que faltaba
  precio: number;
  stock: number;
  categoria?: string;
  fechaRegistro?: string;
}

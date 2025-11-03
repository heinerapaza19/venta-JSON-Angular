import { Producto } from './producto';

export interface DetalleVenta {
  id?: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  producto: Producto; // relación con producto
  ventaId?: number;   // para enviar el ID de la venta asociada
}

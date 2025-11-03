import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetalleVenta } from '../../models/venta';
import { DetalleVentaService } from '../../services/venta.service';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-detalle-venta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.html',
  styleUrls: ['./ventas.css']
})
export class Ventas implements OnInit {

  // 🔹 Listas principales
  detalles: DetalleVenta[] = [];
  productos: Producto[] = [];

  // 🔹 Objeto actual del formulario
  detalleActual: DetalleVenta = {
    cantidad: 1,
    precioUnitario: 0,
    subtotal: 0,
    producto: { nombre: '', precio: 0, stock: 0, categoria: '' }
  };

  editando = false; // Indica si está en modo edición

  constructor(
    private detalleService: DetalleVentaService,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.listar();
    this.listarProductos();
  }

  // 🔹 Obtiene las ventas y extrae los detalles de cada una
  listar(): void {
    this.detalleService.listar().subscribe({
      next: (ventas: any[]) => {
        this.detalles = ventas.flatMap(v => v.detalles || []);
        console.log('🟢 Detalles extraídos:', this.detalles);
      },
      error: (err: any) => console.error('❌ Error al listar ventas:', err)
    });
  }

  // 🔹 Obtiene los productos para llenar el select
  listarProductos(): void {
    this.productoService.listar().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
        console.log('🟢 Productos cargados:', this.productos);
      },
      error: (err: any) => console.error('❌ Error al listar productos:', err)
    });
  }

  // 🔹 Calcula subtotal = cantidad × precioUnitario
  calcularSubtotal(): void {
    this.detalleActual.subtotal =
      this.detalleActual.cantidad * this.detalleActual.precioUnitario;
  }

  // 🔹 Actualiza el precio cuando se selecciona un producto
  actualizarPrecio(): void {
    if (this.detalleActual.producto) {
      this.detalleActual.precioUnitario = this.detalleActual.producto.precio;
      this.calcularSubtotal();
    }
  }

  // 🔹 Guarda o actualiza un detalle
  guardar(): void {
    this.calcularSubtotal();

    if (this.editando && this.detalleActual.id) {
      console.log('✏️ Actualizando detalle:', this.detalleActual);
      this.detalleService.actualizar(this.detalleActual.id, this.detalleActual).subscribe({
        next: () => {
          this.listar();
          this.cancelar();
        },
        error: (err) => console.error('❌ Error al actualizar detalle:', err)
      });
    } else {
      console.log('🆕 Guardando nuevo detalle:', this.detalleActual);
      this.detalleService.guardar(this.detalleActual).subscribe({
        next: () => {
          this.listar();
          this.cancelar();
        },
        error: (err) => console.error('❌ Error al guardar detalle:', err)
      });
    }
  }

  // 🔹 Carga los datos del detalle para editar
  editar(detalle: DetalleVenta): void {
    // Copia los datos seleccionados
    this.detalleActual = { ...detalle };

    // 🔹 Corrige el problema del select: busca el producto real en la lista
    const productoEncontrado = this.productos.find(p => p.id === detalle.producto?.id);
    if (productoEncontrado) {
      this.detalleActual.producto = productoEncontrado;
    }

    this.editando = true;
  }

  // 🔹 Elimina un detalle
  eliminar(id?: number): void {
    if (!id) return;
    if (confirm('¿Seguro que deseas eliminar este detalle?')) {
      this.detalleService.eliminar(id).subscribe({
        next: () => this.listar(),
        error: (err) => console.error('❌ Error al eliminar detalle:', err)
      });
    }
  }

  // 🔹 Limpia el formulario y sale del modo edición
  cancelar(): void {
    this.detalleActual = {
      cantidad: 1,
      precioUnitario: 0,
      subtotal: 0,
      producto: { nombre: '', precio: 0, stock: 0, categoria: '' }
    };
    this.editando = false;
  }
}

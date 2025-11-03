// ✅ Importaciones necesarias
import { Component, OnInit } from '@angular/core'; // Permite crear un componente y usar el ciclo de vida OnInit
import { CommonModule } from '@angular/common';   // Módulo con directivas comunes: ngIf, ngFor, etc.
import { FormsModule } from '@angular/forms';     // Permite usar [(ngModel)] para formularios
import { Producto } from '../../models/producto'; // Importa la interfaz del modelo Producto
import { ProductoService } from '../../services/producto.service'; // Servicio para conectar con el backend (Spring Boot)

// ✅ Decorador que define este componente
@Component({
  selector: 'app-productos',               // Nombre del selector HTML (<app-productos>)
  standalone: true,                        // Permite usar este componente sin necesidad de declararlo en un módulo
  imports: [CommonModule, FormsModule],    // Importa módulos necesarios para la vista
  templateUrl: './productos.html',         // Archivo HTML de la interfaz
  styleUrls: ['./productos.css']           // Archivo CSS del componente (usa plural)
})
export class Productos implements OnInit { // Clase principal del componente

  // 🔹 Lista de productos obtenidos del backend
  productos: Producto[] = [];

  // 🔹 Objeto temporal que se usa en el formulario
  productoActual: Producto = {
    nombre: '',
    descripcion: '',  // Campo adicional del producto
    precio: 0,
    stock: 0,
    categoria: ''
  };

  // 🔹 Bandera para saber si se está editando un producto existente
  editando = false;

  // 🔹 Inyección del servicio que maneja las peticiones HTTP
  constructor(private productoService: ProductoService) {}

  // 🔹 Método que se ejecuta automáticamente al iniciar el componente
  ngOnInit(): void {
    this.listar(); // Llama al método para listar todos los productos
  }

  // 🔹 Obtiene los productos desde el backend y los guarda en el arreglo
  listar(): void {
    this.productoService.listar().subscribe({
      next: (data: Producto[]) => this.productos = data, // Éxito: guarda los productos recibidos
      error: (err: any) => console.error('❌ Error al listar productos:', err) // Error: muestra en consola
    });
  }

  // 🔹 Guarda un nuevo producto o actualiza uno existente
  guardar(): void {
    if (this.editando && this.productoActual.id) {
      // 🧩 Si estamos editando, llama al servicio para actualizar
      this.productoService.actualizar(this.productoActual.id, this.productoActual).subscribe(() => {
        this.listar();  // Refresca la lista
        this.cancelar(); // Limpia el formulario
      });
    } else {
      // 🧩 Si no estamos editando, crea un nuevo producto
      this.productoService.guardar(this.productoActual).subscribe(() => {
        this.listar();   // Actualiza la lista
        this.cancelar(); // Limpia el formulario
      });
    }
  }

  // 🔹 Pasa los datos del producto seleccionado al formulario para editarlos
  editar(prod: Producto): void {
    this.productoActual = { ...prod }; // Crea una copia del producto seleccionado
    this.editando = true;              // Activa el modo edición
  }

  // 🔹 Elimina un producto por su ID
  eliminar(id?: number): void {
    if (!id) return; // Si no hay ID, no hace nada
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      // Confirma antes de eliminar
      this.productoService.eliminar(id).subscribe(() => this.listar()); // Llama al backend y refresca lista
    }
  }

  // 🔹 Limpia el formulario y sale del modo edición
  cancelar(): void {
    this.productoActual = {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      categoria: ''
    };
    this.editando = false; // Vuelve al modo agregar nuevo
  }
}

// ✅ Importaciones básicas necesarias
import { Component, OnInit } from '@angular/core'; // Permite crear un componente y usar el ciclo de vida OnInit
import { CommonModule } from '@angular/common';   // Módulo con directivas comunes como *ngFor y *ngIf
import { FormsModule } from '@angular/forms';     // Permite usar formularios con [(ngModel)]

// ✅ Importa el modelo (interfaz) Cliente y el servicio correspondiente
import { Cliente } from '../../models/clientes';
import { ClienteService } from '../../services/cliente.service';

// ✅ Decorador que define las características del componente
@Component({
  selector: 'app-clientes',              // Nombre del selector HTML (<app-clientes>)
  standalone: true,                      // Permite usar este componente sin necesidad de declararlo en un módulo
  imports: [CommonModule, FormsModule],  // Importa módulos necesarios para usar directivas y formularios
  templateUrl: './clientes.html',        // Archivo HTML de la vista del componente
  styleUrl: './clientes.css'             // ❌ debería ser "styleUrls" (plural) → "styleUrls: ['./clientes.css']"
})
export class Clientes implements OnInit {

  // 🔹 Arreglo que almacena todos los clientes obtenidos del backend
  clientes: Cliente[] = [];

  // 🔹 Objeto que representa el cliente actual del formulario (para agregar o editar)
  clienteActual: Cliente = {
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: ''
  };

  // 🔹 Variable para saber si se está editando un cliente existente
  editando = false;

  // 🔹 Inyección del servicio ClienteService para conectarse al backend
  constructor(private clienteService: ClienteService) {}

  // 🔹 Método del ciclo de vida Angular → se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.listar(); // Carga la lista de clientes al abrir la página
  }

  // ==========================
  // 🧩 MÉTODOS PRINCIPALES
  // ==========================

  // 🔸 Obtiene la lista de clientes desde el backend
  listar(): void {
    this.clienteService.listar().subscribe({
      next: (data: Cliente[]) => this.clientes = data,               // Éxito → guarda la lista recibida
      error: (err: any) => console.error('❌ Error al listar clientes:', err) // Error → muestra en consola
    });
  }

  // 🔸 Guarda un nuevo cliente o actualiza uno existente
  guardar(): void {
    if (this.editando && this.clienteActual.id) {
      // 🧠 Si estamos editando → actualiza cliente
      this.clienteService.actualizar(this.clienteActual.id, this.clienteActual).subscribe(() => {
        this.listar();   // Refresca la tabla
        this.cancelar(); // Limpia el formulario
      });
    } else {
      // 🧠 Si no estamos editando → crea un nuevo cliente
      this.clienteService.guardar(this.clienteActual).subscribe(() => {
        this.listar();   // Refresca la tabla
        this.cancelar(); // Limpia el formulario
      });
    }
  }

  // 🔸 Pasa los datos del cliente seleccionado al formulario para editar
  editar(cli: Cliente): void {
    this.clienteActual = { ...cli }; // Copia los datos del cliente seleccionado
    this.editando = true;            // Activa el modo edición
  }

  // 🔸 Elimina un cliente por su ID
  eliminar(id?: number): void {
    if (!id) return; // Si no hay ID, no hace nada
    if (confirm('¿Seguro que deseas eliminar este cliente?')) {
      // Confirma antes de eliminar
      this.clienteService.eliminar(id).subscribe(() => this.listar()); // Elimina y refresca la tabla
    }
  }

  // 🔸 Limpia los campos del formulario y desactiva el modo edición
  cancelar(): void {
    this.clienteActual = {
      dni: '',
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      direccion: ''
    };
    this.editando = false; // Regresa al modo "nuevo cliente"
  }
}

// ✅ Permite marcar esta clase como un servicio inyectable en Angular
import { Injectable } from '@angular/core';

// ✅ Módulo para hacer peticiones HTTP (GET, POST, PUT, DELETE)
import { HttpClient } from '@angular/common/http';

// ✅ Observable: tipo de dato usado para manejar respuestas asíncronas (RxJS)
import { Observable } from 'rxjs';

// ✅ Modelo (interfaz) del producto
import { Producto } from '../models/producto';

// ✅ Decorador que indica que este servicio puede inyectarse en toda la aplicación
@Injectable({
  providedIn: 'root' // Disponible globalmente (no es necesario declararlo en un módulo)
})
export class ProductoService {

  // 🔹 URL base de la API del backend (Spring Boot)
  // Ejemplo: http://localhost:8080/productos → endpoint REST del controlador
  private apiUrl = 'http://localhost:8080/productos';

  // 🔹 Inyecta el cliente HTTP de Angular para usar sus métodos (GET, POST, PUT, DELETE)
  constructor(private http: HttpClient) {}

  // ==========================
  // 🧩 MÉTODOS DEL SERVICIO
  // ==========================

  // 🔸 Listar todos los productos
  listar(): Observable<Producto[]> {
    // GET → obtiene la lista de productos desde el backend
    return this.http.get<Producto[]>(this.apiUrl);
  }

  // 🔸 Guardar un nuevo producto
  guardar(producto: Producto): Observable<Producto> {
    // POST → envía un producto al backend para registrarlo
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  // 🔸 Actualizar un producto existente
  actualizar(id: number, producto: Producto): Observable<Producto> {
    // PUT → actualiza el producto con el ID indicado
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }

  // 🔸 Eliminar un producto por su ID
  eliminar(id: number): Observable<void> {
    // DELETE → elimina el producto con el ID indicado
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

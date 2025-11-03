import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DetalleVenta } from '../models/venta';


@Injectable({
  providedIn: 'root'
})
export class DetalleVentaService {
  private apiUrl = 'http://localhost:8080/ventas'; // Ajusta si tu endpoint tiene otro nombre

  constructor(private http: HttpClient) {}

  listar(): Observable<DetalleVenta[]> {
    return this.http.get<DetalleVenta[]>(this.apiUrl);
  }

  guardar(detalle: DetalleVenta): Observable<DetalleVenta> {
    return this.http.post<DetalleVenta>(this.apiUrl, detalle);
  }

  actualizar(id: number, detalle: DetalleVenta): Observable<DetalleVenta> {
    return this.http.put<DetalleVenta>(`${this.apiUrl}/${id}`, detalle);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

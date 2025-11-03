import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

interface Venta {
  id: number;
  fecha: string;        // ISO desde Spring (LocalDateTime)
  total: number;
  estado: string;
  cliente?: any;
  detalles?: any[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiClientes = 'http://localhost:8080/api/clientes';
  private apiProductos = 'http://localhost:8080/api/productos';
  private apiVentas    = 'http://localhost:8080/api/ventas';

  constructor(private http: HttpClient) {}

  contarClientes(): Observable<number> {
    return this.http.get<any[]>(this.apiClientes).pipe(map(arr => arr.length));
  }

  contarProductos(): Observable<number> {
    return this.http.get<any[]>(this.apiProductos).pipe(map(arr => arr.length));
  }

  // VENTAS DEL DÍA (cantidad y monto total)
  ventasDeHoy(): Observable<{ cantidad: number; monto: number; ultimas: Venta[] }> {
    return this.http.get<Venta[]>(this.apiVentas).pipe(
      map(ventas => {
        const hoy = new Date(); // zona local
        const esMismoDia = (iso: string) => {
          const d = new Date(iso);
          return d.getFullYear() === hoy.getFullYear()
              && d.getMonth() === hoy.getMonth()
              && d.getDate() === hoy.getDate();
        };

        const deHoy = ventas.filter(v => v.fecha && esMismoDia(v.fecha));
        const monto = deHoy.reduce((acc, v) => acc + (Number(v.total) || 0), 0);
        // últimas 5 (si quieres orden por fecha, puedes ordenar aquí)
        const ultimas = [...deHoy].reverse().slice(0, 5);
        return { cantidad: deHoy.length, monto, ultimas };
      })
    );
  }
}

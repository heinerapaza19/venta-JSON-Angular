import { Routes } from '@angular/router';
import { Inicio} from './pages/inicio/inicio';
import { Productos} from './pages/productos/productos';
import { Clientes } from './pages/clientes/clientes';
import { Ventas} from './pages/ventas/ventas';

export const routes: Routes = [
  { path: 'inicio', component: Inicio },
  { path: 'productos', component: Productos},
  { path: 'clientes', component: Clientes },
  { path: 'ventas', component: Ventas},
  { path: '', redirectTo: '/inicio', pathMatch: 'full' }
];

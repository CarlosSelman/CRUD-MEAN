//Importaciones de Componentes (Diferentes vistas en la página)
import { ErrorNoExisteComponent } from './componentes/error-no-existe/error-no-existe.component';
import { LoginComponent } from './componentes/login/login.component';
import { UsuarioComponent } from './componentes/usuario/usuario.component';
import { DatosUsuarioComponent } from './componentes/datos-usuario/datos-usuario.component';

//Otras importaciones
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Diferentes rutas a las que se puede navegar
const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'usuarios', component: UsuarioComponent},
  { path: 'datosPerfil/:idResponsable', component: DatosUsuarioComponent},
  { path: '**', component: ErrorNoExisteComponent} //Ruta que me redirige al error 404 si no existe la ruta
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

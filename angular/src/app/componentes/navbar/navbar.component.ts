import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/modelos/usuario.modelo';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import Swal from "sweetalert2";
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [UsuarioService]
})
export class NavbarComponent implements OnInit {
  public identidad;
  public token:any;

  constructor(public _usuarioService: UsuarioService,
    private _router: Router) {
    this.identidad = this._usuarioService.getIdentidad();
   }

  ngOnInit(): void {
    console.log(this.identidad);
  }

  refresh(): void{
    window.location.reload();
  }

  cerrarSesion(){
    this.identidad = null;
    this.token = null;
    localStorage.setItem('identidad', JSON.stringify(this.identidad))
    localStorage.setItem('token', JSON.stringify(this.token));
    Swal.fire({
      icon: 'success',
      title: 'Sesión cerrada exitosamente',
      showConfirmButton: false,
      timer: 1500,
    });
    this._router.navigate(['/login']);
  }

}

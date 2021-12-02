import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/modelos/usuario.modelo';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [UsuarioService]
})
export class LoginComponent implements OnInit {

  public usuarioModel: Usuario;
  public token;
  public identidad;

  constructor(
    private _usuarioService: UsuarioService,
    private _router: Router
  ) {
    this.usuarioModel = new Usuario('', '', '', '', '', '', '', '', '');
  }

  ngOnInit(): void {}

  getToken() {
    this._usuarioService.login(this.usuarioModel).subscribe(
      (response)=> {
        console.log(response);
        this.token = response.token;
        localStorage.setItem('token', JSON.stringify(this.token));
        this.refresh();
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

  login() {
    this._usuarioService.login(this.usuarioModel).subscribe(
      (response) => {
        console.log(response);
        //this.refresh()
        this.identidad = response.usuarioEncontrado;
        localStorage.setItem('identidad', JSON.stringify(this.identidad));
        this.getToken();
        this.token=response.token;
        localStorage.setItem('token', JSON.stringify(this.token));

        if(this.identidad.estado=="Activo"){
            Swal.fire({
              //position: 'top-end',
              icon: 'success',
              title: 'Ingreso exitoso',
              showConfirmButton: false,
              timer: 1500,
            });
            this._router.navigate(['/usuarios']);
        } else if(this.identidad.estado!="Activo"){
          Swal.fire({
            icon: 'error',
            title: 'Su cuenta no está activa',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      },
      (error) => {
        console.log(<any>error);
        Swal.fire({
          //position: 'top-end',
          icon: 'error',
          title: 'Dato(s) incorrecto(s)',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    );
  }

  refresh(): void{
    window.location.reload();
  }
}

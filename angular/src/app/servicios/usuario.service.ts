import { Injectable } from '@angular/core';
import { Usuario } from '../modelos/usuario.modelo';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { GLOBAL } from "./global.service";
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public url: String;
  public identidad: any;
  public token: any;
  public headersVariable = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(public _http: HttpClient) {
    this.url = GLOBAL.url;
  }


  login(usuario:any, obtenerToken = null): Observable<any>{
    if(obtenerToken != null){
      usuario.obtenerToken = obtenerToken;
     }

    let params = JSON.stringify(usuario);

    return this._http.post(this.url + '/login', params, {headers: this.headersVariable});
  }

  crearUsuario(usuario: Usuario):Observable<any>{
    let params = JSON.stringify(usuario);

    return this._http.post(this.url + '/crearUsuario/', params,{headers: this.headersVariable})
  }

  obtenerUsuarios(): Observable<any>{
    return this._http.get(this.url + '/obtenerUsuarios', {headers: this.headersVariable});
  }

  obtenerUsuariosD(): Observable<any>{
    return this._http.get(this.url + '/obtenerUsuariosD', {headers: this.headersVariable});
  }

  obtenerUsuarioId(id:String): Observable<any>{
    return this._http.get(this.url + '/obtenerUsuario/'+ id, {headers: this.headersVariable})
  }

  editarUsuario(usuario: Usuario):Observable<any>{
    let params = JSON.stringify(usuario);
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    return this._http.put(this.url + '/editarUsuario/' + usuario._id, params, {headers: headersToken})
  }

  activarUsuario(id:String):Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())
    return this._http.put(this.url + '/activarUsuario/' + id, {headers: headersToken})
  }

  desactivarUsuario(id:String):Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())
    return this._http.put(this.url + '/desactivarUsuario/' + id, {headers: headersToken})
  }

  eliminarUsuario(id:String): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken());

    return this._http.delete(this.url + '/eliminarUsuario/' + id, {headers: headersToken})
  }
  getIdentidad(){
    //var identidad2:string = JSON.parse(localStorage.getItem('identidad'))
    var identidad2:string = JSON.parse(localStorage.getItem('identidad') || '{}');
    if(identidad2 != 'undefined'){
      this.identidad = identidad2
    }else{
      this.identidad = null;
    }

    return this.identidad;
  }

  getToken(){
    //var token2 = localStorage.token;
    var token2 = localStorage.getItem('token');
    if(token2 != 'undefined'){
      this.token = token2;
    }else{
      this.token = null;
    }

    return this.token;
  }

}

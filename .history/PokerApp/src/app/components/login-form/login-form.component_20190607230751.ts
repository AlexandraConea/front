import { AuthDataStorage } from './../../security/auth-data-storage';
import { HostListener } from '@angular/core';
import { OVERLAY_KEYBOARD_DISPATCHER_PROVIDER } from '../../../../node_modules/@angular/cdk/overlay/typings/keyboard/overlay-keyboard-dispatcher';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LoginFormService } from '../../services/login-form/login-form.service';
import { Router } from '@angular/router';
import { User } from '../../shared/data-types/User';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})

export class LoginFormComponent implements OnInit {

  @Output() userEventEmitter = new EventEmitter();

  user = new User();

  error1: boolean;
  error2: boolean;
  error3:boolean;
  username: string;
  password: string;
  confirmedPassword: string;
  isRegisterPage: boolean;

  constructor(private service: LoginFormService,
    private router: Router,
    private authDataStorage: AuthDataStorage,
  ) { }

  ngOnInit() {

   this. error1 = false;
   this.error2 = false;
   this.error3 = false;
    this.userEventEmitter.emit(this.user);
  }


  logIn(): void {
    if (this.username == null || this.password == null ){
      this.error3 = true;
      this.error1 = false;
      this.error2 = false;
    }
    else {
      let loggedUser: User;
      this.service.getByUsername(this.username).subscribe(data=>{
        loggedUser = data;
        this.authDataStorage.setLoggedUser(loggedUser); })
      this.service.login(this.username, this.password).subscribe(
        response => {
          console.log(response.headers);
          let jwtToken = response.headers.get('Authorization');
          this.authDataStorage.setJwtToken(jwtToken);
          this.router.navigate(['/home']);
        },
        err => {
          this.error1 = true;
          this.error2 = false;
          this.error3 = false;          
        });
    }
  }

  register(): void {
    this.error1 = false;
    this.error2 = false;
    this.error3 = false;
    this.isRegisterPage = true;
  }

  createAccount(): void {
    if (this.username == null || this.password == null  || this.confirmedPassword == null ){
      this.error3 = true;
      this.error1 = false;
      this.error2 = false;
    }
    else {
      this.service.register(this.username, this.password, this.confirmedPassword).subscribe(
        response => {
          this.logIn();
        },
        err => {
          this.error2 = true;
          this.error1 = false;
          this.error3 = false;
        }
      )
    }
  }

  logOut(): void {
    this.authDataStorage.clearAuthData();
    this.router.navigate(['/logout']);
  }

  @HostListener('document:keypress', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.logIn();
    }
  }

} 

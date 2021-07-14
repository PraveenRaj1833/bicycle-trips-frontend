import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username : string = '';
  password : string = '';

  constructor(private _userService : UserService, private router : Router) { }

  ngOnInit(): void {
  }

  handleSubmit(data : any){
    console.log(data);
    this.username = data.username;
    this.password = data.password;
    console.log(this.username+" "+this.password);
    this._userService.login(this.username,this.password)
      .subscribe(
        data=>{
                console.log("success",data);
                if(data.status===200){
                  alert("login succesful");
                  window.sessionStorage.setItem("email",this.username);
                  // this.router.navigate(['/home',this.username]);
                  this.router.navigate(['/home']);
                }
                else{
                  alert(data.msg);
                }
              },
        error=> console.log("Error", error)

      )
  }
}

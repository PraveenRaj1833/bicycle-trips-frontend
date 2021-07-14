import { Component, OnInit } from '@angular/core';
import { UserRegister } from '../user-register';
import { UserService } from '../user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private readonly _userService : UserService, private router : Router) { }

  userModel = new UserRegister('','','','');

  ngOnInit(): void {
  }

  handleSubmit(){
    console.log(JSON.stringify(this.userModel));
    if(this.userModel.password===this.userModel.confirmPassword && this.userModel.password!==""
     && this.userModel.name!=="" && this.userModel.email!==""){
        this._userService.register({
                  name : this.userModel.name,
                  email : this.userModel.email,
                  password : this.userModel.password
                }).subscribe(
                  (data)=>{
                    console.log("success",data);
                    alert("succesfully registered");
                    this.router.navigate(['/']);
                  },
                  (error)=>console.log("error",error)
                )
     }
     else{
       alert("please enter valid details");
     }
  }

}

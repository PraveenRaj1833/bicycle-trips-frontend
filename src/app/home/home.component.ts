import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { ActivatedRoute, ParamMap , Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userModel : User = new User('','',[]);
  email : string = '';
  constructor(private readonly _userService : UserService, private route : ActivatedRoute , private router : Router) { }

  ngOnInit(): void {
    // this.route.paramMap.subscribe((params : ParamMap)=>{
    //   let email = params.get('id');
    //   this.email = email==null?'':email;
    // })
    if(window.sessionStorage.getItem('email')!==null && window.sessionStorage.getItem('email')!==''){
        let email = window.sessionStorage.getItem('email');
        this.email = email?email:'';
        this._userService.getUserDetails(this.email).subscribe(
        (data)=>{
          console.log("success",data);
          if(data.status===200){
            const user = data.user;
            this.userModel = new User(user.name,user.email,user.trips);
          }
          else{
            alert(data.msg);
          }
        },
        (err)=>{
          console.log("error",err);
        }
      )
    }
    
  }

  logout(){
    window.sessionStorage.clear();
    this.router.navigate(['/']);
  }

  addTrip(){
    this.router.navigate(['/addTrip',{email : this.email}]);
  }
}

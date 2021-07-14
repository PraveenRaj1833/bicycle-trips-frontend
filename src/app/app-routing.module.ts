import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTripComponent } from './add-trip/add-trip.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {path : '', component : LoginComponent},
  {path : 'signup' , component : SignupComponent},
  {path : 'home' , component : HomeComponent},
  {path : 'addTrip', component : AddTripComponent},
  {path : "**",component : PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
                                  LoginComponent,
                                  SignupComponent,
                                  HomeComponent,
                                  PageNotFoundComponent,
                                  AddTripComponent
                                ]
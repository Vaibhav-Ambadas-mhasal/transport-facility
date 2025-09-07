import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRideComponent } from './pages/add-ride/add-ride.component';
import { BookRideComponent } from './pages/book-ride/book-ride.component';

const routes: Routes = [
  { path: 'add-ride', component: AddRideComponent },
  { path: 'book-ride', component: BookRideComponent },
  { path: '', redirectTo: 'add-ride', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { Routes } from '@angular/router';
import { AddTripComponent } from './add-trip/add-trip.component';
import { TripListingComponent } from './trip-listing/trip-listing.component';
import { EditTripComponent } from './edit-trip/edit-trip.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: 'add-trip', component: AddTripComponent },
  { path: '', component: TripListingComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'list-trips', component: TripListingComponent},
  { path '', component: HomeComponent, pathMatch: 'full' }
];

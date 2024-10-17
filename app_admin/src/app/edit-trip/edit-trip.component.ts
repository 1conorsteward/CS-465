import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.component.html',
  styleUrls: ['./edit-trip.component.css']
})
export class EditTripComponent implements OnInit {
  editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripDataService
  ) {}

  ngOnInit(): void {
    const tripCode = localStorage.getItem('tripCode');
    if (!tripCode) {
      alert('Something went wrong, couldn\'t find where I stashed tripCode!');
      this.router.navigate(['']);
      return;
    }

    this.editForm = this.formBuilder.group({
      _id: ['', Validators.required],
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });

    // Fetch the trip details based on the tripCode
    this.tripDataService.getTrip(tripCode).subscribe({
      next: (trip: Trip) => {
        if (trip) {
          this.editForm.patchValue(trip);
          this.message = `Trip: ${tripCode} retrieved successfully!`;
        } else {
          this.message = `No Trip retrieved!`;
        }
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  public onSubmit(): void {
    this.submitted = true;

    if (this.editForm.valid) {
      this.tripDataService.updateTrip(this.editForm.value).subscribe({
        next: (data) => {
          console.log(data);
          this.router.navigate(['']);
        },
        error: (err) => {
          console.error('Error:', err);
        }
      });
    }
  }

  get f() {
    return this.editForm.controls;
  }
}

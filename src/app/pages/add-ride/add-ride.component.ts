import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RideService } from '../../services/ride.service';
import { Ride } from '../../models/ride.model';
import { DialogComponent } from '../../shared/dialog/dialog/dialog.component';

@Component({
  selector: 'app-add-ride',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogComponent],
  templateUrl: './add-ride.component.html',
  styleUrls: ['./add-ride.component.scss'],
})
export class AddRideComponent implements OnInit {
  rideForm!: FormGroup;

  // dialog state
  dialogVisible = false;
  dialogTitle = '';
  dialogMessage = '';

  constructor(private fb: FormBuilder, private rideService: RideService) {}

  ngOnInit(): void {
    this.rideForm = this.fb.group({
      employeeId: ['', [Validators.required, Validators.minLength(3)]],
      vehicleType: ['Bike', Validators.required],
      vehicleNo: ['', Validators.required],
      vacantSeats: [1, [Validators.required, Validators.min(1)]],
      time: ['', Validators.required],
      pickupPoint: ['', Validators.required],
      destination: ['', Validators.required],
    });
  }

  // show reusable dialog
  showDialog(title: string, message: string) {
    this.dialogTitle = title;
    this.dialogMessage = message;
    this.dialogVisible = true;
  }

  submitRide() {
    if (this.rideForm.invalid) {
      this.rideForm.markAllAsTouched();
      return;
    }

    const employeeId = this.rideForm.value.employeeId;

    // Check if Employee ID already has a ride
    const existingRide = this.rideService.getRides().find((r) => r.employeeId === employeeId);
    if (existingRide) {
      // Show dialog with Employee ID
      this.showDialog('Notice', `Employee ID ${employeeId} has already created a ride.`);
      return; // Do not save duplicate ride
    }

    // Create new ride
    const ride: Ride = {
      rideId: Date.now().toString(),
      bookedEmployees: [],
      ...this.rideForm.value,
    };

    this.rideService.addRide(ride);

    // Show success dialog
    this.showDialog('Success', `Ride added successfully for Employee ID ${employeeId}`);

    // Reset form
    this.rideForm.reset({
      vehicleType: 'Bike',
      vacantSeats: 1,
    });
  }
}

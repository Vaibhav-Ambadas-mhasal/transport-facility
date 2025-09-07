import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ride } from '../../models/ride.model';
import { RideService } from '../../services/ride.service';
import { DialogComponent } from '../../shared/dialog/dialog/dialog.component';

@Component({
  selector: 'app-book-ride',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogComponent],
  templateUrl: './book-ride.component.html',
  styleUrls: ['./book-ride.component.scss'],
})
export class BookRideComponent implements OnInit {
  rides: Ride[] = [];
  filteredRides: Ride[] = [];
  filterVehicle: string = '';
  filterTime: string = '';
  employeeId: string = '';
  ridesLoaded: boolean = false;

  // dialog state
  dialogVisible = false;
  dialogTitle = '';
  dialogMessage = '';

  constructor(private rideService: RideService) {}

  ngOnInit() {}

  // Reusable dialog function to show messages
  showDialog(title: string, message: string) {
    this.dialogTitle = title;
    this.dialogMessage = message;
    this.dialogVisible = true;
  }

  // Loads all rides except those created by or already booked by this employee
  loadRides() {
    if (!this.employeeId) {
      this.showDialog('Error', 'Enter your Employee ID');
      return;
    }

    this.ridesLoaded = true;

    // Get rides from service and filter out employee’s own rides and already booked rides
    this.rides = this.rideService
      .getRides()
      .filter(
        (r) => r.employeeId !== this.employeeId && !r.bookedEmployees.includes(this.employeeId)
      );

    // Apply extra filters (vehicle type and time)
    this.applyFilters();
  }

  // Applies filtering based on vehicle type and ±60 minutes time window
  applyFilters() {
    this.filteredRides = this.rides.filter((ride) => {
      let match = true;

      // Filter by vehicle type
      if (this.filterVehicle) {
        match = match && ride.vehicleType === this.filterVehicle;
      }

      // Filter by time (within 1 hour difference)
      if (this.filterTime) {
        const [userHours, userMinutes] = this.filterTime.split(':').map(Number);
        const userTotalMinutes = userHours * 60 + userMinutes;

        const rideTimeParts = ride.time.split(':');
        const rideHours = Number(rideTimeParts[0]);
        const rideMinutes = Number(rideTimeParts[1]);
        const rideTotalMinutes = rideHours * 60 + rideMinutes;

        const diffMinutes = Math.abs(userTotalMinutes - rideTotalMinutes);
        match = match && diffMinutes <= 60;
      }

      return match;
    });
  }

  // Attempts to book a ride for the employee
  // Shows success or error messages depending on rules from RideService
  bookRide(ride: Ride) {
    if (!this.employeeId) {
      this.showDialog('Error', 'Enter your Employee ID');
      return;
    }

    const success = this.rideService.bookRide(ride.rideId, this.employeeId);
    if (success) {
      this.showDialog('Success', 'Ride booked successfully!');
      this.loadRides(); // reload rides after booking
    } else {
      this.showDialog('Error', 'Cannot book this ride. Already booked or no vacant seats left.');
    }
  }
}

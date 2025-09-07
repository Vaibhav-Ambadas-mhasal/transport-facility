import { Injectable } from '@angular/core';
import { Ride } from '../models/ride.model';

@Injectable({ providedIn: 'root' })
export class RideService {
  private storageKey = 'rides';

  constructor() {
    // Initialize localStorage with an empty rides array if not present
    if (!localStorage.getItem(this.storageKey)) {
      const defaultRides: Ride[] = [];
      localStorage.setItem(this.storageKey, JSON.stringify(defaultRides));
    }
  }

  // Get all rides from localStorage
  getRides(): Ride[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  // Add a new ride to localStorage
  addRide(ride: Ride) {
    const rides = this.getRides();
    rides.push(ride);
    localStorage.setItem(this.storageKey, JSON.stringify(rides));
  }

  // Try to book a ride for an employee
  // Returns true if booking is successful, false if rules are violated
  bookRide(rideId: string, employeeId: string): boolean {
    const rides = this.getRides();
    const ride = rides.find((r) => r.rideId === rideId);
    if (!ride) return false; // ride not found

    // Rule 1: Employee cannot book their own ride
    // Rule 2: Employee cannot book the same ride twice
    if (ride.employeeId === employeeId || ride.bookedEmployees.includes(employeeId)) {
      return false;
    }

    // Rule 3: Check if there are vacant seats
    if (ride.vacantSeats <= 0) return false;

    // Book the ride: add employee to booked list and reduce vacant seats
    ride.bookedEmployees.push(employeeId);
    ride.vacantSeats--;

    // Save updated rides back to localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(rides));
    return true;
  }
}

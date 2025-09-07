export interface Ride {
  rideId: string;
  employeeId: string;
  vehicleType: 'Bike' | 'Car';
  vehicleNo: string;
  vacantSeats: number;
  time: string;
  pickupPoint: string;
  destination: string;
  bookedEmployees: string[];
}

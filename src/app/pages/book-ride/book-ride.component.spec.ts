import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookRideComponent } from './book-ride.component';
import { RideService } from '../../services/ride.service';
import { Ride } from '../../models/ride.model';

describe('BookRideComponent', () => {
  let component: BookRideComponent;
  let fixture: ComponentFixture<BookRideComponent>;
  let rideServiceSpy: jasmine.SpyObj<RideService>;

  const mockRides: Ride[] = [
    {
      rideId: '1',
      employeeId: 'E002',
      vehicleType: 'Car',
      vehicleNo: 'KA01AB1234',
      vacantSeats: 3,
      time: '10:00',
      pickupPoint: 'A',
      destination: 'B',
      bookedEmployees: [],
    },
    {
      rideId: '2',
      employeeId: 'E003',
      vehicleType: 'Bike',
      vehicleNo: 'KA02XY5678',
      vacantSeats: 1,
      time: '15:30',
      pickupPoint: 'X',
      destination: 'Y',
      bookedEmployees: [],
    },
  ];

  beforeEach(async () => {
    rideServiceSpy = jasmine.createSpyObj('RideService', ['getRides', 'bookRide']);
    rideServiceSpy.getRides.and.returnValue(mockRides);

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, BookRideComponent],
      providers: [{ provide: RideService, useValue: rideServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(BookRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should show dialog with correct title and message', () => {
    component.showDialog('Test Title', 'Test Message');
    expect(component.dialogVisible).toBeTrue();
    expect(component.dialogTitle).toBe('Test Title');
    expect(component.dialogMessage).toBe('Test Message');
  });

  it('should not load rides if employeeId is missing', () => {
    component.employeeId = '';
    component.loadRides();
    expect(component.dialogVisible).toBeTrue();
    expect(component.dialogMessage).toBe('Enter your Employee ID');
  });

  it('should load rides excluding self rides and already booked', () => {
    component.employeeId = 'E001';
    component.loadRides();
    expect(component.rides.length).toBe(2); // self not in list
    expect(component.filteredRides.length).toBe(2);
  });

  it('should filter rides by vehicle type', () => {
    component.employeeId = 'E001';
    component.loadRides();
    component.filterVehicle = 'Car';
    component.applyFilters();
    expect(component.filteredRides.length).toBe(1);
    expect(component.filteredRides[0].vehicleType).toBe('Car');
  });

  it('should filter rides within ±60 minutes', () => {
    component.employeeId = 'E001';
    component.loadRides();
    component.filterTime = '09:30'; // close to 10:00 ride
    component.applyFilters();
    expect(component.filteredRides.length).toBe(1);
    expect(component.filteredRides[0].time).toBe('10:00');
  });

  it('should return no rides when outside ±60 minutes', () => {
    component.employeeId = 'E001';
    component.loadRides();
    component.filterTime = '07:00';
    component.applyFilters();
    expect(component.filteredRides.length).toBe(0);
  });

  it('should show error when booking without employeeId', () => {
    const ride = mockRides[0];
    component.employeeId = '';
    component.bookRide(ride);
    expect(component.dialogVisible).toBeTrue();
    expect(component.dialogMessage).toBe('Enter your Employee ID');
  });

  it('should book ride successfully', () => {
    const ride = mockRides[0];
    component.employeeId = 'E001';
    rideServiceSpy.bookRide.and.returnValue(true);

    component.bookRide(ride);

    expect(component.dialogVisible).toBeTrue();
    expect(component.dialogMessage).toBe('Ride booked successfully!');
    expect(rideServiceSpy.bookRide).toHaveBeenCalledWith(ride.rideId, 'E001');
  });

  it('should show error if booking fails', () => {
    const ride = mockRides[0];
    component.employeeId = 'E001';
    rideServiceSpy.bookRide.and.returnValue(false);

    component.bookRide(ride);

    expect(component.dialogVisible).toBeTrue();
    expect(component.dialogMessage).toBe(
      'Cannot book this ride. Already booked or no vacant seats left.'
    );
  });
});

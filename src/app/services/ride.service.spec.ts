import { TestBed } from '@angular/core/testing';
import { RideService } from './ride.service';
import { Ride } from '../models/ride.model';

describe('RideService', () => {
  let service: RideService;
  const storageKey = 'rides';

  const mockRide: Ride = {
    rideId: '1',
    employeeId: 'E001',
    vehicleType: 'Car',
    vehicleNo: 'KA01AB1234',
    vacantSeats: 2,
    time: '10:00',
    pickupPoint: 'A',
    destination: 'B',
    bookedEmployees: [],
  };

  beforeEach(() => {
    localStorage.clear(); // reset storage before each test
    TestBed.configureTestingModule({});
    service = TestBed.inject(RideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize storage with empty array if not present', () => {
    localStorage.removeItem(storageKey);
    new RideService(); // reinitialize
    expect(localStorage.getItem(storageKey)).toBe('[]');
  });

  it('should get rides (empty initially)', () => {
    const rides = service.getRides();
    expect(Array.isArray(rides)).toBeTrue();
    expect(rides.length).toBe(0);
  });

  it('should add a ride and retrieve it', () => {
    service.addRide(mockRide);
    const rides = service.getRides();
    expect(rides.length).toBe(1);
    expect(rides[0].rideId).toBe('1');
  });

  it('should book a ride successfully when conditions are met', () => {
    service.addRide(mockRide);
    const result = service.bookRide('1', 'E002');
    const updatedRide = service.getRides()[0];

    expect(result).toBeTrue();
    expect(updatedRide.bookedEmployees).toContain('E002');
    expect(updatedRide.vacantSeats).toBe(1);
  });

  it('should return false if ride not found', () => {
    const result = service.bookRide('999', 'E002');
    expect(result).toBeFalse();
  });

  it('should prevent employee from booking their own ride', () => {
    service.addRide(mockRide);
    const result = service.bookRide('1', 'E001');
    expect(result).toBeFalse();
  });

  it('should prevent booking the same ride twice by same employee', () => {
    service.addRide(mockRide);
    service.bookRide('1', 'E002'); // first booking
    const result = service.bookRide('1', 'E002'); // second attempt
    expect(result).toBeFalse();
  });

  it('should prevent booking when no vacant seats left', () => {
    const ride: Ride = { ...mockRide, vacantSeats: 0 };
    service.addRide(ride);
    const result = service.bookRide('1', 'E002');
    expect(result).toBeFalse();
  });
});

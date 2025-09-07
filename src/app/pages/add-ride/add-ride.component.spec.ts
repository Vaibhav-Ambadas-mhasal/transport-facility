import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AddRideComponent } from './add-ride.component';
import { RideService } from '../../services/ride.service';
import { DialogComponent } from '../../shared/dialog/dialog/dialog.component';
import { Ride } from '../../models/ride.model';

class MockRideService {
  addRide(ride: Ride) {}
}

describe('AddRideComponent', () => {
  let component: AddRideComponent;
  let fixture: ComponentFixture<AddRideComponent>;
  let rideService: MockRideService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AddRideComponent, DialogComponent],
      providers: [{ provide: RideService, useClass: MockRideService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddRideComponent);
    component = fixture.componentInstance;
    rideService = TestBed.inject(RideService) as unknown as MockRideService;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with defaults', () => {
    expect(component.rideForm.value.vehicleType).toBe('Bike');
    expect(component.rideForm.value.vacantSeats).toBe(1);
  });

  it('should mark form as touched if invalid on submit', () => {
    spyOn(component.rideForm, 'markAllAsTouched');
    component.rideForm.patchValue({ employeeId: '' });
    component.submitRide();
    expect(component.rideForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('should call RideService.addRide when form is valid', () => {
    spyOn(rideService, 'addRide');
    component.rideForm.setValue({
      employeeId: 'E001',
      vehicleType: 'Car',
      vehicleNo: 'AB1234',
      vacantSeats: 2,
      time: '10:00',
      pickupPoint: 'A',
      destination: 'B',
    });
    component.submitRide();
    expect(rideService.addRide).toHaveBeenCalled();
  });

  it('should show dialog on successful ride submission', () => {
    component.rideForm.setValue({
      employeeId: 'E002',
      vehicleType: 'Bike',
      vehicleNo: 'XYZ123',
      vacantSeats: 1,
      time: '09:30',
      pickupPoint: 'Office',
      destination: 'Station',
    });
    component.submitRide();
    expect(component.dialogVisible).toBeTrue();
    expect(component.dialogTitle).toBe('Success');
    expect(component.dialogMessage).toBe('Ride added successfully!');
  });

  it('should reset form after submission', () => {
    component.rideForm.setValue({
      employeeId: 'E003',
      vehicleType: 'Car',
      vehicleNo: 'LMN456',
      vacantSeats: 3,
      time: '14:00',
      pickupPoint: 'Mall',
      destination: 'Home',
    });
    component.submitRide();
    expect(component.rideForm.value.vehicleType).toBe('Bike');
    expect(component.rideForm.value.vacantSeats).toBe(1);
    expect(component.rideForm.value.employeeId).toBeNull();
  });

  it('should update dialogVisible when showDialog is called', () => {
    component.showDialog('Test', 'Message');
    expect(component.dialogVisible).toBeTrue();
    expect(component.dialogTitle).toBe('Test');
    expect(component.dialogMessage).toBe('Message');
  });
});

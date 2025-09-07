import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title and message', () => {
    component.title = 'Test Title';
    component.message = 'Test Message';
    component.visible = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Title');
    expect(compiled.textContent).toContain('Test Message');
  });

  it('should close dialog and emit event', () => {
    component.visible = true;
    spyOn(component.closed, 'emit');

    component.close();

    expect(component.visible).toBeFalse();
    expect(component.closed.emit).toHaveBeenCalled();
  });
});

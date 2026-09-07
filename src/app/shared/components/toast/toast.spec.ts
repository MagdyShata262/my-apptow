import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastComponent } from './toast';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    fixture.componentRef.setInput('message', 'تم الحفظ بنجاح');
    await fixture.whenStable();
    component = fixture.componentInstance;
  });

  it('should create and display the message', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('تم الحفظ بنجاح');
  });

  it('should emit when the close button is clicked', () => {
    const closed = vi.spyOn(component.closed, 'emit');

    fixture.nativeElement.querySelector('button').click();

    expect(closed).toHaveBeenCalledOnce();
  });
});

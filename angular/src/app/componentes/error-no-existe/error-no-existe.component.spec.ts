import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorNoExisteComponent } from './error-no-existe.component';

describe('ErrorNoExisteComponent', () => {
  let component: ErrorNoExisteComponent;
  let fixture: ComponentFixture<ErrorNoExisteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorNoExisteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorNoExisteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

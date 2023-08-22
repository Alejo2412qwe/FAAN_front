import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForAdopcionComponent } from './for-adopcion.component';

describe('ForAdopcionComponent', () => {
  let component: ForAdopcionComponent;
  let fixture: ComponentFixture<ForAdopcionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForAdopcionComponent]
    });
    fixture = TestBed.createComponent(ForAdopcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

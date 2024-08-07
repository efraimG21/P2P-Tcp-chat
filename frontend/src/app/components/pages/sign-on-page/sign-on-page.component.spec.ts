import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignOnPageComponent } from './sign-on-page.component';

describe('SignOnPageComponent', () => {
  let component: SignOnPageComponent;
  let fixture: ComponentFixture<SignOnPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignOnPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignOnPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

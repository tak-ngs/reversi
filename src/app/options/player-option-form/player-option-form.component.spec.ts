import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerOptionFormComponent } from './player-option-form.component';

describe('PlayerOptionFormComponent', () => {
  let component: PlayerOptionFormComponent;
  let fixture: ComponentFixture<PlayerOptionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerOptionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerOptionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

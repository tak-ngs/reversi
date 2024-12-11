import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerOptionsPageComponent } from './player-options-page.component';

describe('PlayerOptionsPageComponent', () => {
  let component: PlayerOptionsPageComponent;
  let fixture: ComponentFixture<PlayerOptionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerOptionsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerOptionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkoutService } from '../../services/workout.service';


@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
})
export class NewPage implements OnInit {

  workoutType: string = 'weight-lifting'; // Default workout type
  startTime: Date = new Date(); // Default to current time

  constructor(private router: Router, private workoutService: WorkoutService) {}

  ngOnInit() {
  }

  handleTypeChange(event: any) {    
    this.workoutType = event.detail.value;
    console.log('Workout Type:', this.workoutType);
  }

  handleStartTimeChange(event: any) {
    this.startTime = new Date(event.detail.value);
    console.log('Start Time:', this.startTime);
  }

  navigateToEditNewWorkout() {
    const workoutData = {
      workoutType: this.workoutType,
      startTime: this.startTime
      // add other fields as necessary
    };
    this.workoutService.createWorkout(workoutData).subscribe({
      next: (response) => {
        console.log('Workout created:', response);
        // Handle response, maybe navigate to another page
      },
      error: (error) => {
        console.error('Error creating workout:', error);
      }
    });

    
    this.router.navigateByUrl('/workout/edit');
  }
}

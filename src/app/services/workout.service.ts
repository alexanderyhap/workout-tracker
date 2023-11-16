import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private apiUrl = 'https://localhost:7236/api/Workout';

  constructor(private http: HttpClient) { }

  createWorkout(workoutData: any) {
    return this.http.post(this.apiUrl, workoutData);
  }

  // Add other methods as needed, like getWorkout(), updateWorkout(), etc.
}

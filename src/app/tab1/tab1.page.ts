import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  cards = Array.from({ length: 10 });

  constructor(private router: Router) {}

  navigateToNewWorkout() {
    this.router.navigateByUrl('/workout/new');
  }

  login(){
    this.router.navigateByUrl('login');
  }
}

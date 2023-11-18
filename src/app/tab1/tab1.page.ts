import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  isLoggedIn = false;
  username: string = '';
  name: string = '';

  // TODO: remove dev variables
  cards = Array.from({ length: 10 });

  constructor(private router: Router, private authService: AuthenticationService) {}

  async ngOnInit() {
    this.isLoggedIn = await this.authService.isLoggedIn();    

    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.username = currentUser.getUsername();      
    } else {
      // Handle the case when there is no current user
      this.username = ''; // or any default value
    }
  }

  navigateToNewWorkout() {
    this.router.navigateByUrl('/workout/new');
  }

  navigateToProfile() {
    this.router.navigateByUrl('/user/profile');
  }

  navigateToLogin(){
    this.router.navigateByUrl('/user/login');
  }
}

import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  passwordErrorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn().then(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/tabs/home']);
      }
    });
  }

  async signup(formValues: any) {
    this.passwordErrorMessage = ''; // Reset password error message
    const { username, email, password } = formValues;
    const loadingIndicator = await this.showLoadingIndictator();

    try {
      const result = await this.authService.signUp(username, email, password);
      this.authService.handleSignupCallback(null, result);
    } catch (e: any) {
      if (e.code === 'InvalidPasswordException') {
        this.passwordErrorMessage = 'Invalid password. ' + (e.message || 'Password did not conform with policy.');
        this.errorMessage = e.message;
      } else {
        // Handle other types of errors
        this.errorMessage = e.message;
      }
      this.authService.handleSignupCallback(e, null);
    } finally {
      loadingIndicator.dismiss();
    }
  }

  private async showLoadingIndictator() {
    const loadingIndicator = await this.loadingController.create({
      message: 'signing up...',
    });
    await loadingIndicator.present();
    return loadingIndicator;
  }

}

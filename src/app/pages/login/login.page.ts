import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  errorMessage: string = ''; // For displaying any error messages

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    console.log("hello login")
    // this.authService.isLoggedIn().then(isLoggedIn => {
    //   if (isLoggedIn) {
    //     this.router.navigate(['/dashboard']); // Or any other page
    //   }
    // });
  }

  //(click)="login()"
  async login(username: string, password: string) {
    const loadingIndicator = await this.showLoadingIndictator();
    try {
      const result = await this.authService.login(username, password);
      this.authService.handleLoginCallback(null, result);
    } catch (e: any) {
      this.errorMessage = e.message;
      this.authService.handleLoginCallback(e, null);
    } finally {
      loadingIndicator.dismiss();
    }
  }

  private async showLoadingIndictator() {
    const loadingIndicator = await this.loadingController.create({
      message: 'Opening login window...',
    });
    await loadingIndicator.present();
    return loadingIndicator;
  }
}

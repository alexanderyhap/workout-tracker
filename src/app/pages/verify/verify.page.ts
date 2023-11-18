import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit {  
  username: string | null = null;
  verificationCode: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthenticationService, 
    private loadingController: LoadingController, 
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username');
    });
  }

  async verifyAccount(formValues: any) {
    const { verificationCode } = formValues;
    const loadingIndicator = await this.showLoadingIndictator();

    try {
      if (this.username === null) {
        // TODO: add username field??
        throw new Error("username is null"); // Handle the null case appropriately
      }

      await this.authService.verifyEmail(this.username, verificationCode);
      
      // Inform user of successful verification and redirect or enable login
      this.router.navigate(['/tabs/home']);

    } catch (e: any) {
      // Handle verification errors
      this.errorMessage = e.message;
    } finally {
      loadingIndicator.dismiss();
    }
  }

  async resendCode() {
    // Logic to resend the verification code
    console.log('resendcode click');

    const loadingIndicator = await this.showLoadingIndictator();

    try {
      if (this.username === null) {
        throw new Error("username is null"); // Handle the null case appropriately
      }

      await this.authService.resendVerificationCode(this.username);

      const alert = await this.alertController.create({
        message: 'verification code sent!',
        buttons: ['Ok'],
      });
  
      await alert.present();

    } catch (e: any) {
      // Handle verification errors
      this.errorMessage = e.message;
    } finally {
      loadingIndicator.dismiss();
    }
  }

  private async showLoadingIndictator() {
    const loadingIndicator = await this.loadingController.create({
      message: 'verifying...',
    });
    await loadingIndicator.present();
    return loadingIndicator;
  }
  
}

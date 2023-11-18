import { Injectable } from '@angular/core';
import { 
  CognitoUserPool, 
  CognitoUser, 
  CognitoUserAttribute, 
  AuthenticationDetails,
  CognitoUserSession, 
  ISignUpResult } from 'amazon-cognito-identity-js';
import { CognitoConfigService } from './cognito-config.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userPool: CognitoUserPool;
  private currentUser: CognitoUser | null = null;

  constructor(private cognitoConfigService: CognitoConfigService, private router: Router) {
    const cognitoConfig = this.cognitoConfigService.getCognitoConfig();
    this.userPool = new CognitoUserPool({
      UserPoolId: cognitoConfig.UserPoolId,
      ClientId: cognitoConfig.ClientId,
    });
  }

  login(username: string, password: string): Promise<CognitoUser | any> {
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const userData = {
      Username: username,
      Pool: this.userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session) => resolve(session),
        onFailure: (err) => reject(err),
        newPasswordRequired: (userAttributes, requiredAttributes) => resolve({ userAttributes, requiredAttributes }),
        // Add other callbacks as necessary
      });
    });
  }

  logout(): void {
    if (this.currentUser) {
      this.currentUser.signOut();
      this.currentUser = null;

      this.router.navigate(['/tabs/home']);
    }
  }

  signUp(username: string, email: string, password: string): Promise<any> {
    const attributeList: CognitoUserAttribute[] = [];
    const validationData: CognitoUserAttribute[] = [];
  
    const emailAttribute = {
      Name: 'email',
      Value: email
    };
    attributeList.push(new CognitoUserAttribute(emailAttribute));

    return new Promise((resolve, reject) => {
      this.userPool.signUp(username, password, attributeList, validationData, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  handleSignupCallback(err: any, result?: CognitoUserSession | ISignUpResult | null): void {
    if (err) {
      console.error('sign up error:', err);
      // Handle the error, e.g., show an error message to the user
      return;
    }

    if (result && (result as ISignUpResult).user) {
      const signUpResult = result as ISignUpResult;
      console.log('signup successful, user:', signUpResult.user);

      // Set the current user
      this.currentUser = signUpResult.user;

      // Navigate to the verification page with the username
      this.router.navigate(['/user/verify', signUpResult.user.getUsername()]);
    }
  }

  handleLoginCallback(err: any, result?: CognitoUserSession | ISignUpResult | null): void {
    if (err) {
      console.error('Login error:', err);
      // Handle the error, e.g., show an error message to the user
      return;
    }

    if (result instanceof CognitoUserSession) {
      console.log('login successful, session:', result);

      // Here you can set the session information, such as tokens, in a client-side storage
      // Retrieve the current user from the user pool
      const user = this.userPool.getCurrentUser();
      if (user) {
        this.currentUser = user; // Set the currentUser
      }

      this.router.navigate(['/tabs/home']);
    }

    // Additional handling if needed, for example, handling sign-up results
  }

  verifyEmail(username: string, code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let userToVerify;

      if (this.currentUser) {
        userToVerify = this.currentUser;
      } else if (username) {
        const userData = {
          Username: username,
          Pool: this.userPool
        };
        userToVerify = new CognitoUser(userData);
      } else {
        reject(new Error('No username provided and no current user'));
        return;
      }   
  
      userToVerify.confirmRegistration(code, true, (err: any, result: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result); // The result will indicate the confirmation is successful
      });
    });
  }

  resendVerificationCode(username: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const userData = {
        Username: username,
        Pool: this.userPool
      };
  
      const cognitoUser = new CognitoUser(userData);
  
      cognitoUser.resendConfirmationCode((err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  isLoggedIn(): Promise<boolean> {
    console.log('isLoggedIn?');
    const currentUser = this.userPool.getCurrentUser();

    if (currentUser === null) {
      console.log('currentUser is null');
      return Promise.resolve(false);
    }

    return new Promise((resolve) => {
      currentUser.getSession((err: any, session: CognitoUserSession) => {
        if (err) {
          resolve(false);
        } else {
          resolve(session.isValid());
        }
      });
    });
  }

  getCurrentUser(): CognitoUser | null {
    return this.userPool.getCurrentUser();
  }

}

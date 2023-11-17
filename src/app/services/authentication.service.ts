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
    }
  }

  signUp(username: string, password: string, attributes: any[]): Promise<any> {
    const attributeList: CognitoUserAttribute[] = [];
    const validationData: CognitoUserAttribute[] = [];

    attributes.forEach(attr => {
      attributeList.push(new CognitoUserAttribute(attr));
    });

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

  handleLoginCallback(err: any, result?: CognitoUserSession | ISignUpResult | null): void {
    if (err) {
      console.error('Login error:', err);
      // Handle the error, e.g., show an error message to the user
      return;
    }

    if (result instanceof CognitoUserSession) {
      console.log('Login successful, session:', result);
      // Here you can set the session information, such as tokens, in a client-side storage
      // Navigate to a different page upon successful login
      this.router.navigate(['/dashboard']); // Replace '/dashboard' with the route you want to navigate to
    }

    // Additional handling if needed, for example, handling sign-up results
  }

  isLoggedIn(): Promise<boolean> {
    const currentUser = this.userPool.getCurrentUser();

    if (currentUser === null) {
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
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CognitoConfigService {

  constructor() { }

  getCognitoConfig() {
    return {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId,
      region: environment.cognitoRegion
    };
  }
}

import { TestBed } from '@angular/core/testing';

import { CognitoConfigService } from './cognito-config.service';

describe('CognitoConfigService', () => {
  let service: CognitoConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CognitoConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationInterface } from './api-configuration';

import { AccountResourceService } from './services/account-resource.service';
import { AuthInfoResourceService } from './services/auth-info-resource.service';
import { CommandResourceService } from './services/command-resource.service';
import { GatewayResourceService } from './services/gateway-resource.service';
import { LogoutResourceService } from './services/logout-resource.service';
import { QueryResourceService } from './services/query-resource.service';
import { UserResourceService } from './services/user-resource.service';

/**
 * Provider for all Api services, plus ApiConfiguration
 */
@NgModule({
  imports: [
    HttpClientModule
  ],
  exports: [
    HttpClientModule
  ],
  declarations: [],
  providers: [
    ApiConfiguration,
    AccountResourceService,
    AuthInfoResourceService,
    CommandResourceService,
    GatewayResourceService,
    LogoutResourceService,
    QueryResourceService,
    UserResourceService
  ],
})
export class ApiModule {
  static forRoot(customParams: ApiConfigurationInterface): ModuleWithProviders {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: ApiConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}

import { AppServiceStub } from './app.service.stub';
import { RouterStub } from './router.stub';
import { ActivatedRouteStub } from './activated-route.stub';
import { AlertServiceStub } from './alert.service.stub';

export class MasterServiceStub {
  appServiceStub = new AppServiceStub();
  routerStub = new RouterStub();
  activatedRouteStub = new ActivatedRouteStub();
  alertServiceStub = new AlertServiceStub();
}

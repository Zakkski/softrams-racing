import { AppServiceStub } from './app.service.stub';
import { RouterStub } from './router.stub';
import { ActivatedRouteStub } from './activated-route.stub';

export class MasterServiceStub {
  appServiceStub = new AppServiceStub();
  routerStub = new RouterStub();
  activatedRouteStub = new ActivatedRouteStub();
}

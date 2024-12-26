import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { InitService } from './core/services/init.service';
import { finalize, Observable } from 'rxjs';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { Cart } from './shared/models/cart';
import { User } from './shared/models/user';

function initializeApp(initService: InitService): () => Observable<{ cart: Cart | null; user: User; }> {
  // return () => lastValueFrom(initService.init()).finally(() => {
  //   const splash = document.getElementById('initial-splash');
  //   if (splash) {
  //     splash.remove();
  //   }
  // })
  return () => initService.init().pipe(finalize(() => {
    const splash = document.getElementById('initial-splash');
    if (splash) {
      splash.remove();
    }
  }))
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    // -----------------------------------------
    provideHttpClient(withInterceptors([
      errorInterceptor,
      loadingInterceptor,
      authInterceptor
    ])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [InitService],
    }
  ]
};

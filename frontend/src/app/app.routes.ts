import { Routes } from '@angular/router';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { authGuard } from './core/guards/auth.guard';

import { EcommerceComponent } from './pages/dashboard/ecommerce/ecommerce.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';

export const routes: Routes = [
  { path: '', redirectTo: 'app', pathMatch: 'full' },

  // AUTH (libre)
  {
    path: 'auth',
    children: [
      { path: 'signin', component: SignInComponent, title: 'Iniciar sesión | SancochoLab' },
      { path: 'signup', component: SignUpComponent, title: 'Crear cuenta | SancochoLab' },
    ],
  },

  // APP (protegida)
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: EcommerceComponent, title: 'Dashboard | SancochoLab' },

      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/pages/products-page.component').then(m => m.ProductsPageComponent),
        title: 'Productos | SancochoLab',
      },
      {
        path: 'quotations',
        loadComponent: () =>
          import('./features/quotations/pages/quotations-page.component').then(m => m.QuotationsPageComponent),
        title: 'Cotizaciones | SancochoLab',
      },
      {
        path: 'recipes',
        canActivate: [authGuard],
        loadChildren: () => import('./features/recipes/recipes.routes').then(m => m.RECIPES_ROUTES),
      },
      {
        path: 'ollas',
        canActivate: [authGuard],
        loadChildren: () => import('./features/ollas/ollas.routes').then(m => m.OLLAS_ROUTES),
      },
    ],
  },

  { path: '**', component: NotFoundComponent, title: '404 | SancochoLab' },
];

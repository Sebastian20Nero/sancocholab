import { Routes } from '@angular/router';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { authGuard } from './core/guards/auth.guard';

// demo components (los tuyos)
import { EcommerceComponent } from './pages/dashboard/ecommerce/ecommerce.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormElementsComponent } from './pages/forms/form-elements/form-elements.component';
import { BasicTablesComponent } from './pages/tables/basic-tables/basic-tables.component';
import { BlankComponent } from './pages/blank/blank.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { LineChartComponent } from './pages/charts/line-chart/line-chart.component';
import { BarChartComponent } from './pages/charts/bar-chart/bar-chart.component';
import { AlertsComponent } from './pages/ui-elements/alerts/alerts.component';
import { AvatarElementComponent } from './pages/ui-elements/avatar-element/avatar-element.component';
import { BadgesComponent } from './pages/ui-elements/badges/badges.component';
import { ButtonsComponent } from './pages/ui-elements/buttons/buttons.component';
import { ImagesComponent } from './pages/ui-elements/images/images.component';
import { VideosComponent } from './pages/ui-elements/videos/videos.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { CalenderComponent } from './pages/calender/calender.component';

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

      // DEMO: los dejo en /app/demo/...
      { path: 'demo/calendar', component: CalenderComponent },
      { path: 'demo/profile', component: ProfileComponent },
      { path: 'demo/form-elements', component: FormElementsComponent },
      { path: 'demo/basic-tables', component: BasicTablesComponent },
      { path: 'demo/blank', component: BlankComponent },
      { path: 'demo/invoice', component: InvoicesComponent },
      { path: 'demo/line-chart', component: LineChartComponent },
      { path: 'demo/bar-chart', component: BarChartComponent },
      { path: 'demo/alerts', component: AlertsComponent },
      { path: 'demo/avatars', component: AvatarElementComponent },
      { path: 'demo/badge', component: BadgesComponent },
      { path: 'demo/buttons', component: ButtonsComponent },
      { path: 'demo/images', component: ImagesComponent },
      { path: 'demo/videos', component: VideosComponent },
    ],
  },

  { path: '**', component: NotFoundComponent, title: '404 | SancochoLab' },
];

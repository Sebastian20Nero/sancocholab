import { Routes } from '@angular/router';

export const OLLAS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/ollas-page').then(m => m.OllasPage),
        title: 'Ollas | SancochoLab',
    },
];

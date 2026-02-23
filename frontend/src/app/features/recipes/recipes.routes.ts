// src/app/features/recipes/recipes.routes.ts
import { Routes } from '@angular/router';
import { RecipesListPage } from './pages/recipes-list.page';
import { RecipeCreatePage } from './pages/recipe-create.page';
import { RecipeDetailPage } from './pages/recipe-detail.page';

export const RECIPES_ROUTES: Routes = [
  { path: '', component: RecipesListPage },
  { path: 'new', component: RecipeCreatePage },
  { path: ':id', component: RecipeDetailPage },
];

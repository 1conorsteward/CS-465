// src/app/storage.ts

import { InjectionToken } from '@angular/core';

// Create an InjectionToken for localStorage access
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage // Set the factory to return localStorage
});

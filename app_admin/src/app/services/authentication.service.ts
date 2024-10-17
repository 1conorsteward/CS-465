// src/app/services/authentication.service.ts

import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage'; // Import the BROWSER_STORAGE InjectionToken
import { User } from '../models/user'; // Import User model
import { AuthResponse } from '../models/authresponse'; // Import AuthResponse model
import { TripDataService } from '../services/trip-data.service'; // Import TripDataService

@Injectable({
  providedIn: 'root' // The service will be provided at the root level
})
export class AuthenticationService {
  
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage, // Inject the browser's localStorage
    private tripDataService: TripDataService // Inject TripDataService for handling login/register
  ) { }

  // Get the token from localStorage
  public getToken(): string {
    return this.storage.getItem('travlr-token');
  }

  // Save the token to localStorage
  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  // Login a user and save the token
  public login(user: User): Promise<any> {
    return this.tripDataService.login(user)
      .then((authResp: AuthResponse) =>
        this.saveToken(authResp.token)
      );
  }

  // Register a new user and save the token
  public register(user: User): Promise<any> {
    return this.tripDataService.register(user)
      .then((authResp: AuthResponse) =>
        this.saveToken(authResp.token)
      );
  }

  // Logout the user by removing the token
  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  // Check if the user is logged in by validating the token's expiration
  public isLoggedIn(): boolean {
    const token: string = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload
      return payload.exp > (Date.now() / 1000); // Check if the token is still valid
    } else {
      return false; // No token means not logged in
    }
  }

  // Get the currently logged-in user's information
  public getCurrentUser(): User {
    if (this.isLoggedIn()) {
      const token: string = this.getToken();
      const { email, name } = JSON.parse(atob(token.split('.')[1])); // Decode token to get user info
      return { email, name } as User; // Return a User object
    }
  }
}

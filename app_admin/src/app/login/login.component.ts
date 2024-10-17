import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public formError: string = '';
  
  // Credentials for the login form
  public credentials: User = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  // Lifecycle hook that runs when the component is initialized
  ngOnInit(): void {}

  // Handler for form submission
  public onLoginSubmit(): void {
    this.formError = '';

    // Validate if email and password are entered
    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'All fields are required, please try again';
    } else {
      this.doLogin();
    }
  }

  // Private method to execute the login process
  private doLogin(): void {
    this.authenticationService.login(this.credentials)
      .then(() => {
        // Navigate to the appropriate route after successful login
        this.router.navigateByUrl('/listtrips');  // Change '#" to '/listtrips' or the correct route
      })
      .catch((message: string) => {
        // Display the error message if login fails
        this.formError = message;
      });
  }
}

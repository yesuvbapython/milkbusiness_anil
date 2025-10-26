import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="logo">
          <h1>🥛 SHREE NIMISHAMBA ENTERPRISES</h1>
          <p>Milk Business Management System</p>
        </div>
        
        <div class="auth-tabs">
          <button [class.active]="authMode === 'login'" (click)="authMode = 'login'">Login</button>
          <button [class.active]="authMode === 'register'" (click)="authMode = 'register'">Register</button>
          <button [class.active]="authMode === 'reset'" (click)="authMode = 'reset'">Reset Password</button>
        </div>

        <!-- Login Form -->
        <form *ngIf="authMode === 'login'" (ngSubmit)="login()" class="auth-form">
          <div class="form-group">
            <label>👤 Username</label>
            <input type="text" [(ngModel)]="username" name="username" required>
          </div>
          <div class="form-group">
            <label>🔒 Password</label>
            <input type="password" [(ngModel)]="password" name="password" required>
          </div>
          <button type="submit" class="auth-btn">🔑 Login</button>
        </form>

        <!-- Register Form -->
        <form *ngIf="authMode === 'register'" (ngSubmit)="register()" class="auth-form">
          <div class="form-group">
            <label>👤 Username</label>
            <input type="text" [(ngModel)]="username" name="username" required>
          </div>
          <div class="form-group">
            <label>📧 Email</label>
            <input type="email" [(ngModel)]="email" name="email" required>
          </div>
          <div class="form-group">
            <label>🔒 Password</label>
            <input type="password" [(ngModel)]="password" name="password" required>
          </div>
          <button type="submit" class="auth-btn">📝 Register</button>
        </form>

        <!-- Reset Password Form -->
        <form *ngIf="authMode === 'reset'" (ngSubmit)="resetPassword()" class="auth-form">
          <div class="form-group">
            <label>📧 Email</label>
            <input type="email" [(ngModel)]="email" name="email" required>
          </div>
          <button type="submit" class="auth-btn">🔄 Reset Password</button>
        </form>

        <div *ngIf="message" class="message" [class.error]="isError">{{message}}</div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .auth-card {
      background: white;
      padding: 40px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      width: 100%;
      max-width: 400px;
    }
    
    .logo {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .logo h1 {
      color: #667eea;
      margin: 0;
      font-size: 1.8em;
    }
    
    .logo p {
      color: #666;
      margin: 10px 0 0 0;
    }
    
    .auth-tabs {
      display: flex;
      margin-bottom: 30px;
      border-bottom: 1px solid #eee;
    }
    
    .auth-tabs button {
      flex: 1;
      padding: 10px;
      border: none;
      background: none;
      cursor: pointer;
      color: #666;
      border-bottom: 2px solid transparent;
    }
    
    .auth-tabs button.active {
      color: #667eea;
      border-bottom-color: #667eea;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #333;
    }
    
    .form-group input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 16px;
      box-sizing: border-box;
    }
    
    .auth-btn {
      width: 100%;
      padding: 15px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.3s;
    }
    
    .auth-btn:hover {
      background: #5a6fd8;
    }
    
    .message {
      margin-top: 15px;
      padding: 10px;
      border-radius: 5px;
      text-align: center;
      background: #d4edda;
      color: #155724;
    }
    
    .message.error {
      background: #f8d7da;
      color: #721c24;
    }
  `]
})
export class LoginComponent {
  authMode: 'login' | 'register' | 'reset' = 'login';
  username = '';
  email = '';
  password = '';
  message = '';
  isError = false;

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.authService.setToken(response.token);
        this.showMessage('Login successful!', false);
        window.location.reload();
      },
      error: () => {
        this.showMessage('Invalid credentials', true);
      }
    });
  }

  register() {
    this.authService.register(this.username, this.email, this.password).subscribe({
      next: () => {
        this.showMessage('Registration successful! Please login.', false);
        this.authMode = 'login';
      },
      error: () => {
        this.showMessage('Registration failed', true);
      }
    });
  }

  resetPassword() {
    this.authService.resetPassword(this.email).subscribe({
      next: () => {
        this.showMessage('Password reset email sent!', false);
      },
      error: () => {
        this.showMessage('Reset failed', true);
      }
    });
  }

  showMessage(msg: string, error: boolean) {
    this.message = msg;
    this.isError = error;
    setTimeout(() => this.message = '', 3000);
  }
}
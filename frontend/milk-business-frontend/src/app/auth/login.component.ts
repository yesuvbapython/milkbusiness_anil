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
      <div class="floating-shapes">
        <div class="shape shape1"></div>
        <div class="shape shape2"></div>
        <div class="shape shape3"></div>
      </div>
      
      <div class="auth-card">
        <div class="logo">
          <div class="logo-icon">🥛</div>
          <h1>SHREE NIMISHAMBA ENTERPRISES</h1>
          <p>Premium Milk Business Management System</p>
          <div class="divider"></div>
        </div>
        
        <div class="auth-tabs">
          <button [class.active]="authMode === 'login'" (click)="authMode = 'login'">
            <span class="tab-icon">🔑</span> Login
          </button>
          <button [class.active]="authMode === 'register'" (click)="authMode = 'register'">
            <span class="tab-icon">📝</span> Register
          </button>
          <button [class.active]="authMode === 'reset'" (click)="authMode = 'reset'">
            <span class="tab-icon">🔄</span> Reset
          </button>
        </div>

        <!-- Login Form -->
        <form *ngIf="authMode === 'login'" (ngSubmit)="login()" class="auth-form">
          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input type="text" [(ngModel)]="username" name="username" placeholder="Enter username" required>
            </div>
          </div>
          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input type="password" [(ngModel)]="password" name="password" placeholder="Enter password" required>
            </div>
          </div>
          <button type="submit" class="auth-btn login-btn">
            <span class="btn-icon">🔑</span>
            <span>Login to Dashboard</span>
          </button>
          <div class="demo-credentials">
            <small>Demo: admin / admin</small>
          </div>
        </form>

        <!-- Register Form -->
        <form *ngIf="authMode === 'register'" (ngSubmit)="register()" class="auth-form">
          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input type="text" [(ngModel)]="username" name="username" placeholder="Choose username" required>
            </div>
          </div>
          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">📧</span>
              <input type="email" [(ngModel)]="email" name="email" placeholder="Enter email address" required>
            </div>
          </div>
          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input type="password" [(ngModel)]="password" name="password" placeholder="Create password" required>
            </div>
          </div>
          <button type="submit" class="auth-btn register-btn">
            <span class="btn-icon">📝</span>
            <span>Create Account</span>
          </button>
        </form>

        <!-- Reset Password Form -->
        <form *ngIf="authMode === 'reset'" (ngSubmit)="resetPassword()" class="auth-form">
          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">📧</span>
              <input type="email" [(ngModel)]="email" name="email" placeholder="Enter your email" required>
            </div>
          </div>
          <button type="submit" class="auth-btn reset-btn">
            <span class="btn-icon">🔄</span>
            <span>Send Reset Link</span>
          </button>
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%, #f093fb 100%);
      padding: 20px;
      position: relative;
      overflow: hidden;
    }
    
    .floating-shapes {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 1;
    }
    
    .shape {
      position: absolute;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      animation: float 6s ease-in-out infinite;
    }
    
    .shape1 {
      width: 80px;
      height: 80px;
      top: 20%;
      left: 10%;
      animation-delay: 0s;
    }
    
    .shape2 {
      width: 120px;
      height: 120px;
      top: 60%;
      right: 10%;
      animation-delay: 2s;
    }
    
    .shape3 {
      width: 60px;
      height: 60px;
      bottom: 20%;
      left: 20%;
      animation-delay: 4s;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }
    
    .auth-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 50px;
      border-radius: 25px;
      box-shadow: 0 25px 50px rgba(0,0,0,0.15);
      width: 100%;
      max-width: 450px;
      position: relative;
      z-index: 2;
      border: 1px solid rgba(255, 255, 255, 0.2);
      animation: slideUp 0.8s ease-out;
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .logo {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .logo-icon {
      font-size: 4em;
      margin-bottom: 15px;
      animation: bounce 2s infinite;
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
      60% { transform: translateY(-5px); }
    }
    
    .logo h1 {
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
      font-size: 1.6em;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    
    .logo p {
      color: #666;
      margin: 10px 0 0 0;
      font-size: 0.9em;
      opacity: 0.8;
    }
    
    .divider {
      width: 60px;
      height: 3px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      margin: 20px auto;
      border-radius: 2px;
    }
    
    .auth-tabs {
      display: flex;
      margin-bottom: 35px;
      background: #f8f9fa;
      border-radius: 12px;
      padding: 5px;
      position: relative;
    }
    
    .auth-tabs button {
      flex: 1;
      padding: 12px 8px;
      border: none;
      background: none;
      cursor: pointer;
      color: #666;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-size: 0.85em;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }
    
    .auth-tabs button:hover {
      color: #667eea;
      background: rgba(102, 126, 234, 0.1);
    }
    
    .auth-tabs button.active {
      color: white;
      background: linear-gradient(135deg, #667eea, #764ba2);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    
    .tab-icon {
      font-size: 1.1em;
    }
    
    .form-group {
      margin-bottom: 25px;
    }
    
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    
    .input-icon {
      position: absolute;
      left: 15px;
      font-size: 1.2em;
      color: #667eea;
      z-index: 1;
    }
    
    .form-group input {
      width: 100%;
      padding: 15px 15px 15px 50px;
      border: 2px solid #e1e5e9;
      border-radius: 12px;
      font-size: 16px;
      box-sizing: border-box;
      transition: all 0.3s ease;
      background: #fafbfc;
    }
    
    .form-group input:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      transform: translateY(-1px);
    }
    
    .form-group input::placeholder {
      color: #a0a6b1;
    }
    
    .auth-btn {
      width: 100%;
      padding: 16px;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-top: 10px;
      position: relative;
      overflow: hidden;
    }
    
    .login-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
    
    .register-btn {
      background: linear-gradient(135deg, #11998e, #38ef7d);
      color: white;
      box-shadow: 0 8px 25px rgba(17, 153, 142, 0.3);
    }
    
    .reset-btn {
      background: linear-gradient(135deg, #ff6b6b, #ffa726);
      color: white;
      box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
    }
    
    .auth-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
    }
    
    .auth-btn:active {
      transform: translateY(0);
    }
    
    .btn-icon {
      font-size: 1.2em;
    }
    
    .demo-credentials {
      text-align: center;
      margin-top: 15px;
      padding: 10px;
      background: rgba(102, 126, 234, 0.1);
      border-radius: 8px;
      color: #667eea;
      font-weight: 500;
    }
    
    .message {
      margin-top: 20px;
      padding: 15px;
      border-radius: 12px;
      text-align: center;
      font-weight: 500;
      animation: slideIn 0.3s ease;
      border-left: 4px solid;
    }
    
    .message:not(.error) {
      background: linear-gradient(135deg, #d4edda, #c3e6cb);
      color: #155724;
      border-left-color: #28a745;
    }
    
    .message.error {
      background: linear-gradient(135deg, #f8d7da, #f5c6cb);
      color: #721c24;
      border-left-color: #dc3545;
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-10px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
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
    // Simple authentication for admin/admin
    if (this.username === 'admin' && this.password === 'admin') {
      this.authService.setToken('dummy-token');
      this.showMessage('Login successful!', false);
      window.location.reload();
    } else {
      this.showMessage('Invalid credentials. Use admin/admin', true);
    }
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
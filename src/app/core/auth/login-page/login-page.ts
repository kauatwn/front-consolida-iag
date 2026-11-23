import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LucideEye,
  LucideEyeOff,
  LucideLoader,
  LucideLock,
  LucideLogIn,
  LucideMail,
  LucideUtensils,
} from '@lucide/angular';
import { Auth } from '../auth';
import { UserSession } from '../user-session';

@Component({
  selector: 'app-login-page',
  imports: [
    FormsModule,
    LucideMail,
    LucideLock,
    LucideEye,
    LucideEyeOff,
    LucideLogIn,
    LucideLoader,
    LucideUtensils,
  ],
  host: {
    class: 'block min-h-screen w-full bg-surface',
  },
  template: `
    <div class="flex min-h-screen flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <!-- Brand Header -->
        <div class="flex flex-col items-center text-center">
          <div
            class="bg-primary text-on-primary mb-4 flex size-14 items-center justify-center rounded-2xl shadow-lg"
          >
            <svg lucideUtensils [size]="28" aria-hidden="true"></svg>
          </div>
          <h1 class="font-headline-md text-primary text-3xl font-bold tracking-tight">
            Consolida IAG
          </h1>
          <p class="text-on-surface-variant mt-2 text-sm">
            Instituto Anchieta Grajaú &bull; Totem de Pedidos e Compras
          </p>
        </div>

        <!-- Login Card -->
        <div
          class="bg-surface-container-lowest ring-outline-variant/30 mt-8 rounded-2xl p-6 shadow-xl ring-1 sm:p-8"
        >
          <div
            class="border-outline-variant/30 mb-6 flex items-center justify-between border-b pb-4"
          >
            <div>
              <h2 class="text-on-surface text-lg font-bold">Acesso ao Sistema</h2>
              <p class="text-on-surface-variant text-xs">
                Entre com seu e-mail institucional e senha
              </p>
            </div>
          </div>

          <!-- Error Feedback -->
          @if (errorMessage()) {
            <div
              role="alert"
              class="bg-error-container text-on-error-container mb-4 flex items-center rounded-xl p-3 text-xs font-semibold"
            >
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <!-- Form -->
          <form (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
            <!-- Email -->
            <div class="flex flex-col gap-1.5">
              <label for="login-email" class="text-on-surface text-xs font-semibold">
                E-mail Institucional
              </label>
              <div class="relative flex items-center">
                <span class="text-on-surface-variant pointer-events-none absolute left-3">
                  <svg lucideMail [size]="18" aria-hidden="true"></svg>
                </span>
                <input
                  id="login-email"
                  type="email"
                  required
                  [(ngModel)]="email"
                  name="email"
                  placeholder="lider.cei@anchieta.org.br"
                  class="bg-surface-container-low text-on-surface focus:border-secondary focus:ring-secondary/40 w-full rounded-xl border border-transparent py-2.5 pr-3 pl-10 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="flex flex-col gap-1.5">
              <label for="login-password" class="text-on-surface text-xs font-semibold">
                Senha
              </label>
              <div class="relative flex items-center">
                <span class="text-on-surface-variant pointer-events-none absolute left-3">
                  <svg lucideLock [size]="18" aria-hidden="true"></svg>
                </span>
                <input
                  id="login-password"
                  [type]="showPassword() ? 'text' : 'password'"
                  required
                  [(ngModel)]="password"
                  name="password"
                  placeholder="••••••••"
                  class="bg-surface-container-low text-on-surface focus:border-secondary focus:ring-secondary/40 w-full rounded-xl border border-transparent py-2.5 pr-10 pl-10 text-sm focus:ring-2 focus:outline-none"
                />
                <button
                  type="button"
                  (click)="showPassword.set(!showPassword())"
                  aria-label="Alternar visibilidade da senha"
                  class="text-on-surface-variant hover:text-on-surface absolute right-3 flex cursor-pointer items-center justify-center"
                >
                  @if (showPassword()) {
                    <svg lucideEyeOff [size]="18" aria-hidden="true"></svg>
                  } @else {
                    <svg lucideEye [size]="18" aria-hidden="true"></svg>
                  }
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="isLoading()"
              class="bg-primary text-on-primary hover:bg-primary/95 mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold shadow-md transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              @if (isLoading()) {
                <svg lucideLoader [size]="18" class="animate-spin" aria-hidden="true"></svg>
                <span>Autenticando...</span>
              } @else {
                <svg lucideLogIn [size]="18" aria-hidden="true"></svg>
                <span>Entrar</span>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class LoginPage {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected email = '';
  protected password = '';
  protected readonly showPassword = signal(false);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected onSubmit(): void {
    if (!this.email.trim() || !this.password) {
      this.errorMessage.set('Por favor, informe seu e-mail e senha.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.auth.login(this.email, this.password).subscribe({
      next: (session: UserSession) => {
        this.isLoading.set(false);
        this.redirectAfterLogin(session);
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message || 'Falha na autenticação.');
      },
    });
  }

  private redirectAfterLogin(session: UserSession): void {
    if (session.role === 'BUYER') {
      this.router.navigate(['/consolidacao']);
      return;
    }

    if (session.role === 'KITCHEN_LEADER' && session.serviceCode) {
      this.router.navigate(['/pedido', session.serviceCode.toLowerCase()]);
    }
  }
}

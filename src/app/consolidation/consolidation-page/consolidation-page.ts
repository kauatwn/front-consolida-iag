import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../core/auth/auth';

@Component({
  imports: [],
  selector: 'app-consolidation-page',
  styles: ``,
  template: `
    <main class="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 p-8">
      <header class="border-outline-variant/40 flex items-center justify-between border-b pb-4">
        <div>
          <h1 class="text-primary text-2xl font-bold">Consolidação de Compras</h1>
          <p class="text-on-surface-variant text-sm">
            Conectada como: <strong>{{ auth.userName() }}</strong>
          </p>
        </div>

        <button
          type="button"
          (click)="logout()"
          class="bg-surface-container-high text-on-surface hover:bg-surface-container-highest cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
        >
          Sair
        </button>
      </header>

      <section class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
        <p class="text-on-surface text-base">
          Hello World — Área exclusiva da Gestora (<code>BUYER</code>).
        </p>
      </section>
    </main>
  `,
})
export class ConsolidationPage {
  protected readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected async logout(): Promise<void> {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}

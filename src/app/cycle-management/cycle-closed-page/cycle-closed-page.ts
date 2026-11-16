import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LucideInfo, LucideLock, LucideRefreshCw } from '@lucide/angular';
import { CycleStatus } from '../cycle.model';
import { CycleService } from '../cycle.service';

@Component({
  selector: 'app-cycle-closed-page',
  imports: [LucideLock, LucideInfo, LucideRefreshCw],
  host: {
    class: 'block min-h-screen w-full',
  },
  template: `
    <div class="bg-surface font-body-md text-on-surface flex min-h-screen flex-col">
      <main class="px-gutter-mobile flex flex-1 items-center justify-center py-12">
        <div
          class="bg-surface-container-lowest p-space-lg flex w-full max-w-md flex-col items-center rounded-2xl text-center shadow-md"
        >
          <!-- Icon Container -->
          <div
            class="mb-space-md bg-error-container text-error flex size-20 shrink-0 items-center justify-center rounded-full"
          >
            <svg lucideLock [size]="36" [strokeWidth]="2.2" aria-hidden="true"></svg>
          </div>

          <span class="font-caption text-caption text-error font-bold tracking-wider uppercase">
            Acesso Bloqueado
          </span>

          <h1 class="mt-space-xs font-headline-md text-headline-md text-primary font-bold">
            Ciclo Semanal Encerrado
          </h1>

          <p class="mt-space-sm text-body-md text-on-surface-variant">
            O ciclo de compras desta semana foi encerrado. Novos pedidos e alterações não são
            permitidos até a abertura do próximo ciclo pelo setor de compras.
          </p>

          <div class="mt-space-md bg-surface-container-low p-space-sm w-full rounded-xl text-left">
            <div class="flex items-start gap-2">
              <svg
                lucideInfo
                [size]="20"
                class="text-primary mt-0.5 shrink-0"
                aria-hidden="true"
              ></svg>
              <div class="text-caption text-on-surface-variant">
                <strong class="text-on-surface">O que fazer agora?</strong>
                <p class="mt-0.5">
                  Caso sua cozinha tenha uma emergência operacional não atendida, procure
                  diretamente o gestor de compras da instituição.
                </p>
              </div>
            </div>
          </div>

          @if (checkMessage()) {
            <div
              role="status"
              class="mt-space-md bg-surface-container-high p-space-sm font-caption text-caption text-on-surface w-full rounded-lg"
            >
              {{ checkMessage() }}
            </div>
          }

          <button
            type="button"
            (click)="checkCycleAgain()"
            [disabled]="isChecking()"
            class="mt-space-lg bg-primary px-space-md font-headline-md text-body-md text-on-primary flex min-h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-xl font-bold shadow-md transition-transform active:scale-95 disabled:opacity-50"
          >
            <svg
              lucideRefreshCw
              [size]="20"
              [class.animate-spin]="isChecking()"
              aria-hidden="true"
            ></svg>
            <span>{{ isChecking() ? 'Verificando...' : 'Verificar se o Ciclo Abriu' }}</span>
          </button>
        </div>
      </main>
    </div>
  `,
})
export class CycleClosedPage {
  private readonly router = inject(Router);
  private readonly cycleService = inject(CycleService);

  protected readonly isChecking = signal<boolean>(false);
  protected readonly checkMessage = signal<string | null>(null);

  protected checkCycleAgain(): void {
    this.isChecking.set(true);
    this.checkMessage.set(null);

    this.cycleService.consultActiveCycle().subscribe({
      next: (cycle) => {
        this.isChecking.set(false);
        if (cycle && cycle.status === CycleStatus.OPEN) {
          this.router.navigate(['/pedido/cei']);
        } else {
          this.checkMessage.set(
            'O ciclo semanal continua encerrado. Aguarde a gestão de compras abrir um novo ciclo.',
          );
        }
      },
      error: () => {
        this.isChecking.set(false);
        this.checkMessage.set(
          'Não foi possível verificar o status no momento. Tente novamente mais tarde.',
        );
      },
    });
  }
}

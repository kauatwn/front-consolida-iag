import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CycleService } from '../cycle.service';
import { CycleStatus } from '../cycle.model';

@Component({
  selector: 'app-cycle-closed-page',
  standalone: true,
  imports: [],
  templateUrl: './cycle-closed-page.html',
  styleUrl: './cycle-closed-page.css',
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

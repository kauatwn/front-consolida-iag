import { HttpStatusCode } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import {
  LucideClipboardCheck,
  LucideLoader,
  LucideSend,
  LucideTriangleExclamationPoint,
  LucideX,
} from '@lucide/angular';
import { CatalogService } from '../../catalog/catalog.service';
import { TotemCartState } from '../totem-cart.state';
import { RequestConflictError, WeeklyRequestService } from '../weekly-request.service';

@Component({
  selector: 'app-confirm-order-modal',
  imports: [
    LucideClipboardCheck,
    LucideX,
    LucideTriangleExclamationPoint,
    LucideSend,
    LucideLoader,
  ],
  host: {
    class: 'contents',
  },
  template: `
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      [inert]="!cartState.isConfirmModalOpen()"
      class="p-gutter-mobile fixed inset-0 z-50 flex items-end justify-center transition-all duration-300 sm:items-center"
      [class.opacity-0]="!cartState.isConfirmModalOpen()"
      [class.pointer-events-none]="!cartState.isConfirmModalOpen()"
      [class.opacity-100]="cartState.isConfirmModalOpen()"
      [class.pointer-events-auto]="cartState.isConfirmModalOpen()"
      [class.bg-primary/70]="cartState.isConfirmModalOpen()"
      [class.backdrop-blur-sm]="cartState.isConfirmModalOpen()"
    >
      <div
        class="gap-space-md bg-surface-container-lowest p-space-md flex max-h-[85vh] w-full max-w-lg flex-col overflow-y-auto rounded-t-2xl shadow-2xl transition-transform duration-300 sm:rounded-2xl"
        [class.translate-y-6]="!cartState.isConfirmModalOpen()"
        [class.translate-y-0]="cartState.isConfirmModalOpen()"
      >
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="gap-space-xs flex items-center">
            <div
              class="bg-tertiary-fixed text-on-tertiary-fixed flex size-9 shrink-0 items-center justify-center rounded-full"
            >
              <svg lucideClipboardCheck [size]="20" aria-hidden="true"></svg>
            </div>
            <h2
              id="confirm-modal-title"
              class="font-headline-md text-headline-md text-primary font-bold"
            >
              Confirmar Envio
            </h2>
          </div>

          <button
            type="button"
            aria-label="Fechar janela"
            (click)="onClose()"
            [disabled]="cartState.isSubmitting()"
            class="text-on-surface-variant hover:bg-surface-container-high flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors active:scale-95 disabled:opacity-40"
          >
            <svg lucideX [size]="20" aria-hidden="true"></svg>
          </button>
        </div>

        <!-- Service Target -->
        <div
          class="bg-surface-container-high p-space-xs px-space-sm flex items-center justify-between rounded-lg"
        >
          <span class="font-caption text-caption text-on-surface-variant">Destino do Pedido:</span>
          <span class="font-caption text-caption text-on-surface font-bold">
            {{ cartState.activeServiceDetail().fullName }}
          </span>
        </div>

        <!-- Items Summary -->
        <div class="gap-space-xs flex flex-col">
          <span
            class="font-caption text-caption text-on-surface-variant font-bold tracking-wider uppercase"
          >
            Resumo do Lote Semanal ({{ cartState.totalItemsCount() }}
            {{ cartState.totalItemsCount() === 1 ? 'item' : 'itens' }})
          </span>

          <div class="flex max-h-56 flex-col gap-1.5 overflow-y-auto pr-1">
            @for (item of selectedItems(); track item.product.id) {
              <div
                class="bg-surface-container-low px-space-xs font-body-md text-body-md flex items-center justify-between rounded-lg py-2"
              >
                <span class="text-on-surface truncate pr-2 font-bold">{{ item.product.name }}</span>
                <span class="font-label-numeric text-primary shrink-0 font-bold">
                  {{ item.quantity }}
                  <small class="font-caption text-on-surface-variant font-normal">
                    {{ item.product.unitMeasure }}
                  </small>
                </span>
              </div>
            } @empty {
              <div
                class="bg-surface-container-low p-space-sm font-caption text-caption text-on-surface-variant rounded-lg text-center"
              >
                Nenhum item com quantidade selecionada.
              </div>
            }
          </div>
        </div>

        <!-- Free-text Observation (RN-02.3) -->
        @if (cartState.observation().trim().length > 0) {
          <div
            class="bg-surface-container-low p-space-xs font-caption text-caption flex flex-col gap-1 rounded-lg"
          >
            <span class="text-on-surface font-bold">Observação / Itens fora do catálogo:</span>
            <p class="text-on-surface-variant italic">{{ cartState.observation().trim() }}</p>
          </div>
        }

        <!-- Conflict or Error Banner (RN-02.4) -->
        @if (cartState.conflictError()) {
          <div
            role="alert"
            class="bg-error-container p-space-sm text-on-error-container flex items-start gap-2 rounded-xl text-left shadow-sm"
          >
            <svg
              lucideTriangleExclamationPoint
              [size]="20"
              class="text-error mt-0.5 shrink-0"
              aria-hidden="true"
            ></svg>
            <div class="font-caption text-caption leading-tight">
              <strong class="font-bold">Aviso de Regra de Negócio:</strong>
              <p class="mt-0.5">{{ cartState.conflictError() }}</p>
            </div>
          </div>
        }

        <!-- Action Buttons -->
        <div class="gap-space-xs pt-space-xs flex flex-col">
          <button
            type="button"
            (click)="onSubmit()"
            [disabled]="!cartState.canSubmit() || selectedItems().length === 0"
            class="bg-primary font-headline-md text-body-md text-on-primary flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl font-bold tracking-wider uppercase shadow-lg transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            @if (cartState.isSubmitting()) {
              <svg lucideLoader [size]="20" class="animate-spin" aria-hidden="true"></svg>
              <span>Registrando Solicitação...</span>
            } @else {
              <span>Confirmar e Enviar Pedido</span>
              <svg lucideSend [size]="20" aria-hidden="true"></svg>
            }
          </button>

          <button
            type="button"
            (click)="onClose()"
            [disabled]="cartState.isSubmitting()"
            class="font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high flex min-h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-transparent transition-colors active:scale-[0.98] disabled:opacity-40"
          >
            Voltar e Revisar Itens
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmOrderModal {
  protected readonly cartState = inject(TotemCartState);
  private readonly weeklyRequestService = inject(WeeklyRequestService);
  private readonly catalogService = inject(CatalogService);

  protected readonly selectedItems = computed(() => {
    return this.cartState.getSelectedItemsSummary(this.catalogService.products());
  });

  protected onClose(): void {
    if (!this.cartState.isSubmitting()) {
      this.cartState.closeConfirmModal();
    }
  }

  protected onSubmit(): void {
    if (!this.cartState.canSubmit()) {
      return;
    }

    this.cartState.isSubmitting.set(true);
    this.cartState.setConflictError(null);

    const payload = this.cartState.buildSubmissionPayload();

    this.weeklyRequestService.submitRequest(payload).subscribe({
      next: (response) => {
        this.cartState.isSubmitting.set(false);
        this.cartState.closeConfirmModal();
        this.cartState.reset();
        this.cartState.showToast(
          `Pedido do ${payload.serviceCode} enviado com sucesso! (${response.itemsCount ?? payload.items.length} itens registrados)`,
        );
      },
      error: (err) => {
        this.cartState.isSubmitting.set(false);
        if (err instanceof RequestConflictError || err.status === HttpStatusCode.Conflict) {
          this.cartState.setConflictError(
            `Atenção: O serviço ${payload.serviceCode} já possui um pedido submetido neste ciclo semanal (RN-02.4). Para alterar as quantidades, utilize a edição de pedidos existentes.`,
          );
        } else {
          this.cartState.setConflictError(
            'Não foi possível registrar o pedido no momento devido a uma falha de conexão com a API. Tente novamente.',
          );
        }
      },
    });
  }
}

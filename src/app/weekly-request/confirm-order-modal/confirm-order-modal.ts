import { Component, computed, inject } from '@angular/core';
import { CatalogService } from '../../catalog/catalog.service';
import { TotemCartState } from '../totem-cart.state';
import { RequestConflictError, WeeklyRequestService } from '../weekly-request.service';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  imports: [],
  selector: 'app-confirm-order-modal',
  styles: `
    :host {
      display: contents;
    }
  `,
  template: `
    <div
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
              class="bg-tertiary-fixed text-on-tertiary-fixed flex h-9 w-9 items-center justify-center rounded-full"
            >
              <span class="material-symbols-outlined text-[22px]">assignment_turned_in</span>
            </div>
            <h2 class="font-headline-md text-headline-md text-primary font-bold">
              Confirmar Envio
            </h2>
          </div>
          <button
            type="button"
            aria-label="Fechar janela"
            (click)="onClose()"
            [disabled]="cartState.isSubmitting()"
            class="text-on-surface-variant hover:bg-surface-container-high flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors active:scale-95 disabled:opacity-40"
          >
            <span class="material-symbols-outlined">close</span>
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
                  <small class="font-caption text-on-surface-variant font-normal">{{
                    item.product.unitMeasure
                  }}</small>
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
            class="bg-error-container p-space-sm text-on-error-container flex items-start gap-2 rounded-xl text-left shadow-sm"
          >
            <span class="material-symbols-outlined text-error text-[20px]">warning</span>
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
            class="bg-primary font-headline-md text-body-md text-on-primary flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl font-bold tracking-wider uppercase shadow-lg transition-transform active:scale-98 disabled:cursor-not-allowed disabled:opacity-50"
          >
            @if (cartState.isSubmitting()) {
              <span class="material-symbols-outlined animate-spin text-[22px]"
                >progress_activity</span
              >
              <span>Registrando Solicitação...</span>
            } @else {
              <span>Confirmar e Enviar Pedido</span>
              <span class="material-symbols-outlined text-[22px]">send</span>
            }
          </button>

          <button
            type="button"
            (click)="onClose()"
            [disabled]="cartState.isSubmitting()"
            class="font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high flex min-h-[48px] w-full cursor-pointer items-center justify-center rounded-lg bg-transparent transition-colors active:scale-98 disabled:opacity-40"
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

  /**
   * Computed list of cart items with product info
   */
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

import { Component, inject } from '@angular/core';
import { TotemCartState } from '../totem-cart.state';

@Component({
  imports: [],
  selector: 'app-cart-summary-bar',
  styles: `
    :host {
      display: contents;
    }
  `,
  template: `
    <div
      class="px-gutter-mobile fixed bottom-20 left-0 z-40 w-full transition-all duration-300"
      [class.translate-y-4]="!cartState.hasSelectedItems()"
      [class.opacity-0]="!cartState.hasSelectedItems()"
      [class.pointer-events-none]="!cartState.hasSelectedItems()"
      [class.opacity-100]="cartState.hasSelectedItems()"
      [class.pointer-events-auto]="cartState.hasSelectedItems()"
    >
      <div
        class="gap-space-sm bg-inverse-surface/95 p-space-sm text-inverse-on-surface mx-auto flex max-w-md items-center justify-between rounded-xl shadow-xl backdrop-blur-md"
      >
        <div class="flex min-w-0 flex-col">
          <div class="flex items-center gap-1">
            <span class="bg-secondary-fixed h-2 w-2 animate-pulse rounded-full"></span>
            <span class="font-caption text-caption text-inverse-on-surface/90 font-bold">
              Pedido em Preparo ({{ cartState.activeServiceDetail().acronym }})
            </span>
          </div>
          <span class="font-caption text-caption text-inverse-on-surface/80 truncate">
            <strong class="font-label-numeric text-inverse-on-surface">
              {{ cartState.totalItemsCount() }}
            </strong>
            {{ cartState.totalItemsCount() === 1 ? 'item' : 'itens' }} •
            <strong class="font-label-numeric text-inverse-on-surface">
              {{ cartState.totalUnits() }}
            </strong>
            un. total
          </span>
        </div>
        <button
          type="button"
          (click)="onFinalize()"
          [disabled]="!cartState.canSubmit()"
          class="bg-secondary px-space-md font-headline-md text-body-md text-on-secondary flex min-h-[52px] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg font-bold shadow-md transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>Finalizar</span>
          <span class="material-symbols-outlined text-[20px]">check_circle</span>
        </button>
      </div>
    </div>
  `,
})
export class CartSummaryBar {
  protected readonly cartState = inject(TotemCartState);

  protected onFinalize(): void {
    this.cartState.openConfirmModal();
  }
}

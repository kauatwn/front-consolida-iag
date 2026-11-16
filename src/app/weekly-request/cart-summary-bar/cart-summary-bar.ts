import { Component, inject } from '@angular/core';
import { LucideCircleCheck } from '@lucide/angular';
import { TotemCartState } from '../totem-cart.state';

@Component({
  selector: 'app-cart-summary-bar',
  imports: [LucideCircleCheck],
  host: {
    class: 'contents',
  },
  template: `
    <div
      [inert]="!cartState.hasSelectedItems()"
      class="px-gutter-mobile pb-safe fixed bottom-4 left-0 z-40 w-full transition-all duration-300"
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
          <div class="flex items-center gap-1.5">
            <span
              class="bg-secondary-fixed size-2 animate-pulse rounded-full"
              aria-hidden="true"
            ></span>
            <span class="font-caption text-caption text-inverse-on-surface/90 font-bold">
              Pedido em Preparo ({{ cartState.activeServiceDetail().acronym }})
            </span>
          </div>
          <span class="font-caption text-caption text-inverse-on-surface/80 truncate">
            <strong class="font-label-numeric text-inverse-on-surface">
              {{ cartState.totalItemsCount() }}
            </strong>
            {{ cartState.totalItemsCount() === 1 ? 'item' : 'itens' }} &bull;
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
          class="bg-secondary px-space-md font-headline-md text-body-md text-on-secondary flex min-h-13 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg font-bold shadow-md transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>Finalizar</span>
          <svg lucideCircleCheck [size]="20" [strokeWidth]="2.5" aria-hidden="true"></svg>
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

import { Component, computed, input, output } from '@angular/core';
import { CatalogProduct } from '../../catalog/product.model';

@Component({
  selector: 'app-product-card',
  imports: [],
  styles: `
    :host {
      display: block;
      width: 100%;
    }
  `,
  template: `
    <div
      class="catalog-card gap-space-sm p-space-sm flex flex-col rounded-xl shadow-sm transition-all duration-200"
      [class.bg-secondary-fixed/40]="isSelected()"
      [class.bg-surface-container-low]="!isSelected()"
      [class.ring-2]="isSelected()"
      [class.ring-secondary/40]="isSelected()"
    >
      <div class="gap-space-sm flex items-start justify-between">
        <div class="gap-space-sm flex min-w-0 items-center">
          @if (product().imageUrl) {
            <img
              class="h-12 w-12 shrink-0 rounded-lg object-cover shadow-sm"
              [src]="product().imageUrl"
              [alt]="product().name"
              loading="lazy"
            />
          } @else {
            <div
              class="bg-surface-container-high text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
            >
              <span class="material-symbols-outlined text-[24px]">restaurant</span>
            </div>
          }
          <div class="flex min-w-0 flex-col">
            <span
              class="font-headline-md text-body-lg text-on-surface truncate leading-tight font-bold"
            >
              {{ product().name }}
            </span>
            @if (product().description) {
              <span class="font-caption text-caption text-on-surface-variant truncate">
                {{ product().description }}
              </span>
            }
          </div>
        </div>
        <span
          class="bg-surface-container-high px-space-sm font-label-badge text-caption text-on-surface-variant shrink-0 rounded-full py-1 font-bold uppercase"
        >
          {{ product().unitMeasure }}
        </span>
      </div>

      <div
        class="bg-surface-container-lowest/70 p-space-xs pt-space-xs flex items-center justify-between rounded-lg"
      >
        <span class="font-caption text-caption pl-space-xs text-on-surface-variant">
          Quantidade semanal:
        </span>
        <div class="gap-space-sm flex items-center">
          <button
            type="button"
            [attr.aria-label]="'Diminuir ' + product().name"
            (click)="onDecrement()"
            [disabled]="quantity() === 0"
            class="bg-surface-container-high text-on-surface flex h-12 min-h-[48px] w-12 min-w-[48px] cursor-pointer items-center justify-center rounded-lg transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span class="material-symbols-outlined text-[24px]">remove</span>
          </button>

          <div class="min-w-14 px-1 text-center">
            <span class="font-label-numeric text-headline-md text-on-surface font-bold">
              {{ quantity() }}
            </span>
          </div>

          <button
            type="button"
            [attr.aria-label]="'Aumentar ' + product().name"
            (click)="onIncrement()"
            class="bg-primary text-on-primary flex h-12 min-h-[48px] w-12 min-w-[48px] cursor-pointer items-center justify-center rounded-lg shadow-sm transition-transform active:scale-95"
          >
            <span class="material-symbols-outlined text-[24px]">add</span>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ProductCard {
  /**
   * Product data model
   */
  readonly product = input.required<CatalogProduct>();

  /**
   * Current requested quantity
   */
  readonly quantity = input<number>(0);

  /**
   * Custom events emitted on interaction
   */
  readonly increment = output<void>();
  readonly decrement = output<void>();
  readonly quantityChange = output<number>();

  /**
   * Computed boolean for active state
   */
  protected readonly isSelected = computed(() => this.quantity() > 0);

  /**
   * Safe step increment from product or default 1
   */
  protected readonly step = computed(() => this.product().step ?? 1);

  protected onIncrement(): void {
    this.increment.emit();
  }

  protected onDecrement(): void {
    if (this.quantity() > 0) {
      this.decrement.emit();
    }
  }

  protected onDirectInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const val = parseFloat(target.value);
    if (!isNaN(val) && val >= 0) {
      this.quantityChange.emit(Math.round(val * 100) / 100);
    }
  }
}

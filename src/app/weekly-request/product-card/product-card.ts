import { Component, computed, input, output } from '@angular/core';
import { LucideMinus, LucidePlus } from '@lucide/angular';
import { CategoryIcon } from '../../catalog/category-icon/category-icon';
import { CatalogProduct } from '../../catalog/product.model';

@Component({
  selector: 'app-product-card',
  imports: [CategoryIcon, LucideMinus, LucidePlus],
  host: {
    class: 'block w-full',
  },
  template: `
    <article
      class="catalog-card gap-space-sm p-space-sm flex flex-col rounded-xl shadow-sm transition-all duration-200"
      [class.bg-secondary-fixed/40]="isSelected()"
      [class.bg-surface-container-low]="!isSelected()"
      [class.ring-2]="isSelected()"
      [class.ring-secondary/40]="isSelected()"
    >
      <div class="gap-space-sm flex items-start justify-between">
        <div class="gap-space-sm flex min-w-0 items-center">
          <div
            class="bg-surface-container-high text-secondary flex size-12 shrink-0 items-center justify-center rounded-xl shadow-xs"
          >
            <app-category-icon [category]="product().category" [size]="24" />
          </div>

          <div class="flex min-w-0 flex-col">
            <h3
              class="font-headline-md text-body-lg text-on-surface truncate leading-tight font-bold"
            >
              {{ product().name }}
            </h3>
          </div>
        </div>

        <!-- Unit Pill -->
        <span
          class="bg-surface-container-high px-space-sm font-label-badge text-caption text-on-surface-variant shrink-0 rounded-full py-1 font-bold"
        >
          {{ product().unitMeasure }}
        </span>
      </div>

      <div
        class="bg-surface-container-lowest/70 p-space-xs flex items-center justify-between rounded-lg"
      >
        <span class="font-caption text-caption pl-space-xs text-on-surface-variant">
          Quantidade ({{ product().unitMeasure }}):
        </span>

        <div
          role="group"
          [attr.aria-label]="'Quantidade de ' + product().name"
          class="gap-space-sm flex items-center"
        >
          <button
            type="button"
            [attr.aria-label]="'Diminuir ' + product().name"
            (click)="onDecrement()"
            [disabled]="quantity() === 0"
            class="bg-surface-container-high text-on-surface flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg lucideMinus [size]="22" [strokeWidth]="2.5" aria-hidden="true"></svg>
          </button>

          <input
            type="number"
            min="0"
            step="1"
            inputmode="numeric"
            pattern="[0-9]*"
            [value]="quantity()"
            (focus)="onInputFocus($event)"
            (input)="onInputChange($event)"
            [attr.aria-label]="'Digitar quantidade para ' + product().name"
            class="bg-surface-container-high/60 font-label-numeric text-headline-md text-on-surface focus:border-secondary focus:bg-surface-container-lowest focus:ring-secondary/40 h-12 w-16 cursor-text [appearance:textfield] rounded-lg border border-transparent p-0 text-center leading-none font-bold tabular-nums transition-colors focus:ring-2 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />

          <button
            type="button"
            [attr.aria-label]="'Aumentar ' + product().name"
            (click)="onIncrement()"
            class="bg-primary text-on-primary flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-lg shadow-sm transition-transform active:scale-95"
          >
            <svg lucidePlus [size]="22" [strokeWidth]="2.5" aria-hidden="true"></svg>
          </button>
        </div>
      </div>
    </article>
  `,
})
export class ProductCard {
  /**
   * Product data model
   */
  readonly product = input.required<CatalogProduct>();

  /**
   * Current requested quantity (integer units)
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

  protected onIncrement(): void {
    this.increment.emit();
  }

  protected onDecrement(): void {
    if (this.quantity() > 0) {
      this.decrement.emit();
    }
  }

  protected onInputFocus(event: FocusEvent): void {
    const target = event.target as HTMLInputElement;
    target.select();
  }

  protected onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const parsed = parseInt(target.value, 10);
    const validQty = isNaN(parsed) ? 0 : Math.max(0, parsed);
    this.quantityChange.emit(validQty);
  }
}

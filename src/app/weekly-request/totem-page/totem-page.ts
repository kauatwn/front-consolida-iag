import { Component, effect, inject, input } from '@angular/core';
import { LucideCircleCheck, LucideFileText, LucideUtensils } from '@lucide/angular';
import { CatalogService } from '../../catalog/catalog.service';
import { CategoryIcon } from '../../catalog/category-icon/category-icon';
import { CycleService } from '../../cycle-management/cycle.service';
import { CartSummaryBar } from '../cart-summary-bar/cart-summary-bar';
import { ConfirmOrderModal } from '../confirm-order-modal/confirm-order-modal';
import { ProductCard } from '../product-card/product-card';
import { TotemCartState } from '../totem-cart.state';
import { ServiceCode } from '../weekly-request.model';

@Component({
  selector: 'app-totem-page',
  imports: [
    ProductCard,
    CartSummaryBar,
    ConfirmOrderModal,
    CategoryIcon,
    LucideFileText,
    LucideCircleCheck,
    LucideUtensils,
  ],
  host: {
    class: 'block min-h-screen w-full',
  },
  template: `
    <div class="bg-surface font-body-md text-on-surface flex min-h-screen flex-col">
      <!-- Main Scrollable Catalog Screen -->
      <main class="px-gutter-mobile mx-auto flex w-full max-w-2xl flex-1 flex-col pt-6 pb-28">
        <!-- Service Banner & Instructions -->
        <header
          class="mb-space-md bg-primary p-space-md text-on-primary flex flex-col gap-2 rounded-xl shadow-sm"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <svg
                lucideUtensils
                [size]="22"
                class="text-secondary-fixed shrink-0"
                aria-hidden="true"
              ></svg>
              <h1 class="font-headline-md text-headline-md text-on-primary leading-tight font-bold">
                {{ cartState.activeServiceDetail().fullName }}
              </h1>
            </div>

            <div
              class="bg-tertiary-fixed text-on-tertiary-fixed flex items-center gap-1.5 rounded-full px-3 py-1"
            >
              <span class="bg-tertiary-container h-2 w-2 animate-pulse rounded-full"></span>
              <span class="font-caption text-caption leading-none font-bold whitespace-nowrap">
                Ciclo Aberto
              </span>
            </div>
          </div>

          <p class="font-body-md text-caption text-on-primary/90 leading-snug">
            Selecione as quantidades para a semana. Toque em <strong>+</strong> ou
            <strong>&ndash;</strong> para ajustar de 1 em 1, ou
            <strong>toque no número</strong> para digitar manualmente.
          </p>
        </header>

        <!-- Product Groups by Category -->
        <div class="gap-space-md flex flex-col" id="catalog-list">
          @for (group of catalogService.groupedProducts(); track group.category) {
            <section class="gap-space-sm flex flex-col">
              <div class="my-space-xs gap-space-xs px-space-xs flex items-center">
                <app-category-icon [category]="group.category" [size]="20" class="text-secondary" />
                <h2
                  class="font-caption text-caption text-on-surface-variant font-bold tracking-wider uppercase"
                >
                  {{ group.categoryDisplayName }}
                </h2>
              </div>

              <div class="gap-space-sm flex flex-col">
                @for (product of group.products; track product.id) {
                  <app-product-card
                    [product]="product"
                    [quantity]="cartState.getQuantity(product.id)"
                    (increment)="cartState.increment(product.id)"
                    (decrement)="cartState.decrement(product.id)"
                    (quantityChange)="cartState.setQuantity(product.id, $event)"
                  />
                }
              </div>
            </section>
          } @empty {
            @if (catalogService.loading()) {
              <div
                class="p-space-lg text-on-surface-variant flex flex-col items-center justify-center"
              >
                <span class="font-body-md text-body-md">Carregando catálogo de insumos...</span>
              </div>
            }
          }
        </div>

        <!-- Free-text Observation Box (RN-02.3) -->
        <section
          class="mt-space-md gap-space-xs bg-surface-container-low p-space-md flex flex-col rounded-xl shadow-sm"
        >
          <label
            for="request-observation"
            class="gap-space-xs font-headline-md text-body-lg text-on-surface flex items-center font-bold"
          >
            <svg
              lucideFileText
              [size]="20"
              class="text-secondary shrink-0"
              aria-hidden="true"
            ></svg>
            <span>Observações ou itens fora do catálogo</span>
          </label>
          <p class="font-caption text-caption text-on-surface-variant">
            Caso falte algo essencial que não está na lista acima (ex: temperos específicos, itens
            de dieta especial ou emergência de limpeza).
          </p>
          <textarea
            id="request-observation"
            rows="3"
            (input)="onObservationInput($event)"
            [value]="cartState.observation()"
            placeholder="Precisa de algum item emergencial ou diferente da lista? Descreva aqui com a quantidade aproximada..."
            class="mt-space-xs bg-surface-container-lowest p-space-sm font-body-md text-body-md text-on-surface focus:ring-secondary/40 w-full resize-none rounded-lg shadow-inner focus:ring-2 focus:outline-none"
          ></textarea>
        </section>
      </main>

      <!-- Sticky Cart Summary Bar -->
      <app-cart-summary-bar />

      <!-- Order Confirmation Modal -->
      <app-confirm-order-modal />

      <!-- Floating Success Toast Notification -->
      @if (cartState.toastSuccess()) {
        <div
          role="status"
          class="gap-space-xs bg-tertiary px-space-md py-space-sm text-on-tertiary fixed top-6 left-1/2 z-50 flex -translate-x-1/2 items-center rounded-full shadow-2xl transition-all duration-300"
        >
          <svg
            lucideCircleCheck
            [size]="22"
            class="text-tertiary-fixed shrink-0"
            aria-hidden="true"
          ></svg>
          <span class="font-headline-md text-body-md font-bold">
            {{ cartState.toastSuccess() }}
          </span>
        </div>
      }
    </div>
  `,
})
export class TotemPage {
  protected readonly catalogService = inject(CatalogService);
  protected readonly cycleService = inject(CycleService);
  protected readonly cartState = inject(TotemCartState);

  readonly serviceCode = input<string>();

  constructor() {
    this.catalogService.listCatalogProducts().subscribe();

    effect(() => {
      const code = this.serviceCode()?.toUpperCase();
      if (
        code &&
        (code === ServiceCode.CEI || code === ServiceCode.CCA || code === ServiceCode.CJ)
      ) {
        this.cartState.setService(code as ServiceCode);
      }
    });
  }

  protected onObservationInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.cartState.setObservation(target.value);
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogService } from '../../catalog/catalog.service';
import { CycleService } from '../../cycle-management/cycle.service';
import { CartSummaryBar } from '../cart-summary-bar/cart-summary-bar';
import { ConfirmOrderModal } from '../confirm-order-modal/confirm-order-modal';
import { ProductCard } from '../product-card/product-card';
import { TotemCartState } from '../totem-cart.state';
import { ServiceCode } from '../weekly-request.model';

@Component({
  selector: 'app-totem-page',
  imports: [ProductCard, CartSummaryBar, ConfirmOrderModal],
  styles: `
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
    }
  `,
  template: `
    <div class="bg-surface font-body-md text-on-surface flex min-h-screen flex-col">
      <!-- Fixed Top Header -->
      <header
        class="bg-surface/90 pt-safe fixed top-0 z-50 w-full shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl"
      >
        <div class="gap-space-xs px-gutter-mobile flex flex-col justify-center py-2">
          <!-- Title & User Profile Row -->
          <div class="flex items-center justify-between">
            <div class="pr-space-xs flex min-w-0 flex-col">
              <div class="gap-space-xs flex items-center">
                <span class="material-symbols-outlined text-secondary text-[22px]"
                  >local_dining</span
                >
                <span
                  class="font-headline-md text-headline-md text-primary truncate leading-none font-bold tracking-tight"
                >
                  Consolida IAG
                </span>
              </div>
              <span class="font-caption text-caption text-on-surface-variant truncate">
                Instituto Anchieta Grajaú
              </span>
            </div>

            <div class="gap-space-sm flex shrink-0 items-center">
              <div
                class="bg-primary text-on-primary flex h-8 w-8 items-center justify-center rounded-full"
              >
                <span class="material-symbols-outlined text-[18px]">person</span>
              </div>
            </div>
          </div>

          <!-- Service Selector & Cycle Status Row -->
          <div class="gap-space-xs flex items-center justify-between">
            <!-- Service Cost Center Pills (CEI / CCA / CJ) -->
            <div class="bg-surface-container-high flex items-center gap-1 rounded-full p-0.5">
              @for (svc of serviceOptions; track svc) {
                <button
                  type="button"
                  (click)="selectService(svc)"
                  [class.bg-primary]="cartState.selectedService() === svc"
                  [class.text-on-primary]="cartState.selectedService() === svc"
                  [class.text-on-surface-variant]="cartState.selectedService() !== svc"
                  class="font-caption text-caption flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-0.5 font-bold transition-all active:scale-95"
                >
                  <span>{{ svc }}</span>
                </button>
              }
            </div>

            <!-- Active Cycle Badge -->
            <div
              class="bg-tertiary-fixed px-space-xs text-on-tertiary-fixed flex items-center gap-1.5 rounded-full py-0.5"
            >
              <span class="bg-tertiary-container h-2 w-2 animate-pulse rounded-full"></span>
              <span class="font-caption text-caption leading-none font-bold whitespace-nowrap">
                Ciclo Aberto
              </span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Scrollable Catalog Screen -->
      <main class="px-gutter-mobile relative flex w-full flex-1 flex-col pt-28 pb-36">
        <!-- Hero / Instructions Banner -->
        <div class="mb-space-md gap-space-sm flex flex-col">
          <div
            class="gap-space-md bg-primary p-space-md text-on-primary flex items-center rounded-xl shadow-md"
          >
            <div
              class="bg-secondary text-on-secondary flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-sm"
            >
              <span class="material-symbols-outlined text-[28px]">soup_kitchen</span>
            </div>
            <div class="flex min-w-0 flex-col">
              <span
                class="font-headline-md text-headline-md text-on-primary leading-tight font-bold"
              >
                Cardápio &amp; Pedidos ({{ cartState.activeServiceDetail().acronym }})
              </span>
              <p class="font-body-md text-caption text-on-primary/90 mt-0.5 leading-snug">
                Selecione as quantidades para a semana. Toque no <strong>+</strong> ou
                <strong>−</strong> para ajustar com facilidade.
              </p>
            </div>
          </div>

          <div class="px-space-xs flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="bg-secondary h-2.5 w-2.5 animate-pulse rounded-full"></span>
              <span
                class="font-caption text-caption text-on-surface-variant tracking-wider uppercase"
              >
                Itens Essenciais Homologados
              </span>
            </div>
            <span
              class="font-caption text-caption text-secondary flex items-center gap-1 font-bold"
            >
              <span class="material-symbols-outlined text-[16px]">touch_app</span> Modo Rápido
              Cozinha
            </span>
          </div>
        </div>

        <!-- Product Groups by Category (Continuous Scroll) -->
        <div class="gap-space-md flex flex-col" id="catalog-list">
          @for (group of catalogService.groupedProducts(); track group.category) {
            <section class="gap-space-sm flex flex-col">
              <!-- Category Header Divider -->
              <div class="my-space-xs gap-space-xs px-space-xs flex items-center">
                <span class="material-symbols-outlined text-secondary text-[20px]">
                  {{ group.iconName }}
                </span>
                <span
                  class="font-caption text-caption text-on-surface-variant font-bold tracking-wider uppercase"
                >
                  {{ group.categoryDisplayName }}
                </span>
              </div>

              <!-- Cards in Category -->
              <div class="gap-space-sm flex flex-col">
                @for (product of group.products; track product.id) {
                  <app-product-card
                    [product]="product"
                    [quantity]="cartState.getQuantity(product.id)"
                    (increment)="cartState.increment(product.id, product.step ?? 1)"
                    (decrement)="cartState.decrement(product.id, product.step ?? 1)"
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
                <span class="material-symbols-outlined animate-spin text-[36px]"
                  >progress_activity</span
                >
                <span class="mt-space-xs font-body-md text-body-md"
                  >Carregando catálogo de insumos...</span
                >
              </div>
            }
          }
        </div>

        <!-- Free-text Observation Box (RN-02.3) -->
        <div
          class="mt-space-md gap-space-xs bg-surface-container-low p-space-md flex flex-col rounded-xl shadow-sm"
        >
          <div class="gap-space-xs text-primary flex items-center">
            <span class="material-symbols-outlined text-[22px]">edit_note</span>
            <span class="font-headline-md text-body-lg text-on-surface font-bold">
              Observações ou itens fora do catálogo
            </span>
          </div>
          <p class="font-caption text-caption text-on-surface-variant">
            Caso falte algo essencial que não está na lista acima (ex: temperos específicos, itens
            de dieta especial ou emergência de limpeza).
          </p>
          <textarea
            rows="3"
            (input)="onObservationInput($event)"
            [value]="cartState.observation()"
            placeholder="Precisa de algum item emergencial ou diferente da lista? Descreva aqui com a quantidade aproximada..."
            class="mt-space-xs bg-surface-container-lowest p-space-sm font-body-md text-body-md text-on-surface w-full resize-none rounded-lg shadow-inner focus:outline-none"
          ></textarea>
        </div>
      </main>

      <!-- Sticky Cart Summary Bar -->
      <app-cart-summary-bar />

      <!-- Order Confirmation Modal -->
      <app-confirm-order-modal />

      <!-- Floating Success Toast Notification -->
      @if (cartState.toastSuccess()) {
        <div
          class="gap-space-xs bg-tertiary px-space-md py-space-sm text-on-tertiary fixed top-28 left-1/2 z-50 flex -translate-x-1/2 items-center rounded-full shadow-2xl transition-all duration-300"
        >
          <span class="material-symbols-outlined text-tertiary-fixed text-[22px]">verified</span>
          <span class="font-headline-md text-body-md font-bold">
            {{ cartState.toastSuccess() }}
          </span>
        </div>
      }

      <!-- Fixed Bottom Navigation (Totem Navigation) -->
      <nav
        class="bg-surface/90 pb-safe fixed bottom-0 z-40 w-full shadow-[0_-2px_10px_rgba(0,0,0,0.05)] backdrop-blur-xl"
      >
        <div class="px-space-xs flex h-16 items-center justify-around">
          <button
            type="button"
            aria-current="page"
            class="text-primary flex min-h-[48px] min-w-14 cursor-pointer flex-col items-center justify-center gap-0.5 font-bold transition-colors"
          >
            <span class="material-symbols-outlined text-[22px]">receipt_long</span>
            <span class="font-caption text-caption leading-none">Pedidos</span>
          </button>
          <button
            type="button"
            class="text-on-surface-variant hover:text-primary flex min-h-[48px] min-w-14 cursor-pointer flex-col items-center justify-center gap-0.5 transition-colors"
          >
            <span class="material-symbols-outlined text-[22px]">inventory_2</span>
            <span class="font-caption text-caption leading-none">Estoque</span>
          </button>
          <button
            type="button"
            (click)="cartState.openConfirmModal()"
            class="text-on-surface-variant hover:text-primary flex min-h-[48px] min-w-14 cursor-pointer flex-col items-center justify-center gap-0.5 transition-colors"
          >
            <span class="material-symbols-outlined text-[22px]">shopping_basket</span>
            <span class="font-caption text-caption leading-none">Cesta</span>
          </button>
          <button
            type="button"
            class="text-on-surface-variant hover:text-primary flex min-h-[48px] min-w-14 cursor-pointer flex-col items-center justify-center gap-0.5 transition-colors"
          >
            <span class="material-symbols-outlined text-[22px]">history_edu</span>
            <span class="font-caption text-caption leading-none">Entregas</span>
          </button>
        </div>
      </nav>
    </div>
  `,
})
export class TotemPage implements OnInit {
  protected readonly catalogService = inject(CatalogService);
  protected readonly cycleService = inject(CycleService);
  protected readonly cartState = inject(TotemCartState);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly serviceOptions: ServiceCode[] = ['CEI', 'CCA', 'CJ'];

  ngOnInit(): void {
    // Load products
    this.catalogService.listCatalogProducts().subscribe();

    // Monitor route params for /pedido/:serviceCode
    this.route.paramMap.subscribe((params) => {
      const code = params.get('serviceCode')?.toUpperCase();
      if (code && (code === 'CEI' || code === 'CCA' || code === 'CJ')) {
        this.cartState.setService(code as ServiceCode);
      }
    });
  }

  protected selectService(code: ServiceCode): void {
    this.cartState.setService(code);
    this.router.navigate(['/pedido', code.toLowerCase()], { replaceUrl: true });
  }

  protected onObservationInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.cartState.setObservation(target.value);
  }
}

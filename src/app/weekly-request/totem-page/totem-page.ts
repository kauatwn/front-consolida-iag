import {
  Component,
  DOCUMENT,
  ElementRef,
  effect,
  inject,
  input,
  signal,
  viewChildren,
} from '@angular/core';
import {
  LucideCircleCheck,
  LucideFileText,
  LucideLogOut,
  LucidePencilLine,
  LucideUtensils,
} from '@lucide/angular';
import { Router } from '@angular/router';
import { Auth } from '../../core/auth/auth';
import { Catalog } from '../../catalog/catalog';
import { CategoryIcon } from '../../catalog/category-icon/category-icon';
import { Cycle } from '../../cycle-management/cycle';
import { CartSummaryBar } from '../cart-summary-bar/cart-summary-bar';
import { ConfirmOrderModal } from '../confirm-order-modal/confirm-order-modal';
import { ProductCard } from '../product-card/product-card';
import { TotemCartState } from '../totem-cart-state';
import { ServiceCode } from '../weekly-request.model';
import { WeeklyRequest } from '../weekly-request';

@Component({
  selector: 'app-totem-page',
  imports: [
    ProductCard,
    CartSummaryBar,
    ConfirmOrderModal,
    CategoryIcon,
    LucideFileText,
    LucideCircleCheck,
    LucidePencilLine,
    LucideUtensils,
    LucideLogOut,
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
              <span class="bg-tertiary-container size-2 animate-pulse rounded-full"></span>
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

          <div
            class="border-on-primary/20 mt-1 flex items-center justify-between border-t pt-2 text-xs"
          >
            <span class="text-on-primary/85 truncate">
              Conectado como: <strong class="text-on-primary">{{ auth.userName() }}</strong>
            </span>
            <button
              type="button"
              (click)="onLogout()"
              class="hover:bg-on-primary/10 text-on-primary flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 font-semibold transition-colors"
            >
              <svg lucideLogOut [size]="14" aria-hidden="true"></svg>
              <span>Sair</span>
            </button>
          </div>
        </header>

        <!-- Edit Mode Notice Banner (RN-02.6) -->
        @if (cartState.isEditMode()) {
          <div
            role="status"
            class="mb-space-sm border-secondary/30 bg-secondary-fixed/50 p-space-sm text-on-surface flex items-start gap-2.5 rounded-xl border"
          >
            <svg
              lucidePencilLine
              [size]="18"
              class="text-secondary mt-0.5 shrink-0"
              aria-hidden="true"
            ></svg>
            <p class="font-caption text-caption leading-snug">
              <strong>Pedido já enviado nesta semana.</strong> Os itens abaixo refletem a última
              solicitação registrada e podem ser ajustados enquanto o ciclo estiver aberto.
            </p>
          </div>
        }

        <!-- Category Scroll Pills -->
        <nav
          aria-label="Categorias do catálogo"
          class="border-outline-variant/50 bg-surface/95 mb-space-sm sticky top-0 z-20 -mx-3 border-b px-3 backdrop-blur-md"
        >
          <div class="no-scrollbar flex items-center gap-2 overflow-x-auto py-2">
            <button
              #categoryPill
              data-category="all"
              type="button"
              (click)="scrollToTop()"
              [attr.aria-pressed]="activeCategory() === 'all'"
              class="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-150"
              [class]="
                activeCategory() === 'all'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container'
              "
            >
              Todos os Itens
            </button>

            @for (group of catalogService.groupedProducts(); track group.category) {
              <button
                #categoryPill
                [attr.data-category]="group.category"
                type="button"
                (click)="scrollToCategory(group.category)"
                [attr.aria-pressed]="activeCategory() === group.category"
                class="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-150"
                [class]="
                  activeCategory() === group.category
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container'
                "
              >
                <app-category-icon [category]="group.category" [size]="14" />
                <span>{{ group.categoryDisplayName }}</span>
              </button>
            }
          </div>
        </nav>

        <!-- Product Groups by Category -->
        <div class="gap-space-md flex flex-col" id="catalog-list">
          @for (group of catalogService.groupedProducts(); track group.category) {
            <section
              #categorySection
              [id]="'section-' + group.category"
              class="gap-space-sm flex scroll-mt-14 flex-col"
            >
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
  private readonly document = inject(DOCUMENT);
  protected readonly catalogService = inject(Catalog);
  protected readonly cycleService = inject(Cycle);
  protected readonly cartState = inject(TotemCartState);
  private readonly weeklyRequestService = inject(WeeklyRequest);
  protected readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected async onLogout(): Promise<void> {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }

  protected readonly activeCategory = signal<string>('all');
  readonly serviceCode = input<string>();

  private readonly sectionRefs = viewChildren<ElementRef<HTMLElement>>('categorySection');
  private readonly pillRefs = viewChildren<ElementRef<HTMLButtonElement>>('categoryPill');

  private isProgrammaticScroll = false;
  private scrollLockTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.catalogService.listCatalogProducts().subscribe();

    effect((onCleanup) => {
      const rawCode = this.serviceCode()?.toUpperCase();
      if (
        !rawCode ||
        (rawCode !== ServiceCode.CEI && rawCode !== ServiceCode.CCA && rawCode !== ServiceCode.CJ)
      ) {
        return;
      }

      const code = rawCode as ServiceCode;
      this.cartState.setService(code);
      this.cartState.isLoadingRequest.set(true);

      const sub = this.weeklyRequestService.consultActiveRequest(code).subscribe({
        next: (existingRequest) => {
          this.cartState.hydrateExistingRequest(existingRequest);
          this.cartState.isLoadingRequest.set(false);
        },
        error: () => {
          this.cartState.isLoadingRequest.set(false);
        },
      });

      onCleanup(() => sub.unsubscribe());
    });

    effect(() => {
      const current = this.activeCategory();
      const activePill = this.pillRefs().find(
        (ref) => ref.nativeElement.dataset['category'] === current,
      );
      activePill?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    });

    effect((onCleanup) => {
      const sections = this.sectionRefs();
      if (sections.length === 0) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (this.isProgrammaticScroll) {
            return;
          }
          for (const entry of entries) {
            if (entry.isIntersecting) {
              this.activeCategory.set(entry.target.id.replace('section-', ''));
              break;
            }
          }
        },
        { threshold: 0, rootMargin: '-15% 0px -75% 0px' },
      );

      for (const ref of sections) {
        observer.observe(ref.nativeElement);
      }

      const win = this.document.defaultView;
      const onWindowScroll = () => {
        if (!this.isProgrammaticScroll && (win?.scrollY ?? 0) < 80) {
          this.activeCategory.set('all');
        }
      };

      win?.addEventListener('scroll', onWindowScroll, { passive: true });

      onCleanup(() => {
        observer.disconnect();
        win?.removeEventListener('scroll', onWindowScroll);
        if (this.scrollLockTimer !== null) {
          clearTimeout(this.scrollLockTimer);
        }
      });
    });
  }

  protected scrollToCategory(category: string): void {
    this.lockObserverTemporarily();
    this.activeCategory.set(category);
    const target = this.sectionRefs().find((ref) => ref.nativeElement.id === `section-${category}`);
    target?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected scrollToTop(): void {
    this.lockObserverTemporarily();
    this.activeCategory.set('all');
    this.document.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected onObservationInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.cartState.setObservation(target.value);
  }

  private lockObserverTemporarily(): void {
    this.isProgrammaticScroll = true;
    if (this.scrollLockTimer !== null) {
      clearTimeout(this.scrollLockTimer);
    }
    this.scrollLockTimer = setTimeout(() => {
      this.isProgrammaticScroll = false;
    }, 650);
  }
}

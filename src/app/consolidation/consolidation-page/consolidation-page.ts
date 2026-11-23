import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  LucideCalendar,
  LucideCheck,
  LucideCircleExclamationPoint,
  LucideClipboardList,
  LucideCopy,
  LucideLogOut,
  LucidePackageOpen,
  LucideRefreshCw,
  LucideSearch,
  LucideX,
} from '@lucide/angular';
import { CategoryIcon } from '../../catalog/category-icon/category-icon';
import { CATEGORY_LABELS, UNIT_MEASURE_LABELS } from '../../catalog/product.model';
import { Auth } from '../../core/auth/auth';
import { Cycle } from '../../cycle-management/cycle';
import { WeeklyCycle } from '../../cycle-management/cycle.model';
import { Consolidation } from '../consolidation';
import {
  ConsolidatedCategoryGroup,
  ConsolidatedItem,
  ConsolidatedReport,
} from '../consolidation.model';

@Component({
  selector: 'app-consolidation-page',
  imports: [
    DatePipe,
    CategoryIcon,
    LucideClipboardList,
    LucideRefreshCw,
    LucideSearch,
    LucideX,
    LucideCircleExclamationPoint,
    LucidePackageOpen,
    LucideLogOut,
    LucideCopy,
    LucideCheck,
    LucideCalendar,
  ],
  host: {
    class: 'block min-h-screen w-full',
  },
  template: `
    <div class="bg-surface font-body-md text-on-surface flex min-h-screen flex-col">
      <main class="px-gutter-mobile mx-auto flex w-full max-w-4xl flex-1 flex-col pt-6 pb-16">
        <!-- Header -->
        <header
          class="mb-space-md bg-primary p-space-md text-on-primary flex flex-col gap-3 rounded-2xl shadow-sm"
        >
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <div class="bg-primary-container flex size-10 items-center justify-center rounded-xl">
                <svg
                  lucideClipboardList
                  [size]="22"
                  class="text-secondary-fixed shrink-0"
                  aria-hidden="true"
                ></svg>
              </div>
              <div>
                <h1
                  class="font-headline-md text-headline-md text-on-primary leading-tight font-bold"
                >
                  Lista Consolidada de Compras
                </h1>
                <p class="text-caption text-on-primary/80 text-xs">
                  Painel de Compras &bull; Instituto Anchieta Grajaú
                </p>
              </div>
            </div>

            @if (report(); as currentReport) {
              <div class="flex items-center gap-2">
                <div
                  class="bg-tertiary-fixed text-on-tertiary-fixed flex items-center gap-1.5 rounded-full px-3 py-1"
                >
                  <span class="font-caption text-caption leading-none font-bold whitespace-nowrap">
                    {{ currentReport.totalProductsCount }}
                    {{ currentReport.totalProductsCount === 1 ? 'insumo' : 'insumos' }}
                  </span>
                </div>

                <button
                  type="button"
                  (click)="copyConsolidatedList()"
                  [disabled]="currentReport.items.length === 0"
                  class="bg-surface/15 hover:bg-surface/25 text-on-primary flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Copiar lista consolidada para a área de transferência"
                >
                  @if (copiedToast()) {
                    <svg
                      lucideCheck
                      [size]="14"
                      class="text-tertiary-fixed"
                      aria-hidden="true"
                    ></svg>
                    <span class="text-tertiary-fixed font-bold">Copiado!</span>
                  } @else {
                    <svg lucideCopy [size]="14" aria-hidden="true"></svg>
                    <span>Copiar Lista</span>
                  }
                </button>
              </div>
            }
          </div>

          <!-- Cycle Context & Timestamp -->
          <div
            class="bg-primary-container/70 border-primary-container text-on-primary/90 flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2 text-xs"
          >
            <div class="flex items-center gap-2">
              <svg
                lucideCalendar
                [size]="15"
                class="text-secondary-fixed shrink-0"
                aria-hidden="true"
              ></svg>
              @if (currentCycle(); as cycle) {
                <span>
                  Ciclo: <strong>{{ cycle.startDate | date: 'dd/MM' }}</strong> a
                  <strong>{{ cycle.endDate | date: 'dd/MM/yyyy' }}</strong>
                  <span
                    class="ml-2 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                    [class]="
                      cycle.status === 'OPEN'
                        ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                        : 'bg-surface-variant text-on-surface-variant'
                    "
                  >
                    {{ cycle.status === 'OPEN' ? 'Aberto' : 'Fechado' }}
                  </span>
                </span>
              } @else {
                <span>Ciclo Semanal de Compras</span>
              }
            </div>

            @if (report(); as currentReport) {
              <span class="text-on-primary/70">
                Atualizado em {{ currentReport.generatedAt | date: 'dd/MM/yyyy HH:mm' }}
              </span>
            }
          </div>

          <p class="font-body-md text-caption text-on-primary/85 leading-snug">
            Soma matemática exata de todos os insumos solicitados pelas cozinhas (CEI, CCA e CJ)
            para cotação em atacado com fornecedores.
          </p>

          <!-- Footer Bar inside Header -->
          <div
            class="border-on-primary/15 flex items-center justify-between border-t pt-2.5 text-xs"
          >
            <span class="text-on-primary/80 truncate">
              Conectada como: <strong class="text-on-primary">{{ auth.userName() }}</strong>
            </span>

            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="reload()"
                [disabled]="loading()"
                class="hover:bg-on-primary/10 text-on-primary flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition-colors disabled:opacity-50"
              >
                <svg
                  lucideRefreshCw
                  [size]="14"
                  [class.animate-spin]="loading()"
                  aria-hidden="true"
                ></svg>
                <span>Atualizar</span>
              </button>

              <button
                type="button"
                (click)="onLogout()"
                class="hover:bg-on-primary/10 text-on-primary flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition-colors"
              >
                <svg lucideLogOut [size]="14" aria-hidden="true"></svg>
                <span>Sair</span>
              </button>
            </div>
          </div>
        </header>

        <!-- Search & Category Filter Pills -->
        <div class="mb-space-md flex flex-col gap-2.5">
          <div class="relative">
            <svg
              lucideSearch
              [size]="18"
              class="text-on-surface-variant pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2"
              aria-hidden="true"
            ></svg>
            <input
              type="search"
              [value]="searchQuery()"
              (input)="onSearchInput($event)"
              placeholder="Buscar insumo por nome..."
              aria-label="Buscar insumo na lista consolidada"
              class="bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/70 focus:ring-secondary/40 border-outline-variant/60 w-full rounded-xl border py-2.5 pr-10 pl-11 text-sm shadow-xs focus:ring-2 focus:outline-none"
            />
            @if (searchQuery()) {
              <button
                type="button"
                (click)="searchQuery.set('')"
                aria-label="Limpar busca"
                class="text-on-surface-variant hover:text-on-surface absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-md p-1"
              >
                <svg lucideX [size]="16" aria-hidden="true"></svg>
              </button>
            }
          </div>

          <!-- Category filter navigation -->
          @if (availableCategories().length > 0) {
            <nav
              aria-label="Filtrar por categoria"
              class="border-outline-variant/40 bg-surface/95 sticky top-0 z-20 -mx-3 border-b px-3 backdrop-blur-md"
            >
              <div class="no-scrollbar flex items-center gap-2 overflow-x-auto py-2">
                <button
                  type="button"
                  (click)="selectedCategory.set('all')"
                  [attr.aria-pressed]="selectedCategory() === 'all'"
                  class="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-150"
                  [class]="
                    selectedCategory() === 'all'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  "
                >
                  <span>Todas</span>
                  <span
                    class="py-0.2 rounded-full px-1.5 text-[10px]"
                    [class]="
                      selectedCategory() === 'all'
                        ? 'bg-on-primary/20 text-on-primary'
                        : 'bg-surface-container-high text-on-surface-variant'
                    "
                  >
                    {{ totalItemsCount() }}
                  </span>
                </button>

                @for (cat of availableCategories(); track cat.category) {
                  <button
                    type="button"
                    (click)="selectedCategory.set(cat.category)"
                    [attr.aria-pressed]="selectedCategory() === cat.category"
                    class="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-150"
                    [class]="
                      selectedCategory() === cat.category
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    "
                  >
                    <app-category-icon [category]="cat.category" [size]="14" />
                    <span>{{ cat.displayName }}</span>
                    <span
                      class="py-0.2 rounded-full px-1.5 text-[10px]"
                      [class]="
                        selectedCategory() === cat.category
                          ? 'bg-on-primary/20 text-on-primary'
                          : 'bg-surface-container-high text-on-surface-variant'
                      "
                    >
                      {{ cat.count }}
                    </span>
                  </button>
                }
              </div>
            </nav>
          }
        </div>

        <!-- Copy Feedback Banner -->
        @if (copiedToast()) {
          <div
            role="status"
            class="bg-tertiary-fixed text-on-tertiary-fixed mb-4 flex items-center justify-between rounded-xl px-4 py-2 text-xs font-semibold shadow-xs transition-all"
          >
            <div class="flex items-center gap-2">
              <svg lucideCheck [size]="16" aria-hidden="true"></svg>
              <span
                >Lista consolidada de insumos copiada com sucesso para a área de
                transferência!</span
              >
            </div>
            <button
              type="button"
              (click)="copiedToast.set(false)"
              aria-label="Fechar aviso"
              class="cursor-pointer hover:opacity-75"
            >
              <svg lucideX [size]="14" aria-hidden="true"></svg>
            </button>
          </div>
        }

        <!-- States & Grouped List -->
        @if (loading()) {
          <div
            class="p-space-xl text-on-surface-variant flex flex-1 flex-col items-center justify-center gap-3"
          >
            <svg
              lucideRefreshCw
              [size]="32"
              class="text-secondary animate-spin"
              aria-hidden="true"
            ></svg>
            <span class="font-body-md text-body-md font-medium"
              >Carregando lista consolidada...</span
            >
          </div>
        } @else if (error(); as errorMessage) {
          <div
            role="alert"
            class="border-error/30 bg-error-container/40 p-space-md text-on-error-container flex flex-col items-start gap-3 rounded-2xl border"
          >
            <div class="flex items-center gap-2 font-bold">
              <svg lucideCircleExclamationPoint [size]="20" aria-hidden="true"></svg>
              <span>Não foi possível carregar a consolidação</span>
            </div>
            <p class="text-sm">{{ errorMessage }}</p>
            <button
              type="button"
              (click)="reload()"
              class="bg-primary text-on-primary cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold transition-opacity hover:opacity-90"
            >
              Tentar novamente
            </button>
          </div>
        } @else if (noActiveCycle()) {
          <div
            class="bg-surface-container-low p-space-xl text-on-surface-variant flex flex-col items-center justify-center gap-3 rounded-2xl text-center"
          >
            <div
              class="bg-surface-container-high flex size-14 items-center justify-center rounded-2xl"
            >
              <svg lucideCalendar [size]="28" class="text-outline" aria-hidden="true"></svg>
            </div>
            <h2 class="font-headline-md text-headline-md text-on-surface font-bold">
              Nenhum ciclo de compras ativo no momento
            </h2>
            <p class="font-caption text-caption max-w-md">
              Não há ciclo semanal em aberto no sistema. Quando um novo ciclo for iniciado, as
              solicitações das cozinhas serão agrupadas e exibidas aqui.
            </p>
            <button
              type="button"
              (click)="reload()"
              class="bg-primary text-on-primary mt-2 cursor-pointer rounded-lg px-4 py-2 text-xs font-bold"
            >
              Verificar novamente
            </button>
          </div>
        } @else {
          <div class="gap-space-md flex flex-col">
            @for (group of groupedItems(); track group.category) {
              <section class="gap-space-xs flex flex-col">
                <!-- Category Section Header -->
                <div class="my-space-xs gap-space-xs px-space-xs flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <app-category-icon
                      [category]="group.category"
                      [size]="18"
                      class="text-secondary"
                    />
                    <h2
                      class="font-caption text-caption text-on-surface font-bold tracking-wider uppercase"
                    >
                      {{ group.categoryDisplayName }}
                    </h2>
                  </div>
                  <span class="text-on-surface-variant text-xs font-semibold">
                    {{ group.items.length }} {{ group.items.length === 1 ? 'item' : 'itens' }}
                  </span>
                </div>

                <!-- Product Cards in Category -->
                <div class="gap-space-xs flex flex-col">
                  @for (item of group.items; track item.productId) {
                    <article
                      class="bg-surface-container-lowest border-outline-variant/40 p-space-sm hover:border-outline-variant flex flex-col gap-2 rounded-xl border shadow-xs transition-colors"
                    >
                      <div class="flex items-center justify-between gap-3">
                        <span
                          class="font-body-md text-body-md text-on-surface truncate font-semibold"
                        >
                          {{ item.productName }}
                        </span>

                        <div
                          class="bg-secondary-fixed/70 text-on-secondary-fixed shrink-0 rounded-lg px-3 py-1 text-right"
                        >
                          <span class="font-label-numeric text-body-md font-bold">
                            {{ item.totalQuantity }}
                          </span>
                          <span class="font-caption text-caption ml-1 font-semibold">
                            {{ formatUnit(item.unitMeasure) }}
                          </span>
                        </div>
                      </div>

                      <!-- Service / Kitchen Breakdown Chips -->
                      @if (item.breakdown && item.breakdown.length > 0) {
                        <div
                          class="border-outline-variant/25 flex flex-wrap items-center gap-1.5 border-t pt-1.5 text-xs"
                        >
                          <span class="text-on-surface-variant/80 text-[11px] font-medium">
                            Por cozinha:
                          </span>
                          @for (b of item.breakdown; track b.serviceCode) {
                            <span
                              class="bg-surface-container-low text-on-surface-variant rounded-md px-2 py-0.5 text-[11px] font-medium"
                            >
                              <strong class="text-on-surface font-bold"
                                >{{ b.serviceCode }}:</strong
                              >
                              {{ b.quantity }} {{ formatUnit(item.unitMeasure) }}
                            </span>
                          }
                        </div>
                      }
                    </article>
                  }
                </div>
              </section>
            } @empty {
              <div
                class="bg-surface-container-low p-space-lg text-on-surface-variant flex flex-col items-center justify-center gap-2 rounded-2xl text-center"
              >
                <div
                  class="bg-surface-container-high flex size-12 items-center justify-center rounded-xl"
                >
                  <svg lucidePackageOpen [size]="24" class="text-outline" aria-hidden="true"></svg>
                </div>
                <p class="font-headline-md text-body-lg text-on-surface font-bold">
                  Nenhum insumo encontrado
                </p>
                <p class="font-caption text-caption max-w-md">
                  @if (searchQuery() || selectedCategory() !== 'all') {
                    Nenhum insumo corresponde aos filtros selecionados.
                  } @else {
                    Ainda não há solicitações registradas pelas cozinhas para este ciclo de compras.
                  }
                </p>
                @if (searchQuery() || selectedCategory() !== 'all') {
                  <button
                    type="button"
                    (click)="clearFilters()"
                    class="bg-primary text-on-primary mt-2 cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold"
                  >
                    Limpar filtros
                  </button>
                }
              </div>
            }
          </div>
        }
      </main>
    </div>
  `,
})
export class ConsolidationPage implements OnInit {
  private readonly consolidationService = inject(Consolidation);
  private readonly cycleService = inject(Cycle);
  protected readonly auth = inject(Auth);
  private readonly router = inject(Router);

  readonly cycleId = input<string>();

  protected readonly report = signal<ConsolidatedReport | null>(null);
  protected readonly currentCycle = signal<WeeklyCycle | null>(null);
  protected readonly loading = signal(false);
  protected readonly noActiveCycle = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly searchQuery = signal('');
  protected readonly selectedCategory = signal<string>('all');
  protected readonly copiedToast = signal(false);

  private readonly resolvedCycleId = computed(
    () => this.cycleId() ?? this.currentCycle()?.id ?? this.cycleService.currentCycle()?.id ?? null,
  );

  protected readonly totalItemsCount = computed(() => this.report()?.items.length ?? 0);

  protected readonly availableCategories = computed(() => {
    const items = this.report()?.items ?? [];
    const countsMap = new Map<string, number>();

    for (const item of items) {
      const catKey = (item.category as string) || 'OUTROS';
      countsMap.set(catKey, (countsMap.get(catKey) ?? 0) + 1);
    }

    return Array.from(countsMap.entries()).map(([category, count]) => ({
      category,
      displayName: CATEGORY_LABELS[category] ?? 'Outros',
      count,
    }));
  });

  protected readonly groupedItems = computed<ConsolidatedCategoryGroup[]>(() => {
    const items = this.report()?.items ?? [];
    const category = this.selectedCategory();
    const query = this.searchQuery().toLowerCase().trim();

    const filtered = items.filter((item: ConsolidatedItem) => {
      const matchesCategory = category === 'all' || item.category === category;
      const matchesSearch = !query || item.productName.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });

    const groupsMap = new Map<string, ConsolidatedCategoryGroup>();

    for (const item of filtered) {
      const catKey = (item.category as string) || 'OUTROS';
      if (!groupsMap.has(catKey)) {
        groupsMap.set(catKey, {
          category: catKey,
          categoryDisplayName: CATEGORY_LABELS[catKey] ?? 'Outros',
          items: [],
        });
      }
      groupsMap.get(catKey)!.items.push(item);
    }

    return Array.from(groupsMap.values());
  });

  constructor() {
    effect(() => {
      const id = this.resolvedCycleId();
      if (id) {
        this.fetchReport(id);
      }
    });
  }

  ngOnInit(): void {
    if (!this.cycleId()) {
      this.resolveActiveCycle();
    }
  }

  protected onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  protected clearFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('all');
  }

  protected reload(): void {
    if (this.cycleId()) {
      this.fetchReport(this.cycleId()!);
    } else {
      this.resolveActiveCycle();
    }
  }

  protected formatUnit(unit: string): string {
    return UNIT_MEASURE_LABELS[unit] ?? unit;
  }

  protected copyConsolidatedList(): void {
    const rep = this.report();
    if (!rep || rep.items.length === 0) return;

    const cycleInfo = this.currentCycle()
      ? `Ciclo: ${this.currentCycle()!.startDate} a ${this.currentCycle()!.endDate}`
      : `Ciclo: ${rep.cycleId}`;

    const lines: string[] = [
      `*CONSOLIDA IAG — LISTA CONSOLIDADA DE COMPRAS*`,
      `${cycleInfo}`,
      `Total de insumos: ${rep.totalProductsCount}`,
      `Gerado em: ${new Date(rep.generatedAt).toLocaleString('pt-BR')}`,
      `----------------------------------------`,
    ];

    for (const group of this.groupedItems()) {
      lines.push(`\n[${group.categoryDisplayName.toUpperCase()}]`);
      for (const item of group.items) {
        const unit = this.formatUnit(item.unitMeasure);
        let line = `• ${item.productName}: ${item.totalQuantity} ${unit}`;
        if (item.breakdown && item.breakdown.length > 0) {
          const breakdownStr = item.breakdown
            .map((b) => `${b.serviceCode}: ${b.quantity} ${unit}`)
            .join(' + ');
          line += ` (${breakdownStr})`;
        }
        lines.push(line);
      }
    }

    lines.push(`\n----------------------------------------`);
    lines.push(`Instituto Anchieta Grajaú &bull; Totem de Pedidos`);

    const textToCopy = lines.join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
      this.copiedToast.set(true);
      setTimeout(() => this.copiedToast.set(false), 3500);
    });
  }

  protected async onLogout(): Promise<void> {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }

  private resolveActiveCycle(): void {
    this.loading.set(true);
    this.error.set(null);
    this.noActiveCycle.set(false);

    this.cycleService.consultActiveCycle().subscribe({
      next: (active) => {
        if (active) {
          this.currentCycle.set(active);
          this.fetchReport(active.id);
        } else {
          this.loading.set(false);
          this.noActiveCycle.set(true);
          this.report.set(null);
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Falha ao consultar ciclo de compras ativo.');
      },
    });
  }

  private fetchReport(cycleId: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.noActiveCycle.set(false);

    this.consolidationService.getConsolidatedReport(cycleId).subscribe({
      next: (data) => {
        this.report.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        const message =
          err.error?.detail ||
          err.error?.message ||
          'Erro ao buscar o relatório consolidado do ciclo.';
        this.error.set(message);
        this.report.set(null);
        this.loading.set(false);
      },
    });
  }
}

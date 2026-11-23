import { computed, Service, signal } from '@angular/core';
import { CatalogProduct } from '../catalog/product.model';
import {
  CartItem,
  EditWeeklyRequestPayload,
  INSTITUTIONAL_SERVICES,
  RequestItemPayload,
  ServiceCode,
  SubmitWeeklyRequestPayload,
  WeeklyRequestDetailsResponse,
} from './weekly-request.model';

@Service()
export class TotemCartState {
  private readonly _activeService = signal<ServiceCode>(ServiceCode.CEI);
  readonly activeService = this._activeService.asReadonly();

  readonly activeServiceDetail = computed(() => INSTITUTIONAL_SERVICES[this._activeService()]);

  private readonly _activeRequestId = signal<string | null>(null);
  readonly activeRequestId = this._activeRequestId.asReadonly();
  readonly isEditMode = computed(() => this._activeRequestId() !== null);

  private readonly _quantities = signal<Record<string, number>>({});
  readonly quantities = this._quantities.asReadonly();

  private readonly _observation = signal<string>('');
  readonly observation = this._observation.asReadonly();

  readonly isLoadingRequest = signal<boolean>(false);
  readonly isConfirmModalOpen = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);

  private readonly _conflictError = signal<string | null>(null);
  readonly conflictError = this._conflictError.asReadonly();

  private readonly _toastSuccess = signal<string | null>(null);
  readonly toastSuccess = this._toastSuccess.asReadonly();

  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  readonly totalItemsCount = computed(() => {
    const map = this._quantities();
    return Object.values(map).filter((quantity) => quantity > 0).length;
  });

  readonly totalUnits = computed(() => {
    const map = this._quantities();
    return Object.values(map).reduce((sum, quantity) => sum + (quantity > 0 ? quantity : 0), 0);
  });

  readonly hasSelectedItems = computed(() => this.totalItemsCount() > 0);

  readonly canSubmit = computed(() => {
    return !this.isSubmitting() && !this.isLoadingRequest() && this.hasSelectedItems();
  });

  setService(code: ServiceCode): void {
    if (this._activeService() !== code) {
      this._activeService.set(code);
      this.reset();
    }
  }

  hydrateExistingRequest(request: WeeklyRequestDetailsResponse | null): void {
    if (!request) {
      this._activeRequestId.set(null);
      this._quantities.set({});
      this._observation.set('');
      this._conflictError.set(null);
      return;
    }

    const hydratedQuantities: Record<string, number> = {};
    for (const item of request.items) {
      if (item.quantity > 0) {
        hydratedQuantities[item.productId] = Number(item.quantity);
      }
    }

    this._activeRequestId.set(request.id);
    this._quantities.set(hydratedQuantities);
    this._observation.set(request.observation ?? '');
    this._conflictError.set(null);
  }

  markAsSubmitted(requestId: string): void {
    this._activeRequestId.set(requestId);
    this._conflictError.set(null);
  }

  getQuantity(productId: string): number {
    return this._quantities()[productId] ?? 0;
  }

  increment(productId: string): void {
    const current = this.getQuantity(productId);
    this.setQuantity(productId, current + 1);
  }

  decrement(productId: string): void {
    const current = this.getQuantity(productId);
    if (current > 0) {
      this.setQuantity(productId, current - 1);
    }
  }

  setQuantity(productId: string, quantity: number): void {
    const sanitized = Math.max(0, Math.floor(quantity));
    this._quantities.update((prev) => {
      if (sanitized === 0) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: sanitized };
    });
  }

  setObservation(value: string): void {
    this._observation.set(value);
  }

  getSelectedItemsSummary(products: CatalogProduct[]): CartItem[] {
    const map = this._quantities();
    const selected: CartItem[] = [];

    for (const product of products) {
      const quantity = map[product.id] ?? 0;
      if (quantity > 0) {
        selected.push({ product, quantity: quantity });
      }
    }

    return selected;
  }

  buildSubmissionPayload(): SubmitWeeklyRequestPayload {
    const obs = this._observation().trim();
    return {
      serviceCode: this._activeService(),
      observation: obs.length > 0 ? obs : undefined,
      items: this.buildValidItems(),
    };
  }

  buildEditPayload(): EditWeeklyRequestPayload {
    const obs = this._observation().trim();
    return {
      observation: obs.length > 0 ? obs : undefined,
      items: this.buildValidItems(),
    };
  }

  openConfirmModal(): void {
    if (this.hasSelectedItems()) {
      this._conflictError.set(null);
      this.isConfirmModalOpen.set(true);
    }
  }

  closeConfirmModal(): void {
    this.isConfirmModalOpen.set(false);
  }

  setConflictError(message: string | null): void {
    this._conflictError.set(message);
  }

  showToast(message: string): void {
    this._toastSuccess.set(message);
    if (this.toastTimer !== null) {
      clearTimeout(this.toastTimer);
    }
    this.toastTimer = setTimeout(() => {
      this._toastSuccess.set(null);
    }, 4500);
  }

  reset(): void {
    this._activeRequestId.set(null);
    this._quantities.set({});
    this._observation.set('');
    this._conflictError.set(null);
    this.isConfirmModalOpen.set(false);
    this.isSubmitting.set(false);
  }

  private buildValidItems(): RequestItemPayload[] {
    return Object.entries(this._quantities())
      .filter(([, quantity]) => quantity > 0)
      .map(([productId, quantity]) => ({ productId, quantity }));
  }
}

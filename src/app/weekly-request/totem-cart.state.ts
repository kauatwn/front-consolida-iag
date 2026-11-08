import { computed, Service, signal } from '@angular/core';
import { CatalogProduct } from '../catalog/product.model';
import {
  CartItem,
  INSTITUTIONAL_SERVICES,
  RequestItemPayload,
  ServiceCode,
  SubmitWeeklyRequestPayload,
} from './weekly-request.model';

@Service()
export class TotemCartState {
  /**
   * Active Cost Center / Service (CEI, CCA, CJ)
   */
  readonly selectedService = signal<ServiceCode>('CEI');

  /**
   * Map of Product ID to requested quantity
   */
  private readonly _quantities = signal<Record<string, number>>({});
  readonly quantities = this._quantities.asReadonly();

  /**
   * Free-text observation for emergency or non-cataloged needs (RN-02.3)
   */
  readonly observation = signal<string>('');

  /**
   * UI State for confirmation dialog and feedback
   */
  readonly isConfirmModalOpen = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);
  readonly toastSuccess = signal<string | null>(null);
  readonly conflictError = signal<string | null>(null);

  /**
   * Active Service Detail
   */
  readonly activeServiceDetail = computed(() => {
    return INSTITUTIONAL_SERVICES[this.selectedService()];
  });

  /**
   * Count of distinct catalog products with quantity > 0 (RN-02.2)
   */
  readonly totalItemsCount = computed(() => {
    const q = this._quantities();
    return Object.values(q).filter((val) => val > 0).length;
  });

  /**
   * Total mathematical sum of all requested quantities
   */
  readonly totalUnits = computed(() => {
    const q = this._quantities();
    const sum = Object.values(q).reduce((acc, curr) => (curr > 0 ? acc + curr : acc), 0);
    return Math.round(sum * 100) / 100;
  });

  /**
   * True if at least one product has quantity > 0 (RN-02.2)
   */
  readonly hasSelectedItems = computed(() => this.totalItemsCount() > 0);

  /**
   * True if ready for submission
   */
  readonly canSubmit = computed(() => this.hasSelectedItems() && !this.isSubmitting());

  /**
   * Updates or sets quantity for a specific product
   */
  setQuantity(productId: string, quantity: number): void {
    const sanitized = Math.max(0, Math.round(quantity * 100) / 100);
    this._quantities.update((prev) => ({
      ...prev,
      [productId]: sanitized,
    }));
  }

  /**
   * Increments quantity by the product's step (or default 1)
   */
  increment(productId: string, step = 1): void {
    const current = this.getQuantity(productId);
    this.setQuantity(productId, current + step);
  }

  /**
   * Decrements quantity by step, preventing negative values
   */
  decrement(productId: string, step = 1): void {
    const current = this.getQuantity(productId);
    if (current > 0) {
      this.setQuantity(productId, Math.max(0, current - step));
    }
  }

  /**
   * Gets current quantity for a product (default 0)
   */
  getQuantity(productId: string): number {
    return this._quantities()[productId] ?? 0;
  }

  /**
   * Updates the observation note
   */
  setObservation(text: string): void {
    this.observation.set(text);
  }

  /**
   * Switches the active cost center (CEI, CCA, CJ)
   */
  setService(service: ServiceCode): void {
    this.selectedService.set(service);
    this.conflictError.set(null);
  }

  /**
   * Opens the confirmation modal
   */
  openConfirmModal(): void {
    if (this.hasSelectedItems()) {
      this.isConfirmModalOpen.set(true);
    }
  }

  /**
   * Closes the confirmation modal
   */
  closeConfirmModal(): void {
    this.isConfirmModalOpen.set(false);
  }

  /**
   * Prepares the filtered payload conforming to API contracts:
   * Only items with quantity > 0 (RN-02.2)
   */
  buildSubmissionPayload(): SubmitWeeklyRequestPayload {
    const q = this._quantities();
    const items: RequestItemPayload[] = Object.entries(q)
      .filter(([, qty]) => qty > 0)
      .map(([productId, quantity]) => ({
        productId,
        quantity,
      }));

    return {
      serviceCode: this.selectedService(),
      observation: this.observation().trim() || undefined,
      items,
    };
  }

  /**
   * Returns selected items paired with their CatalogProduct definitions
   */
  getSelectedItemsSummary(catalogProducts: CatalogProduct[]): CartItem[] {
    const q = this._quantities();
    const productsMap = new Map(catalogProducts.map((p) => [p.id, p]));
    const result: CartItem[] = [];

    for (const [productId, qty] of Object.entries(q)) {
      if (qty > 0) {
        const prod = productsMap.get(productId);
        if (prod) {
          result.push({
            product: prod,
            quantity: qty,
          });
        }
      }
    }

    return result;
  }

  /**
   * Resets all quantities and observations (e.g. after successful order)
   */
  reset(): void {
    this._quantities.set({});
    this.observation.set('');
    this.isConfirmModalOpen.set(false);
    this.isSubmitting.set(false);
    this.conflictError.set(null);
  }

  /**
   * Displays toast notification
   */
  showToast(message: string): void {
    this.toastSuccess.set(message);
    setTimeout(() => {
      this.toastSuccess.set(null);
    }, 4500);
  }

  setConflictError(message: string | null): void {
    this.conflictError.set(message);
  }
}

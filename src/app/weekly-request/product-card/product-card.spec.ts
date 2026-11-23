import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogProduct, ProductCategory, UnitMeasure } from '../../catalog/product.model';
import { ProductCard } from './product-card';

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;

  const mockProduct: CatalogProduct = {
    id: 'test-123',
    name: 'Arroz Agulhinha Tipo 1',
    unitMeasure: UnitMeasure.KG,
    category: ProductCategory.GRAOS_E_CEREAIS,
    categoryDisplayName: 'Grãos e Cereais',
    active: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.componentRef.setInput('quantity', 0);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the product name and unit measure', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Arroz Agulhinha Tipo 1');
    expect(compiled.textContent).toContain('Kg');
  });

  it('should emit increment when clicking the plus button', () => {
    let incrementCalled = false;
    component.increment.subscribe(() => {
      incrementCalled = true;
    });

    const plusBtn = fixture.nativeElement.querySelector(
      'button[aria-label="Aumentar Arroz Agulhinha Tipo 1"]',
    ) as HTMLButtonElement;

    plusBtn.click();
    expect(incrementCalled).toBeTrue();
  });

  it('should have decrement disabled when quantity is zero', () => {
    const minusBtn = fixture.nativeElement.querySelector(
      'button[aria-label="Diminuir Arroz Agulhinha Tipo 1"]',
    ) as HTMLButtonElement;

    expect(minusBtn.disabled).toBeTrue();
  });

  it('should emit decrement when clicking minus button and quantity > 0', () => {
    fixture.componentRef.setInput('quantity', 10);
    fixture.detectChanges();

    let decrementCalled = false;
    component.decrement.subscribe(() => {
      decrementCalled = true;
    });

    const minusBtn = fixture.nativeElement.querySelector(
      'button[aria-label="Diminuir Arroz Agulhinha Tipo 1"]',
    ) as HTMLButtonElement;

    expect(minusBtn.disabled).toBeFalse();
    minusBtn.click();
    expect(decrementCalled).toBeTrue();
  });

  it('should emit quantityChange when kitchen leader types directly in the input', () => {
    let emittedQty = -1;
    component.quantityChange.subscribe((qty) => {
      emittedQty = qty;
    });

    const inputEl = fixture.nativeElement.querySelector('input[type="number"]') as HTMLInputElement;

    inputEl.value = '25';
    inputEl.dispatchEvent(new Event('input'));

    expect(emittedQty).toBe(25);
  });
});

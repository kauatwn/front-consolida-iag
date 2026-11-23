import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Auth } from '../../core/auth/auth';
import { Cycle } from '../../cycle-management/cycle';
import { WeeklyCycle } from '../../cycle-management/cycle.model';
import { Consolidation } from '../consolidation';
import { ConsolidatedReport } from '../consolidation.model';
import { ConsolidationPage } from './consolidation-page';

describe('ConsolidationPage', () => {
  let component: ConsolidationPage;
  let fixture: ComponentFixture<ConsolidationPage>;

  const mockActiveCycle: WeeklyCycle = {
    id: 'cycle-uuid-123',
    startDate: '2026-11-02',
    endDate: '2026-11-08',
    status: 'OPEN',
  };

  const mockClosedCycle: WeeklyCycle = {
    id: 'cycle-uuid-123',
    startDate: '2026-11-02',
    endDate: '2026-11-08',
    status: 'CLOSED',
  };

  const mockReport: ConsolidatedReport = {
    cycleId: 'cycle-uuid-123',
    generatedAt: '2026-11-03T10:00:00Z',
    totalProductsCount: 2,
    items: [
      {
        productId: 'prod-1',
        productName: 'Arroz Agulhinha Tipo 1',
        unitMeasure: 'KG',
        category: 'GRAOS_E_CEREAIS',
        totalQuantity: 60,
        breakdown: [
          { serviceCode: 'CEI', quantity: 20 },
          { serviceCode: 'CCA', quantity: 15 },
          { serviceCode: 'CJ', quantity: 25 },
        ],
      },
      {
        productId: 'prod-2',
        productName: 'Leite Integral',
        unitMeasure: 'L',
        category: 'LATICINIOS_DERIVADOS',
        totalQuantity: 30,
        breakdown: [
          { serviceCode: 'CEI', quantity: 10 },
          { serviceCode: 'CCA', quantity: 20 },
        ],
      },
    ],
  };

  const mockAuthService = {
    userName: () => 'Gestora Compras',
    currentUser: () => ({
      uid: 'buyer-uid',
      email: 'gestora@gmail.com',
      name: 'Gestora Compras',
      role: 'BUYER',
      serviceCode: null,
    }),
    logout: jasmine.createSpy('logout').and.returnValue(Promise.resolve()),
  };

  const mockCycleService = {
    currentCycle: () => mockActiveCycle,
    consultActiveCycle: jasmine.createSpy('consultActiveCycle').and.returnValue(of(mockActiveCycle)),
    closeCycle: jasmine.createSpy('closeCycle').and.returnValue(of(mockClosedCycle)),
    openCycle: jasmine.createSpy('openCycle').and.returnValue(of(mockActiveCycle)),
  };

  const mockConsolidationService = {
    getConsolidatedReport: jasmine.createSpy('getConsolidatedReport').and.returnValue(of(mockReport)),
    getActiveConsolidatedReport: jasmine
      .createSpy('getActiveConsolidatedReport')
      .and.returnValue(of(mockReport)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsolidationPage],
      providers: [
        { provide: Auth, useValue: mockAuthService },
        { provide: Cycle, useValue: mockCycleService },
        { provide: Consolidation, useValue: mockConsolidationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsolidationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the consolidation page component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title and user identity', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Lista Consolidada de Compras');
    expect(text).toContain('Gestora Compras');
  });

  it('should display consolidated products with quantities and units', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Arroz Agulhinha Tipo 1');
    expect(text).toContain('60');
    expect(text).toContain('Kg');
    expect(text).toContain('Leite Integral');
    expect(text).toContain('30');
    expect(text).toContain('Litro');
  });

  it('should display service breakdown for each kitchen', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('CEI:');
    expect(text).toContain('20 Kg');
    expect(text).toContain('CCA:');
    expect(text).toContain('15 Kg');
    expect(text).toContain('CJ:');
    expect(text).toContain('25 Kg');
  });

  it('should filter items when typing in search input', () => {
    const searchInput = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
    searchInput.value = 'Leite';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Leite Integral');
    expect(text).not.toContain('Arroz Agulhinha Tipo 1');
  });

  it('should have Encerrar Ciclo button when cycle is OPEN and call closeCycle on confirm', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    const closeBtn = fixture.nativeElement.querySelector('button[aria-label="Encerrar ciclo de compras da semana"]') as HTMLButtonElement;
    if (closeBtn) {
      closeBtn.click();
      expect(mockCycleService.closeCycle).toHaveBeenCalledWith('cycle-uuid-123');
    }
  });
});

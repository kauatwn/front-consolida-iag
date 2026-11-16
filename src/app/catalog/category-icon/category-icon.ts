import { Component, input } from '@angular/core';
import {
  LucideApple,
  LucideBeef,
  LucideMilk,
  LucidePackage,
  LucideSparkles,
  LucideWheat,
} from '@lucide/angular';
import { ProductCategory } from '../product.model';

@Component({
  imports: [LucideWheat, LucideApple, LucideBeef, LucideMilk, LucideSparkles, LucidePackage],
  selector: 'app-category-icon',
  styles: ``,
  host: {
    class: 'inline-flex shrink-0 items-center justify-center',
  },
  template: `@switch (category()) {
    @case (ProductCategory.GRAOS_E_CEREAIS) {
      <svg lucideWheat [size]="size()" aria-hidden="true"></svg>
    }
    @case (ProductCategory.HORTIFRUTI_FRESCOS) {
      <svg lucideApple [size]="size()" aria-hidden="true"></svg>
    }
    @case (ProductCategory.PROTEINAS_CARNES) {
      <svg lucideBeef [size]="size()" aria-hidden="true"></svg>
    }
    @case (ProductCategory.LATICINIOS_MATINAIS) {
      <svg lucideMilk [size]="size()" aria-hidden="true"></svg>
    }
    @case (ProductCategory.HIGIENE_COZINHA) {
      <svg lucideSparkles [size]="size()" aria-hidden="true"></svg>
    }
    @default {
      <svg lucidePackage [size]="size()" aria-hidden="true"></svg>
    }
  }`,
})
export class CategoryIcon {
  readonly category = input.required<ProductCategory | string>();
  readonly size = input<number>(20);

  protected readonly ProductCategory = ProductCategory;
}

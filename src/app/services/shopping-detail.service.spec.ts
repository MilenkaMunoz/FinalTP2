import { TestBed } from '@angular/core/testing';

import { ShoppingDetailService } from './shopping-detail.service';

describe('ShoppingDetailService', () => {
  let service: ShoppingDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoppingDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

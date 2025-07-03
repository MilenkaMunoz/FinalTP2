import { SaleDetail } from './sale-detail.interface';

export interface Sale {
  saleId?: number;
  saleCode: string;
  clientId: number;
  clientName: string;
  paymentMethod: string;
  remarks: string;
  status: string;
  details: SaleDetail[];
}

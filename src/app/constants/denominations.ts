import { Denomination } from '../models/bill.model';

export const DENOMINATIONS_SMALL: Denomination[] = [
  { value: 10,  cssClass: 'bill-10'  },
  { value: 20,  cssClass: 'bill-20'  },
  { value: 50,  cssClass: 'bill-50'  },
];

export const DENOMINATIONS_LARGE: Denomination[] = [
  { value: 100, cssClass: 'bill-100' },
  { value: 200, cssClass: 'bill-200' },
];

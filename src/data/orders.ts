import type { Order } from './types';

/**
 * Pedidos simulados de los 4 canales de venta de Masecor
 * Representan pedidos pendientes de preparación (picking) en el almacén
 */
export const orders: Order[] = [
  // ── INOXAR E-Commerce (B2C) ──
  {
    id: 'ord-001',
    orderNumber: 'INX-2026-00847',
    channel: 'INOXAR_ECOMMERCE',
    status: 'CONFIRMED',
    customerName: 'María García',
    customerCity: 'Rosario, Santa Fe',
    items: [
      {
        productVariantId: 'pv-001',
        productName: 'Bacha GEMA XL Premium',
        sku: 'MAS-PREM-GEMA-XL',
        quantity: 1,
        unitPrice: 196660,
        picked: false,
      },
      {
        productVariantId: 'pv-013',
        productName: 'Válvula de Desagüe 3½"',
        sku: 'MAS-ACC-VALVULA',
        quantity: 1,
        unitPrice: 8900,
        picked: false,
      },
    ],
    totalAmount: 205560,
    shippingCarrier: 'Andreani',
    trackingNumber: null,
    createdAt: '2026-06-15T08:23:00Z',
  },
  {
    id: 'ord-002',
    orderNumber: 'INX-2026-00848',
    channel: 'INOXAR_ECOMMERCE',
    status: 'CONFIRMED',
    customerName: 'Pablo Fernández',
    customerCity: 'CABA, Buenos Aires',
    items: [
      {
        productVariantId: 'pv-005',
        productName: 'Mesada Prisma Izquierda 100cm',
        sku: 'MAS-PRIS-IZQ-100',
        quantity: 1,
        unitPrice: 330000,
        picked: false,
      },
      {
        productVariantId: 'pv-013',
        productName: 'Válvula de Desagüe 3½"',
        sku: 'MAS-ACC-VALVULA',
        quantity: 1,
        unitPrice: 8900,
        picked: false,
      },
      {
        productVariantId: 'pv-014',
        productName: 'Sifón Flexible 40mm',
        sku: 'MAS-ACC-SIFON',
        quantity: 1,
        unitPrice: 6500,
        picked: false,
      },
    ],
    totalAmount: 345400,
    shippingCarrier: 'OCA',
    trackingNumber: null,
    createdAt: '2026-06-15T09:12:00Z',
  },

  // ── INOXAR en Mercado Libre (B2C Marketplace) ──
  {
    id: 'ord-003',
    orderNumber: 'ML-5678901234',
    channel: 'INOXAR_MELI',
    status: 'CONFIRMED',
    customerName: 'Lucas Martínez',
    customerCity: 'Mendoza, Mendoza',
    items: [
      {
        productVariantId: 'pv-002',
        productName: 'Bacha GEMA Standard',
        sku: 'MAS-PREM-GEMA-STD',
        quantity: 2,
        unitPrice: 149990,
        picked: false,
      },
    ],
    totalAmount: 299980,
    shippingCarrier: 'Correo Argentino',
    trackingNumber: null,
    createdAt: '2026-06-15T07:45:00Z',
  },
  {
    id: 'ord-004',
    orderNumber: 'ML-5678901289',
    channel: 'INOXAR_MELI',
    status: 'PICKING',
    customerName: 'Sofía López',
    customerCity: 'Córdoba, Córdoba',
    items: [
      {
        productVariantId: 'pv-011',
        productName: 'Pileta de Lavadero Simple',
        sku: 'MAS-LAV-SIMPLE',
        quantity: 1,
        unitPrice: 125000,
        picked: true,
      },
    ],
    totalAmount: 125000,
    shippingCarrier: 'Correo Argentino',
    trackingNumber: null,
    createdAt: '2026-06-14T22:10:00Z',
  },

  // ── MASECOR Mayorista (B2B) ──
  {
    id: 'ord-005',
    orderNumber: 'MAS-W-2026-0412',
    channel: 'MASECOR_WHOLESALE',
    status: 'CONFIRMED',
    customerName: 'Ferretería San Martín S.R.L.',
    customerCity: 'Tucumán, Tucumán',
    items: [
      {
        productVariantId: 'pv-008',
        productName: 'Mesada Standard Simple 80cm',
        sku: 'MAS-STD-SIMPLE-80',
        quantity: 20,
        unitPrice: 136000,
        picked: false,
      },
      {
        productVariantId: 'pv-009',
        productName: 'Mesada Standard Izquierda 120cm',
        sku: 'MAS-STD-IZQ-120',
        quantity: 10,
        unitPrice: 172000,
        picked: false,
      },
      {
        productVariantId: 'pv-015',
        productName: 'Kit Grampas de Fijación (x4)',
        sku: 'MAS-ACC-GRAMPA',
        quantity: 30,
        unitPrice: 3360,
        picked: false,
      },
    ],
    totalAmount: 4540800,
    shippingCarrier: 'Flete Mayorista',
    trackingNumber: null,
    createdAt: '2026-06-14T14:30:00Z',
  },
  {
    id: 'ord-006',
    orderNumber: 'MAS-W-2026-0413',
    channel: 'MASECOR_WHOLESALE',
    status: 'PACKED',
    customerName: 'Distribuidora Norte SAS',
    customerCity: 'Salta, Salta',
    items: [
      {
        productVariantId: 'pv-004',
        productName: 'Mesada Prisma Simple 80cm',
        sku: 'MAS-PRIS-SIMPLE-80',
        quantity: 5,
        unitPrice: 220000,
        picked: true,
      },
    ],
    totalAmount: 1100000,
    shippingCarrier: 'Flete Mayorista',
    trackingNumber: 'FM-CBA-2026-8891',
    createdAt: '2026-06-13T10:00:00Z',
  },

  // ── POS (Punto de Venta Físico) ──
  {
    id: 'ord-007',
    orderNumber: 'POS-2026-1523',
    channel: 'MASECOR_POS',
    status: 'CONFIRMED',
    customerName: 'Cliente Mostrador',
    customerCity: 'Córdoba, Córdoba',
    items: [
      {
        productVariantId: 'pv-003',
        productName: 'Bacha ÓNIX Premium',
        sku: 'MAS-PREM-ONIX',
        quantity: 1,
        unitPrice: 210000,
        picked: false,
      },
    ],
    totalAmount: 210000,
    shippingCarrier: 'Retira en Fábrica',
    trackingNumber: null,
    createdAt: '2026-06-15T10:05:00Z',
  },
];

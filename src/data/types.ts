/* ============================================================
   Tipos del Módulo de Almacén
   Basado en el modelo de datos de ECOSYSTEM_ARCHITECTURE.md
   ============================================================ */

export type ProductLine = 'Premium' | 'Prisma' | 'Standard' | 'Lavadero' | 'Accesorios';
export type ProductCategory = 'Bacha' | 'Mesada' | 'Accesorio';
export type BowlPosition = 'Simple' | 'Doble' | 'Izquierda' | 'Derecha' | 'Centro' | 'N/A';

export type StockStatus = 'ok' | 'low' | 'critical' | 'out';
export type MovementType = 'SALE' | 'PRODUCTION' | 'ADJUSTMENT' | 'RETURN' | 'TRANSFER';
export type MovementSource =
  | 'inoxar-ecommerce'
  | 'inoxar-meli'
  | 'masecor-wholesale'
  | 'fabrica'
  | 'ajuste-manual'
  | 'devolucion';

export type OrderChannel = 'INOXAR_ECOMMERCE' | 'INOXAR_MELI' | 'MASECOR_WHOLESALE' | 'MASECOR_POS';
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PICKING'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';
export type ShippingCarrier = 'Andreani' | 'OCA' | 'Correo Argentino' | 'Flete Mayorista' | 'Retira en Fábrica';

export type ReturnStatus = 'PENDING_INSPECTION' | 'APPROVED_RESTOCK' | 'APPROVED_SCRAP' | 'REJECTED';
export type ReturnReason = 'Daño en transporte' | 'Producto incorrecto' | 'Defecto de fábrica' | 'Rayones' | 'Otro';

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  line: ProductLine;
  category: ProductCategory;
  bowlPosition: BowlPosition;
  dimensions: string;        // ej. "80x50 cm"
  material: string;          // ej. "Acero Inoxidable AISI 304"
  stock: number;             // stock físico total
  reserved: number;          // reservado por pedidos pendientes
  available: number;         // stock - reserved
  minStock: number;          // stock mínimo antes de alerta
  costPrice: number;         // costo de producción en ARS
  price: number;             // precio base de venta en ARS
  location: string;          // ej. "Pasillo A - Estante 3"
  imageUrl: string;          // URL placeholder de producto
}

export interface StockMovement {
  id: string;
  productVariantId: string;
  productName: string;
  type: MovementType;
  source: MovementSource;
  quantity: number;           // positivo = ingreso, negativo = egreso
  previousStock: number;
  newStock: number;
  reference: string;          // ID del pedido, orden de producción, etc.
  notes: string;
  createdAt: string;          // ISO date
  createdBy: string;
}

export interface Order {
  id: string;
  orderNumber: string;       // ej. "INX-2026-00123"
  channel: OrderChannel;
  status: OrderStatus;
  customerName: string;
  customerCity: string;
  items: OrderItem[];
  totalAmount: number;
  shippingCarrier: ShippingCarrier;
  trackingNumber: string | null;
  createdAt: string;
}

export interface OrderItem {
  productVariantId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  picked: boolean;            // true cuando el operario lo recolectó
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  productVariantId: string;
  productName: string;
  sku: string;
  quantity: number;
  reason: ReturnReason;
  status: ReturnStatus;
  notes: string;
  inspectedBy: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

export interface RawMaterial {
  id: string;
  name: string;
  unit: string;               // ej. "kg", "metros", "unidades"
  currentStock: number;
  minStock: number;
  costPerUnit: number;        // ARS
  supplier: string;
  lastRestock: string;        // ISO date
}

export interface EventFeedItem {
  id: string;
  type: 'sale' | 'production' | 'alert' | 'return' | 'adjustment';
  message: string;
  channel?: OrderChannel;
  timestamp: string;
}

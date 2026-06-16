import { create } from 'zustand';
import type {
  ProductVariant,
  StockMovement,
  Order,
  ReturnRequest,
  RawMaterial,
  EventFeedItem,
  MovementType,
  MovementSource,
  ReturnStatus,
  OrderStatus,
} from '../data/types';
import { products as initialProducts } from '../data/products';
import { rawMaterials as initialRawMaterials } from '../data/rawMaterials';
import { orders as initialOrders } from '../data/orders';
import { movements as initialMovements } from '../data/movements';
import { returns as initialReturns } from '../data/returns';

export type ActiveView =
  | 'dashboard'
  | 'inventory'
  | 'movements'
  | 'picking'
  | 'returns'
  | 'raw-materials';

interface InventoryState {
  // Navigation
  activeView: ActiveView;
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  setActiveView: (view: ActiveView) => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;

  // Data
  products: ProductVariant[];
  movements: StockMovement[];
  orders: Order[];
  returns: ReturnRequest[];
  rawMaterials: RawMaterial[];
  eventFeed: EventFeedItem[];

  // Actions
  adjustStock: (
    productId: string,
    quantity: number,
    notes: string,
    createdBy: string
  ) => void;

  togglePickItem: (orderId: string, itemIndex: number) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  resolveReturn: (returnId: string, status: ReturnStatus, inspectedBy: string) => void;
}

// Generate simulated event feed
const generateEventFeed = (): EventFeedItem[] => [
  {
    id: 'evt-001',
    type: 'sale',
    message: 'Nueva venta Inoxar: -1 Bacha GEMA XL Premium',
    channel: 'INOXAR_ECOMMERCE',
    timestamp: '2026-06-15T10:23:00Z',
  },
  {
    id: 'evt-002',
    type: 'sale',
    message: 'Venta Mercado Libre: -2 Bacha GEMA Standard',
    channel: 'INOXAR_MELI',
    timestamp: '2026-06-15T10:15:00Z',
  },
  {
    id: 'evt-003',
    type: 'production',
    message: 'Fábrica completó orden: +30 Mesada Standard Simple 80cm',
    timestamp: '2026-06-15T10:00:00Z',
  },
  {
    id: 'evt-004',
    type: 'alert',
    message: '⚠ Stock Crítico: Bobina Acero AISI 304 1.2mm bajo mínimo (450/600 kg)',
    timestamp: '2026-06-15T09:45:00Z',
  },
  {
    id: 'evt-005',
    type: 'sale',
    message: 'Pedido Mayorista: Ferretería San Martín — 30 unidades (pallet)',
    channel: 'MASECOR_WHOLESALE',
    timestamp: '2026-06-15T09:30:00Z',
  },
  {
    id: 'evt-006',
    type: 'return',
    message: 'Devolución recibida: Bacha GEMA XL — Daño en transporte',
    timestamp: '2026-06-15T09:15:00Z',
  },
  {
    id: 'evt-007',
    type: 'alert',
    message: '⚠ Stock Bajo Mínimo: Mesada Prisma Doble 120cm (5/10 uds)',
    timestamp: '2026-06-15T09:00:00Z',
  },
  {
    id: 'evt-008',
    type: 'adjustment',
    message: 'Ajuste manual: -2 Bacha ÓNIX Premium (scrap soldadura defectuosa)',
    timestamp: '2026-06-15T08:45:00Z',
  },
  {
    id: 'evt-009',
    type: 'sale',
    message: 'Venta POS Mostrador: -1 Bacha ÓNIX Premium',
    channel: 'MASECOR_POS',
    timestamp: '2026-06-15T08:30:00Z',
  },
  {
    id: 'evt-010',
    type: 'production',
    message: 'Fábrica completó orden: +10 Mesada Prisma Doble 120cm',
    timestamp: '2026-06-15T08:00:00Z',
  },
];

export const useInventoryStore = create<InventoryState>((set) => ({
  // Navigation
  activeView: 'dashboard',
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  setActiveView: (view) => set({ activeView: view }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  // Data
  products: initialProducts,
  movements: initialMovements,
  orders: initialOrders,
  returns: initialReturns,
  rawMaterials: initialRawMaterials,
  eventFeed: generateEventFeed(),

  // Actions
  adjustStock: (productId, quantity, notes, createdBy) =>
    set((state) => {
      const product = state.products.find((p) => p.id === productId);
      if (!product) return state;

      const previousStock = product.stock;
      const newStock = previousStock + quantity;

      const updatedProducts = state.products.map((p) =>
        p.id === productId
          ? { ...p, stock: newStock, available: newStock - p.reserved }
          : p
      );

      const newMovement: StockMovement = {
        id: `mov-${Date.now()}`,
        productVariantId: productId,
        productName: product.name,
        type: 'ADJUSTMENT' as MovementType,
        source: 'ajuste-manual' as MovementSource,
        quantity,
        previousStock,
        newStock,
        reference: `AJ-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
        notes,
        createdAt: new Date().toISOString(),
        createdBy,
      };

      const newEvent: EventFeedItem = {
        id: `evt-${Date.now()}`,
        type: 'adjustment',
        message: `Ajuste manual: ${quantity > 0 ? '+' : ''}${quantity} ${product.name}`,
        timestamp: new Date().toISOString(),
      };

      return {
        products: updatedProducts,
        movements: [newMovement, ...state.movements],
        eventFeed: [newEvent, ...state.eventFeed],
      };
    }),

  togglePickItem: (orderId, itemIndex) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item, i) =>
                i === itemIndex ? { ...item, picked: !item.picked } : item
              ),
            }
          : order
      ),
    })),

  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      ),
    })),

  resolveReturn: (returnId, status, inspectedBy) =>
    set((state) => {
      const updatedReturns = state.returns.map((r) =>
        r.id === returnId
          ? {
              ...r,
              status,
              inspectedBy,
              resolvedAt: new Date().toISOString(),
            }
          : r
      );

      const ret = state.returns.find((r) => r.id === returnId);
      let updatedProducts = state.products;
      let newMovements = state.movements;
      const newEvents = [...state.eventFeed];

      // If approved for restock, add back to stock
      if (ret && status === 'APPROVED_RESTOCK') {
        updatedProducts = state.products.map((p) =>
          p.id === ret.productVariantId
            ? {
                ...p,
                stock: p.stock + ret.quantity,
                available: p.available + ret.quantity,
              }
            : p
        );
        const product = state.products.find((p) => p.id === ret.productVariantId);
        if (product) {
          newMovements = [
            {
              id: `mov-${Date.now()}`,
              productVariantId: ret.productVariantId,
              productName: ret.productName,
              type: 'RETURN' as MovementType,
              source: 'devolucion' as MovementSource,
              quantity: ret.quantity,
              previousStock: product.stock,
              newStock: product.stock + ret.quantity,
              reference: ret.orderNumber,
              notes: `Devolución aprobada — Re-ingreso a stock. Motivo original: ${ret.reason}`,
              createdAt: new Date().toISOString(),
              createdBy: inspectedBy,
            },
            ...state.movements,
          ];
          newEvents.unshift({
            id: `evt-${Date.now()}`,
            type: 'return',
            message: `Devolución resuelta: +${ret.quantity} ${ret.productName} (re-ingreso a stock)`,
            timestamp: new Date().toISOString(),
          });
        }
      } else if (ret && status === 'APPROVED_SCRAP') {
        newEvents.unshift({
          id: `evt-${Date.now()}`,
          type: 'return',
          message: `Devolución resuelta: ${ret.productName} → Scrap/Merma (no apto para venta)`,
          timestamp: new Date().toISOString(),
        });
      }

      return {
        returns: updatedReturns,
        products: updatedProducts,
        movements: newMovements,
        eventFeed: newEvents,
      };
    }),
}));

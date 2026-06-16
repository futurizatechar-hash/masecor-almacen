import { useState } from 'react';
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  Circle,
  MapPin,
  Tag,
} from 'lucide-react';
import { useInventoryStore } from '../store/inventoryStore';
import type { Order, OrderChannel } from '../data/types';
import './OrderPicking.css';

const channelLabels: Record<OrderChannel, { label: string; badge: string }> = {
  INOXAR_ECOMMERCE: { label: 'Inoxar Web', badge: 'badge-inoxar' },
  INOXAR_MELI: { label: 'Mercado Libre', badge: 'badge-meli' },
  MASECOR_WHOLESALE: { label: 'Mayorista', badge: 'badge-mayorista' },
  MASECOR_POS: { label: 'POS Mostrador', badge: 'badge-pos' },
};

const statusLabels: Record<string, { label: string; badge: string }> = {
  CONFIRMED: { label: 'Pendiente', badge: 'badge-warning' },
  PICKING: { label: 'En Preparación', badge: 'badge-info' },
  PACKED: { label: 'Embalado', badge: 'badge-ok' },
  SHIPPED: { label: 'Despachado', badge: 'badge-ok' },
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);

export function OrderPicking() {
  const { orders, togglePickItem, updateOrderStatus } = useInventoryStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterChannel, setFilterChannel] = useState<OrderChannel | 'all'>(
    'all'
  );

  const pendingOrders = orders.filter(
    (o) =>
      (o.status === 'CONFIRMED' ||
        o.status === 'PICKING' ||
        o.status === 'PACKED') &&
      (filterChannel === 'all' || o.channel === filterChannel)
  );

  const allItemsPicked = selectedOrder
    ? selectedOrder.items.every((item) => item.picked)
    : false;

  // Re-sync selected order with store state
  const currentSelected = selectedOrder
    ? orders.find((o) => o.id === selectedOrder.id) || null
    : null;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStartPicking = (order: Order) => {
    if (order.status === 'CONFIRMED') {
      updateOrderStatus(order.id, 'PICKING');
    }
    setSelectedOrder(order);
  };

  const handleMarkPacked = () => {
    if (currentSelected) {
      updateOrderStatus(currentSelected.id, 'PACKED');
      setSelectedOrder(null);
    }
  };

  const handleMarkShipped = (orderId: string) => {
    updateOrderStatus(orderId, 'SHIPPED');
  };

  return (
    <div className="picking">
      {/* ── Channel Filters ── */}
      <div className="picking__toolbar">
        <div className="picking__filters">
          <button
            className={`btn btn-sm ${filterChannel === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterChannel('all')}
          >
            Todos los canales
          </button>
          {(Object.keys(channelLabels) as OrderChannel[]).map((ch) => (
            <button
              key={ch}
              className={`btn btn-sm ${filterChannel === ch ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterChannel(ch)}
            >
              {channelLabels[ch].label}
            </button>
          ))}
        </div>
      </div>

      <div className="picking__layout">
        {/* ── Order List ── */}
        <div className="picking__list">
          <h3 className="picking__list-title">
            Pedidos Pendientes ({pendingOrders.length})
          </h3>
          {pendingOrders.map((order) => {
            const chConfig = channelLabels[order.channel];
            const stConfig = statusLabels[order.status] || {
              label: order.status,
              badge: 'badge-neutral',
            };
            return (
              <div
                key={order.id}
                className={`order-card ${
                  currentSelected?.id === order.id ? 'order-card--selected' : ''
                }`}
                onClick={() => handleStartPicking(order)}
              >
                <div className="order-card__header">
                  <span className="order-card__number">
                    {order.orderNumber}
                  </span>
                  <span className={`badge ${stConfig.badge}`}>
                    {stConfig.label}
                  </span>
                </div>
                <div className="order-card__info">
                  <span className="order-card__customer">
                    {order.customerName}
                  </span>
                  <span className="order-card__city">
                    <MapPin size={12} /> {order.customerCity}
                  </span>
                </div>
                <div className="order-card__footer">
                  <span className={`badge ${chConfig.badge}`}>
                    {chConfig.label}
                  </span>
                  <span className="order-card__total">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
                <span className="order-card__date">
                  {formatDate(order.createdAt)}
                </span>

                {/* Ship button for packed orders */}
                {order.status === 'PACKED' && (
                  <button
                    className="btn btn-primary btn-sm order-card__ship-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkShipped(order.id);
                    }}
                  >
                    <Truck size={14} /> Despachar
                  </button>
                )}
              </div>
            );
          })}

          {pendingOrders.length === 0 && (
            <div className="picking__empty">
              <PackageCheck size={40} />
              <p>No hay pedidos pendientes</p>
            </div>
          )}
        </div>

        {/* ── Picking Detail ── */}
        <div className="picking__detail">
          {currentSelected ? (
            <>
              <div className="picking__detail-header">
                <div>
                  <h3>Preparación: {currentSelected.orderNumber}</h3>
                  <p className="picking__detail-sub">
                    {currentSelected.customerName} —{' '}
                    {currentSelected.customerCity}
                  </p>
                </div>
                <div className="picking__detail-shipping">
                  <Tag size={14} />
                  <span>{currentSelected.shippingCarrier}</span>
                </div>
              </div>

              {/* Picking Checklist */}
              <div className="picking__items">
                {currentSelected.items.map((item, index) => (
                  <div
                    key={index}
                    className={`pick-item ${item.picked ? 'pick-item--done' : ''}`}
                    onClick={() =>
                      togglePickItem(currentSelected.id, index)
                    }
                  >
                    <div className="pick-item__check">
                      {item.picked ? (
                        <CheckCircle2 size={22} />
                      ) : (
                        <Circle size={22} />
                      )}
                    </div>
                    <div className="pick-item__info">
                      <span className="pick-item__name">{item.productName}</span>
                      <span className="pick-item__sku">{item.sku}</span>
                    </div>
                    <span className="pick-item__qty">x{item.quantity}</span>
                    <span className="pick-item__price">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="picking__actions">
                {currentSelected.status === 'PICKING' && (
                  <button
                    className="btn btn-success btn-lg w-full"
                    disabled={!allItemsPicked}
                    onClick={handleMarkPacked}
                  >
                    <PackageCheck size={18} />
                    {allItemsPicked
                      ? 'Marcar como Embalado'
                      : `Faltan ${
                          currentSelected.items.filter((i) => !i.picked)
                            .length
                        } ítem(s) por recolectar`}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="picking__placeholder">
              <PackageCheck size={48} />
              <h3>Seleccioná un pedido</h3>
              <p>
                Hacé clic en un pedido de la lista para comenzar la preparación
                y el picking de los ítems.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import {
  Package,
  AlertTriangle,
  PackageCheck,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useInventoryStore } from '../store/inventoryStore';
import './Dashboard.css';

export function Dashboard() {
  const { products, orders, returns, rawMaterials, eventFeed, setActiveView } =
    useInventoryStore();

  // KPI calculations
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockItems = products.filter(
    (p) => p.stock < p.minStock && p.stock > 0
  );
  const outOfStockItems = products.filter((p) => p.available <= 0);
  const pendingOrders = orders.filter(
    (o) => o.status === 'CONFIRMED' || o.status === 'PICKING'
  );
  const pendingReturns = returns.filter(
    (r) => r.status === 'PENDING_INSPECTION'
  );
  const rawMaterialAlerts = rawMaterials.filter(
    (rm) => rm.currentStock < rm.minStock
  );

  const stockValue = products.reduce(
    (sum, p) => sum + p.stock * p.costPrice,
    0
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(amount);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <TrendingDown size={14} />;
      case 'production':
        return <TrendingUp size={14} />;
      case 'alert':
        return <AlertTriangle size={14} />;
      case 'return':
        return <Package size={14} />;
      case 'adjustment':
        return <Clock size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const getEventClass = (type: string) => {
    switch (type) {
      case 'sale':
        return 'event--sale';
      case 'production':
        return 'event--production';
      case 'alert':
        return 'event--alert';
      case 'return':
        return 'event--return';
      case 'adjustment':
        return 'event--adjustment';
      default:
        return '';
    }
  };

  const getChannelLabel = (channel?: string) => {
    switch (channel) {
      case 'INOXAR_ECOMMERCE':
        return 'Inoxar Web';
      case 'INOXAR_MELI':
        return 'Mercado Libre';
      case 'MASECOR_WHOLESALE':
        return 'Mayorista';
      case 'MASECOR_POS':
        return 'POS';
      default:
        return null;
    }
  };

  const getChannelBadge = (channel?: string) => {
    switch (channel) {
      case 'INOXAR_ECOMMERCE':
        return 'badge-inoxar';
      case 'INOXAR_MELI':
        return 'badge-meli';
      case 'MASECOR_WHOLESALE':
        return 'badge-mayorista';
      case 'MASECOR_POS':
        return 'badge-pos';
      default:
        return '';
    }
  };

  return (
    <div className="dashboard">
      {/* ── KPI Cards ── */}
      <div className="dashboard__kpis">
        <div className="kpi-card">
          <div className="kpi-card__icon kpi-card__icon--blue">
            <Package size={22} />
          </div>
          <div className="kpi-card__content">
            <span className="kpi-card__value">{totalStock}</span>
            <span className="kpi-card__label">Unidades en Stock</span>
          </div>
          <span className="kpi-card__sub">{totalProducts} productos</span>
        </div>

        <div
          className="kpi-card kpi-card--clickable"
          onClick={() => setActiveView('inventory')}
        >
          <div className="kpi-card__icon kpi-card__icon--yellow">
            <AlertTriangle size={22} />
          </div>
          <div className="kpi-card__content">
            <span className="kpi-card__value">{lowStockItems.length}</span>
            <span className="kpi-card__label">Bajo Mínimo</span>
          </div>
          {outOfStockItems.length > 0 && (
            <span className="kpi-card__alert">
              {outOfStockItems.length} sin stock
            </span>
          )}
        </div>

        <div
          className="kpi-card kpi-card--clickable"
          onClick={() => setActiveView('picking')}
        >
          <div className="kpi-card__icon kpi-card__icon--green">
            <PackageCheck size={22} />
          </div>
          <div className="kpi-card__content">
            <span className="kpi-card__value">{pendingOrders.length}</span>
            <span className="kpi-card__label">Pedidos por Despachar</span>
          </div>
          <span className="kpi-card__sub">
            {orders.filter((o) => o.status === 'PICKING').length} en preparación
          </span>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__icon kpi-card__icon--orange">
            <TrendingUp size={22} />
          </div>
          <div className="kpi-card__content">
            <span className="kpi-card__value">{formatCurrency(stockValue)}</span>
            <span className="kpi-card__label">Valor del Inventario</span>
          </div>
          <span className="kpi-card__sub">Costo de producción</span>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="dashboard__grid">
        {/* Event Feed */}
        <div className="dashboard__section dashboard__feed">
          <div className="dashboard__section-header">
            <h2>Actividad en Tiempo Real</h2>
            <span className="dashboard__live-dot" />
          </div>
          <div className="feed-list">
            {eventFeed.slice(0, 10).map((event) => (
              <div key={event.id} className={`feed-item ${getEventClass(event.type)}`}>
                <span className="feed-item__icon">
                  {getEventIcon(event.type)}
                </span>
                <div className="feed-item__content">
                  <p className="feed-item__message">{event.message}</p>
                  <div className="feed-item__meta">
                    <span className="feed-item__time">
                      {formatTime(event.timestamp)}
                    </span>
                    {event.channel && (
                      <span className={`badge ${getChannelBadge(event.channel)}`}>
                        {getChannelLabel(event.channel)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="dashboard__section dashboard__alerts">
          <div className="dashboard__section-header">
            <h2>Alertas de Stock</h2>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setActiveView('inventory')}
            >
              Ver todo <ArrowRight size={14} />
            </button>
          </div>

          {/* Out of stock */}
          {outOfStockItems.map((p) => (
            <div key={p.id} className="alert-item alert-item--critical">
              <div className="alert-item__status">
                <span className="badge badge-critical">SIN STOCK</span>
              </div>
              <div className="alert-item__info">
                <span className="alert-item__name">{p.name}</span>
                <span className="alert-item__sku">{p.sku}</span>
              </div>
              <span className="alert-item__stock">0 / {p.minStock}</span>
            </div>
          ))}

          {/* Low stock */}
          {lowStockItems.map((p) => (
            <div key={p.id} className="alert-item alert-item--warning">
              <div className="alert-item__status">
                <span className="badge badge-warning">BAJO MÍNIMO</span>
              </div>
              <div className="alert-item__info">
                <span className="alert-item__name">{p.name}</span>
                <span className="alert-item__sku">{p.sku}</span>
              </div>
              <span className="alert-item__stock">
                {p.stock} / {p.minStock}
              </span>
            </div>
          ))}

          {/* Raw material alerts */}
          {rawMaterialAlerts.length > 0 && (
            <>
              <div className="alert-divider">
                <span>Materia Prima</span>
              </div>
              {rawMaterialAlerts.map((rm) => (
                <div key={rm.id} className="alert-item alert-item--warning">
                  <div className="alert-item__status">
                    <span className="badge badge-warning">REABASTECER</span>
                  </div>
                  <div className="alert-item__info">
                    <span className="alert-item__name">{rm.name}</span>
                    <span className="alert-item__sku">{rm.supplier}</span>
                  </div>
                  <span className="alert-item__stock">
                    {rm.currentStock} / {rm.minStock} {rm.unit}
                  </span>
                </div>
              ))}
            </>
          )}

          {outOfStockItems.length === 0 &&
            lowStockItems.length === 0 &&
            rawMaterialAlerts.length === 0 && (
              <p className="dashboard__empty">
                ✅ Todo el inventario está sobre el mínimo
              </p>
            )}
        </div>

        {/* Pending Returns */}
        {pendingReturns.length > 0 && (
          <div className="dashboard__section dashboard__returns-summary">
            <div className="dashboard__section-header">
              <h2>Devoluciones Pendientes</h2>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setActiveView('returns')}
              >
                Gestionar <ArrowRight size={14} />
              </button>
            </div>
            {pendingReturns.map((r) => (
              <div key={r.id} className="alert-item alert-item--info">
                <div className="alert-item__status">
                  <span className="badge badge-info">INSPECCIONAR</span>
                </div>
                <div className="alert-item__info">
                  <span className="alert-item__name">{r.productName}</span>
                  <span className="alert-item__sku">
                    {r.reason} — Pedido {r.orderNumber}
                  </span>
                </div>
                <span className="alert-item__stock">x{r.quantity}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

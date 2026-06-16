import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  RotateCcw,
  ArrowLeftRight,
  Filter,
} from 'lucide-react';
import { useInventoryStore } from '../store/inventoryStore';
import type { MovementType } from '../data/types';
import './StockMovements.css';

const typeConfig: Record<
  MovementType,
  { label: string; icon: React.ReactNode; class: string }
> = {
  SALE: { label: 'Venta', icon: <TrendingDown size={14} />, class: 'movement--sale' },
  PRODUCTION: { label: 'Producción', icon: <TrendingUp size={14} />, class: 'movement--production' },
  ADJUSTMENT: { label: 'Ajuste', icon: <RefreshCw size={14} />, class: 'movement--adjustment' },
  RETURN: { label: 'Devolución', icon: <RotateCcw size={14} />, class: 'movement--return' },
  TRANSFER: { label: 'Transferencia', icon: <ArrowLeftRight size={14} />, class: 'movement--transfer' },
};

const sourceLabels: Record<string, string> = {
  'inoxar-ecommerce': 'Inoxar Web',
  'inoxar-meli': 'Mercado Libre',
  'masecor-wholesale': 'Mayorista',
  fabrica: 'Fábrica',
  'ajuste-manual': 'Ajuste Manual',
  devolucion: 'Devolución',
};

export function StockMovements() {
  const { movements } = useInventoryStore();
  const [filterType, setFilterType] = useState<MovementType | 'all'>('all');

  const filtered =
    filterType === 'all'
      ? movements
      : movements.filter((m) => m.type === filterType);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="movements">
      {/* ── Toolbar ── */}
      <div className="movements__toolbar">
        <div className="movements__filters">
          <Filter size={16} />
          <button
            className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterType('all')}
          >
            Todos
          </button>
          {(Object.keys(typeConfig) as MovementType[]).map((type) => (
            <button
              key={type}
              className={`btn btn-sm ${filterType === type ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType(type)}
            >
              {typeConfig[type].icon}
              {typeConfig[type].label}
            </button>
          ))}
        </div>
        <span className="movements__count">{filtered.length} movimientos</span>
      </div>

      {/* ── List ── */}
      <div className="movements__list">
        {filtered.map((mov) => {
          const config = typeConfig[mov.type];
          return (
            <div key={mov.id} className={`movement-card ${config.class}`}>
              <div className="movement-card__header">
                <div className="movement-card__type">
                  {config.icon}
                  <span>{config.label}</span>
                </div>
                <div className="movement-card__qty">
                  <span
                    className={`movement-card__qty-value ${
                      mov.quantity > 0 ? 'qty--positive' : 'qty--negative'
                    }`}
                  >
                    {mov.quantity > 0 ? '+' : ''}
                    {mov.quantity}
                  </span>
                </div>
              </div>

              <div className="movement-card__body">
                <span className="movement-card__product">{mov.productName}</span>
                <span className="movement-card__ref">
                  Ref: {mov.reference} — {sourceLabels[mov.source] || mov.source}
                </span>
              </div>

              <div className="movement-card__meta">
                <span className="movement-card__stock">
                  Stock: {mov.previousStock} → <strong>{mov.newStock}</strong>
                </span>
                <span className="movement-card__date">
                  {formatDate(mov.createdAt)} {formatTime(mov.createdAt)}
                </span>
              </div>

              {mov.notes && (
                <p className="movement-card__notes">{mov.notes}</p>
              )}

              <span className="movement-card__author">{mov.createdBy}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

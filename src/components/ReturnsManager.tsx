import { CheckCircle2, XCircle, Package, Clock, AlertTriangle } from 'lucide-react';
import { useInventoryStore } from '../store/inventoryStore';
import type { ReturnStatus } from '../data/types';
import './ReturnsManager.css';

const statusConfig: Record<
  ReturnStatus,
  { label: string; badge: string; icon: React.ReactNode }
> = {
  PENDING_INSPECTION: {
    label: 'Pendiente Inspección',
    badge: 'badge-warning',
    icon: <Clock size={16} />,
  },
  APPROVED_RESTOCK: {
    label: 'Re-ingreso a Stock',
    badge: 'badge-ok',
    icon: <CheckCircle2 size={16} />,
  },
  APPROVED_SCRAP: {
    label: 'Scrap / Merma',
    badge: 'badge-critical',
    icon: <XCircle size={16} />,
  },
  REJECTED: {
    label: 'Rechazada',
    badge: 'badge-neutral',
    icon: <XCircle size={16} />,
  },
};

export function ReturnsManager() {
  const { returns, resolveReturn } = useInventoryStore();

  const pending = returns.filter((r) => r.status === 'PENDING_INSPECTION');
  const resolved = returns.filter((r) => r.status !== 'PENDING_INSPECTION');

  const formatDate = (iso: string | null) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="returns">
      {/* ── Pending Inspections ── */}
      <div className="returns__section">
        <h2 className="returns__section-title">
          <AlertTriangle size={20} />
          Pendientes de Inspección ({pending.length})
        </h2>

        {pending.length === 0 ? (
          <p className="returns__empty">
            ✅ No hay devoluciones pendientes de inspección
          </p>
        ) : (
          <div className="returns__grid">
            {pending.map((ret) => (
              <div key={ret.id} className="return-card return-card--pending">
                <div className="return-card__header">
                  <span className="return-card__order">
                    Pedido {ret.orderNumber}
                  </span>
                  <span className={`badge ${statusConfig[ret.status].badge}`}>
                    {statusConfig[ret.status].label}
                  </span>
                </div>

                <div className="return-card__product">
                  <Package size={16} />
                  <div>
                    <span className="return-card__name">{ret.productName}</span>
                    <span className="return-card__sku">{ret.sku}</span>
                  </div>
                  <span className="return-card__qty">x{ret.quantity}</span>
                </div>

                <div className="return-card__reason">
                  <strong>Motivo:</strong> {ret.reason}
                </div>

                {ret.notes && (
                  <p className="return-card__notes">{ret.notes}</p>
                )}

                <div className="return-card__date">
                  Recibida: {formatDate(ret.createdAt)}
                </div>

                <div className="return-card__actions">
                  <button
                    className="btn btn-success"
                    onClick={() =>
                      resolveReturn(
                        ret.id,
                        'APPROVED_RESTOCK',
                        'Roberto García'
                      )
                    }
                  >
                    <CheckCircle2 size={16} />
                    Apto → Re-ingreso a Stock
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      resolveReturn(
                        ret.id,
                        'APPROVED_SCRAP',
                        'Roberto García'
                      )
                    }
                  >
                    <XCircle size={16} />
                    Dañado → Scrap / Merma
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Resolved Returns ── */}
      <div className="returns__section">
        <h2 className="returns__section-title">
          Historial de Devoluciones ({resolved.length})
        </h2>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Producto</th>
                <th>Motivo</th>
                <th>Cantidad</th>
                <th>Resolución</th>
                <th>Inspector</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {resolved.map((ret) => {
                const config = statusConfig[ret.status];
                return (
                  <tr key={ret.id}>
                    <td className="font-mono">{ret.orderNumber}</td>
                    <td>
                      <div className="product-cell">
                        <span className="product-cell__name">
                          {ret.productName}
                        </span>
                        <span className="product-cell__dims">{ret.sku}</span>
                      </div>
                    </td>
                    <td>{ret.reason}</td>
                    <td className="text-center font-mono">x{ret.quantity}</td>
                    <td>
                      <span className={`badge ${config.badge}`}>
                        {config.icon} {config.label}
                      </span>
                    </td>
                    <td>{ret.inspectedBy || '—'}</td>
                    <td className="font-mono">
                      {formatDate(ret.resolvedAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

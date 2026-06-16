import { AlertTriangle, TrendingDown } from 'lucide-react';
import { useInventoryStore } from '../store/inventoryStore';
import './RawMaterials.css';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);

export function RawMaterials() {
  const { rawMaterials } = useInventoryStore();

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  const getStockPercent = (current: number, min: number) => {
    // Show as percentage of 2x minimum (as a rough "full" reference)
    const full = min * 2;
    return Math.min(100, Math.round((current / full) * 100));
  };

  return (
    <div className="raw-materials">
      {/* ── Summary ── */}
      <div className="raw-materials__summary">
        <div className="kpi-card">
          <div className="kpi-card__icon kpi-card__icon--orange">
            <TrendingDown size={22} />
          </div>
          <div className="kpi-card__content">
            <span className="kpi-card__value">
              {rawMaterials.filter((rm) => rm.currentStock < rm.minStock).length}
            </span>
            <span className="kpi-card__label">Insumos Bajo Mínimo</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__icon kpi-card__icon--blue">
            <AlertTriangle size={22} />
          </div>
          <div className="kpi-card__content">
            <span className="kpi-card__value">
              {formatCurrency(
                rawMaterials.reduce(
                  (sum, rm) => sum + rm.currentStock * rm.costPerUnit,
                  0
                )
              )}
            </span>
            <span className="kpi-card__label">Valor de Materia Prima</span>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Insumo</th>
              <th>Proveedor</th>
              <th className="text-right">Stock Actual</th>
              <th className="text-right">Mínimo</th>
              <th>Nivel</th>
              <th>Estado</th>
              <th className="text-right">Costo/Unidad</th>
              <th className="text-right">Valor Total</th>
              <th>Último Restock</th>
            </tr>
          </thead>
          <tbody>
            {rawMaterials.map((rm) => {
              const isLow = rm.currentStock < rm.minStock;
              const percent = getStockPercent(rm.currentStock, rm.minStock);
              return (
                <tr key={rm.id} className={isLow ? 'row--warning' : ''}>
                  <td>
                    <span className="rm-name">{rm.name}</span>
                  </td>
                  <td className="rm-supplier">{rm.supplier}</td>
                  <td className="text-right font-mono">
                    {rm.currentStock.toLocaleString('es-AR')} {rm.unit}
                  </td>
                  <td className="text-right font-mono">
                    {rm.minStock.toLocaleString('es-AR')} {rm.unit}
                  </td>
                  <td>
                    <div className="stock-bar">
                      <div
                        className={`stock-bar__fill ${
                          isLow ? 'stock-bar__fill--low' : 'stock-bar__fill--ok'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </td>
                  <td>
                    {isLow ? (
                      <span className="badge badge-warning">
                        <AlertTriangle size={10} /> REABASTECER
                      </span>
                    ) : (
                      <span className="badge badge-ok">OK</span>
                    )}
                  </td>
                  <td className="text-right font-mono">
                    {formatCurrency(rm.costPerUnit)}
                  </td>
                  <td className="text-right font-mono">
                    {formatCurrency(rm.currentStock * rm.costPerUnit)}
                  </td>
                  <td className="font-mono">{formatDate(rm.lastRestock)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

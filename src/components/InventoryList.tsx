import { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Minus,
  X,
  MapPin,
  AlertTriangle,
  Package,
} from 'lucide-react';
import { useInventoryStore } from '../store/inventoryStore';
import type { ProductVariant, ProductLine, StockStatus } from '../data/types';
import './InventoryList.css';

function getStockStatus(product: ProductVariant): StockStatus {
  if (product.available <= 0) return 'out';
  if (product.stock < product.minStock) return 'low';
  if (product.stock < product.minStock * 1.2) return 'low';
  return 'ok';
}

function getStockBadge(status: StockStatus) {
  switch (status) {
    case 'ok':
      return <span className="badge badge-ok">OK</span>;
    case 'low':
      return <span className="badge badge-warning">BAJO MÍNIMO</span>;
    case 'out':
      return <span className="badge badge-critical">SIN STOCK</span>;
    default:
      return null;
  }
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);

export function InventoryList() {
  const { products, adjustStock } = useInventoryStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterLine, setFilterLine] = useState<ProductLine | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<StockStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Adjustment Modal
  const [adjustModal, setAdjustModal] = useState<ProductVariant | null>(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustNotes, setAdjustNotes] = useState('');
  const [adjustType, setAdjustType] = useState<'add' | 'remove'>('add');

  // Filtering
  const filtered = products.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLine = filterLine === 'all' || p.line === filterLine;

    const status = getStockStatus(p);
    const matchesStatus = filterStatus === 'all' || status === filterStatus;

    return matchesSearch && matchesLine && matchesStatus;
  });

  const handleAdjust = () => {
    if (!adjustModal || !adjustQty || !adjustNotes) return;
    const qty = parseInt(adjustQty, 10);
    if (isNaN(qty) || qty === 0) return;
    const finalQty = adjustType === 'remove' ? -Math.abs(qty) : Math.abs(qty);
    adjustStock(adjustModal.id, finalQty, adjustNotes, 'Roberto García');
    setAdjustModal(null);
    setAdjustQty('');
    setAdjustNotes('');
  };

  return (
    <div className="inventory">
      {/* ── Toolbar ── */}
      <div className="inventory__toolbar">
        <div className="inventory__search">
          <Search size={16} className="inventory__search-icon" />
          <input
            type="text"
            className="input"
            placeholder="Buscar por nombre, SKU o ubicación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>

        <button
          className={`btn btn-secondary ${showFilters ? 'btn--active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} />
          Filtros
        </button>
      </div>

      {/* ── Filters ── */}
      {showFilters && (
        <div className="inventory__filters">
          <div className="inventory__filter-group">
            <label className="label">Línea</label>
            <select
              className="select"
              value={filterLine}
              onChange={(e) => setFilterLine(e.target.value as ProductLine | 'all')}
            >
              <option value="all">Todas las líneas</option>
              <option value="Premium">Premium</option>
              <option value="Prisma">Prisma</option>
              <option value="Standard">Standard</option>
              <option value="Lavadero">Lavadero</option>
              <option value="Accesorios">Accesorios</option>
            </select>
          </div>

          <div className="inventory__filter-group">
            <label className="label">Estado de Stock</label>
            <select
              className="select"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as StockStatus | 'all')
              }
            >
              <option value="all">Todos</option>
              <option value="ok">OK</option>
              <option value="low">Bajo Mínimo</option>
              <option value="out">Sin Stock</option>
            </select>
          </div>

          <div className="inventory__filter-group">
            <label className="label">&nbsp;</label>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setFilterLine('all');
                setFilterStatus('all');
                setSearchQuery('');
              }}
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* ── Results count ── */}
      <div className="inventory__meta">
        <span>
          {filtered.length} producto{filtered.length !== 1 ? 's' : ''} encontrado
          {filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Table ── */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>SKU</th>
              <th>Línea</th>
              <th>Posición</th>
              <th>Ubicación</th>
              <th className="text-right">Físico</th>
              <th className="text-right">Reservado</th>
              <th className="text-right">Disponible</th>
              <th className="text-right">Mínimo</th>
              <th>Estado</th>
              <th className="text-right">Costo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => {
              const status = getStockStatus(product);
              return (
                <tr
                  key={product.id}
                  className={status === 'out' ? 'row--critical' : status === 'low' ? 'row--warning' : ''}
                >
                  <td>
                    <div className="product-cell">
                      <span className="product-cell__name">{product.name}</span>
                      <span className="product-cell__dims">
                        {product.dimensions}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono">{product.sku}</span>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{product.line}</span>
                  </td>
                  <td>{product.bowlPosition}</td>
                  <td>
                    <div className="location-cell">
                      <MapPin size={12} />
                      <span>{product.location}</span>
                    </div>
                  </td>
                  <td className="text-right font-mono">{product.stock}</td>
                  <td className="text-right font-mono">
                    {product.reserved > 0 ? (
                      <span className="text-reserved">-{product.reserved}</span>
                    ) : (
                      '0'
                    )}
                  </td>
                  <td className="text-right">
                    <span
                      className={`font-mono stock-value ${
                        status === 'out'
                          ? 'stock-value--critical'
                          : status === 'low'
                          ? 'stock-value--warning'
                          : 'stock-value--ok'
                      }`}
                    >
                      {product.available}
                    </span>
                  </td>
                  <td className="text-right font-mono">{product.minStock}</td>
                  <td>{getStockBadge(status)}</td>
                  <td className="text-right">{formatCurrency(product.costPrice)}</td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setAdjustModal(product);
                        setAdjustQty('');
                        setAdjustNotes('');
                        setAdjustType('add');
                      }}
                      title="Ajustar stock"
                    >
                      <Package size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="inventory__empty">
            <AlertTriangle size={32} />
            <p>No se encontraron productos con esos filtros</p>
          </div>
        )}
      </div>

      {/* ── Adjustment Modal ── */}
      {adjustModal && (
        <div className="modal-overlay" onClick={() => setAdjustModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Ajuste de Inventario</h3>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setAdjustModal(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="adjust-modal__product">
              <span className="adjust-modal__name">{adjustModal.name}</span>
              <span className="adjust-modal__sku">{adjustModal.sku}</span>
              <span className="adjust-modal__stock">
                Stock actual: <strong>{adjustModal.stock}</strong> unidades
              </span>
            </div>

            <div className="adjust-modal__type">
              <button
                className={`adjust-type-btn ${adjustType === 'add' ? 'adjust-type-btn--active adjust-type-btn--add' : ''}`}
                onClick={() => setAdjustType('add')}
              >
                <Plus size={16} />
                Ingreso
              </button>
              <button
                className={`adjust-type-btn ${adjustType === 'remove' ? 'adjust-type-btn--active adjust-type-btn--remove' : ''}`}
                onClick={() => setAdjustType('remove')}
              >
                <Minus size={16} />
                Egreso
              </button>
            </div>

            <div className="adjust-modal__field">
              <label className="label">Cantidad</label>
              <input
                type="number"
                className="input"
                placeholder="Ej: 5"
                min="1"
                value={adjustQty}
                onChange={(e) => setAdjustQty(e.target.value)}
                autoFocus
              />
            </div>

            <div className="adjust-modal__field">
              <label className="label">Motivo / Justificación *</label>
              <select
                className="select"
                value={adjustNotes}
                onChange={(e) => setAdjustNotes(e.target.value)}
              >
                <option value="">Seleccionar motivo...</option>
                <option value="Conteo físico — ajuste por diferencia">
                  Conteo físico — ajuste por diferencia
                </option>
                <option value="Scrap — producto dañado en manipulación">
                  Scrap — producto dañado en manipulación
                </option>
                <option value="Scrap — soldadura defectuosa (control de calidad)">
                  Scrap — soldadura defectuosa
                </option>
                <option value="Ingreso por producción — lote fuera de orden">
                  Ingreso por producción fuera de orden
                </option>
                <option value="Transferencia entre ubicaciones">
                  Transferencia entre ubicaciones
                </option>
                <option value="Rotura por caída durante carga/descarga">
                  Rotura por caída durante carga
                </option>
                <option value="Otro (especificar en observaciones)">
                  Otro
                </option>
              </select>
            </div>

            {adjustQty && !isNaN(parseInt(adjustQty)) && (
              <div className="adjust-modal__preview">
                <span>
                  Stock: {adjustModal.stock} →{' '}
                  <strong>
                    {adjustType === 'add'
                      ? adjustModal.stock + parseInt(adjustQty)
                      : adjustModal.stock - parseInt(adjustQty)}
                  </strong>
                </span>
              </div>
            )}

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setAdjustModal(null)}
              >
                Cancelar
              </button>
              <button
                className={`btn ${adjustType === 'remove' ? 'btn-danger' : 'btn-success'}`}
                disabled={!adjustQty || !adjustNotes || parseInt(adjustQty) === 0}
                onClick={handleAdjust}
              >
                {adjustType === 'add' ? (
                  <>
                    <Plus size={16} /> Confirmar Ingreso
                  </>
                ) : (
                  <>
                    <Minus size={16} /> Confirmar Egreso
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

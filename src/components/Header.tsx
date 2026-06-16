import { Bell, Search, User, Menu } from 'lucide-react';
import { useInventoryStore } from '../store/inventoryStore';
import './Header.css';

const viewTitles: Record<string, string> = {
  dashboard: 'Panel de Control',
  inventory: 'Inventario de Productos',
  movements: 'Historial de Movimientos',
  picking: 'Preparación y Despacho',
  returns: 'Devoluciones (RMA)',
  'raw-materials': 'Materia Prima',
};

export function Header() {
  const { activeView, products, toggleMobileMenu } = useInventoryStore();

  const criticalAlerts = products.filter(
    (p) => p.available <= 0 || p.stock < p.minStock
  ).length;

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__mobile-toggle" onClick={toggleMobileMenu}>
          <Menu size={20} />
        </button>
        <h1 className="header__title">{viewTitles[activeView]}</h1>
      </div>

      <div className="header__right">
        {/* Search */}
        <div className="header__search">
          <Search size={16} className="header__search-icon" />
          <input
            type="text"
            className="header__search-input"
            placeholder="Buscar producto, SKU, pedido..."
          />
        </div>

        {/* Alerts */}
        <button className="header__icon-btn" title="Alertas">
          <Bell size={20} />
          {criticalAlerts > 0 && (
            <span className="header__badge">{criticalAlerts}</span>
          )}
        </button>

        {/* User */}
        <div className="header__user">
          <div className="header__avatar">
            <User size={18} />
          </div>
          <div className="header__user-info">
            <span className="header__user-name">Roberto García</span>
            <span className="header__user-role">Responsable Almacén</span>
          </div>
        </div>
      </div>
    </header>
  );
}

import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  PackageCheck,
  RotateCcw,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useInventoryStore, type ActiveView } from '../store/inventoryStore';
import './Sidebar.css';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Resumen', icon: <LayoutDashboard size={20} /> },
  { id: 'inventory', label: 'Inventario', icon: <Package size={20} /> },
  { id: 'movements', label: 'Movimientos', icon: <ArrowLeftRight size={20} /> },
  { id: 'picking', label: 'Despachos', icon: <PackageCheck size={20} /> },
  { id: 'returns', label: 'Devoluciones', icon: <RotateCcw size={20} /> },
  { id: 'raw-materials', label: 'Materia Prima', icon: <Layers size={20} /> },
];

export function Sidebar() {
  const { activeView, setActiveView, sidebarCollapsed, toggleSidebar, mobileMenuOpen, setMobileMenuOpen } =
    useInventoryStore();

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'sidebar--collapsed' : ''} ${mobileMenuOpen ? 'sidebar--mobile-open' : ''}`}>
      {/* Logo / Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__logo-wrapper">
          <img
            src="/logo-m-isolated.webp"
            alt=""
            className="sidebar__logo-icon"
            width="40"
            height="40"
          />
          {!sidebarCollapsed && (
            <div className="sidebar__brand-text">
              <span className="sidebar__brand-name">MASECOR</span>
              <span className="sidebar__brand-module">Almacén</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar__item ${activeView === item.id ? 'sidebar__item--active' : ''}`}
            onClick={() => {
              setActiveView(item.id);
              setMobileMenuOpen(false);
            }}
            title={sidebarCollapsed ? item.label : undefined}
          >
            <span className="sidebar__item-icon">{item.icon}</span>
            {!sidebarCollapsed && (
              <span className="sidebar__item-label">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button className="sidebar__toggle" onClick={toggleSidebar}>
        {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        {!sidebarCollapsed && <span>Contraer</span>}
      </button>
    </aside>
  );
}

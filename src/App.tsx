import { useInventoryStore } from './store/inventoryStore';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { InventoryList } from './components/InventoryList';
import { StockMovements } from './components/StockMovements';
import { OrderPicking } from './components/OrderPicking';
import { ReturnsManager } from './components/ReturnsManager';
import { RawMaterials } from './components/RawMaterials';
import './App.css';

function App() {
  const { activeView, sidebarCollapsed, mobileMenuOpen, setMobileMenuOpen } = useInventoryStore();

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <InventoryList />;
      case 'movements':
        return <StockMovements />;
      case 'picking':
        return <OrderPicking />;
      case 'returns':
        return <ReturnsManager />;
      case 'raw-materials':
        return <RawMaterials />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`app ${sidebarCollapsed ? 'app--sidebar-collapsed' : ''} ${mobileMenuOpen ? 'app--mobile-menu-open' : ''}`}>
      <Sidebar />
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}
      <div className="main-area">
        <Header />
        <main className="main-content">{renderView()}</main>
      </div>
    </div>
  );
}

export default App;

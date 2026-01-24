import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import TaxDashboard from './pages/Admin/TaxDashboard';
import QueriesDashboard from './pages/Admin/QueriesDashboard';
import Audit from './pages/Admin/Audit';
import UserDashboard from './pages/User/UserDashboard';
import Profile from './pages/Shared/Profile';
import Settings from './pages/Shared/Settings';
import ComplaintsTable from './pages/User/ComplaintsTable';
import PropertyTax from './pages/User/PropertyTax';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h1 style={{ color: 'var(--primary)' }}>Something went wrong</h1>
          <p style={{ color: 'var(--text-muted)' }}>{this.state.error?.message || 'An error occurred'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
            style={{ marginTop: '20px' }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div style={{ display: 'flex' }}>
          <Header />
          <Routes>
            <Route path="/admin/*" element={<Sidebar isAdmin={true} />} />
            <Route path="/*" element={<Sidebar isAdmin={false} />} />
          </Routes>

          <main className="main-content">
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/tax" element={<TaxDashboard />} />
              <Route path="/admin/queries" element={<QueriesDashboard />} />
              <Route path="/admin/logs" element={<Audit />} />

              {/* Shared Operational Routes */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />

              {/* User Routes */}
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/complaints" element={<ComplaintsTable />} />
              <Route path="/property-tax" element={<PropertyTax />} />

              {/* Default redirects */}
              <Route path="/admin" element={<Navigate to="/admin/tax" replace />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              {/* Backward compatibility for old routes */}
              <Route path="/history" element={<Navigate to="/complaints" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

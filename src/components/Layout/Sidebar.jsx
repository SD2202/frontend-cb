import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Database, MessageSquare, User, Settings, Shield } from 'lucide-react';

const Sidebar = ({ isAdmin }) => {
  return (
    <div className="sidebar">
      <div style={{ paddingBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '0.05em', color: 'white' }}>VMC ADMIN</h2>
      </div>

      <nav style={{ flex: 1 }}>
        {isAdmin ? (
          <>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Management</div>
            <NavLink to="/admin/tax" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Database size={18} /> Property Tax
            </NavLink>
            <NavLink to="/admin/queries" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <MessageSquare size={18} /> Citizen Requests
            </NavLink>
            <NavLink to="/admin/logs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Shield size={18} /> System Audit
            </NavLink>
          </>
        ) : (
          <>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Citizen Portal</div>
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Overview
            </NavLink>
            <NavLink to="/complaints" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <MessageSquare size={18} /> Registered Complaints
            </NavLink>
            <NavLink to="/property-tax" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Database size={18} /> Property Tax
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <User size={18} /> My Profile
            </NavLink>
          </>
        )}
      </nav>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
        <NavLink to="/settings" className="nav-link">
          <Settings size={18} /> Settings
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;

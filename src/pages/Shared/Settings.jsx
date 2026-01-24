import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings as SettingsIcon, Bell, Lock, Globe, Save } from 'lucide-react';
import VmcDataTable from '../../components/Shared/VmcDataTable';

const Settings = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTaxData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/admin/tax');
                setRecords(response.data);
            } catch (error) {
                console.error("Error fetching tax data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTaxData();
    }, []);

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>System Settings</h1>
                <p style={{ color: 'var(--text-muted)' }}>Configure portal preferences and administrative parameters.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '32px' }}>
                <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <SettingsIcon size={20} /> Preferences
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <p style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '12px' }}>NOTIFICATIONS</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <input type="checkbox" defaultChecked />
                                <span style={{ fontSize: '0.9rem' }}>Enable WhatsApp Alerts</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <input type="checkbox" defaultChecked />
                                <span style={{ fontSize: '0.9rem' }}>Email Daily Reports</span>
                            </div>
                        </div>

                        <div>
                            <p style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '12px' }}>PORTAL LANGUAGE</p>
                            <select style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px' }}>
                                <option>English (Official)</option>
                                <option>Hindi</option>
                                <option>Regional Language</option>
                            </select>
                        </div>

                        <div>
                            <p style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '12px' }}>SECURITY</p>
                            <button style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                                <Lock size={16} /> Reset Password
                            </button>
                        </div>

                        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <Save size={18} /> Save Changes
                        </button>
                    </div>
                </div>

                <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px' }}>Global Tax Reference Table</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                        This data is used as a reference for all system configuration calculations.
                    </p>
                    <VmcDataTable data={records} loading={loading} />
                </div>
            </div>
        </div>
    );
};

export default Settings;

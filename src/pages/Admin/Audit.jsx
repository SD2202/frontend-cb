import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Eye, FileText, AlertCircle } from 'lucide-react';
import VmcDataTable from '../../components/Shared/VmcDataTable';

const Audit = () => {
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

    const auditLogs = [
        { id: 'LOG-001', action: 'Login', user: 'Admin', time: '09:45 AM', status: 'Success' },
        { id: 'LOG-002', action: 'Export CSV', user: 'Admin', time: '10:12 AM', status: 'Success' },
        { id: 'LOG-003', action: 'Update Record', user: 'Admin', time: '11:05 AM', status: 'Success' },
        { id: 'LOG-004', action: 'Failed Login', user: 'Unknown', time: '12:30 PM', status: 'Blocked' },
    ];

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>System Audit & Security</h1>
                <p style={{ color: 'var(--text-muted)' }}>Professional event logging and security monitoring for the VMC portal.</p>
            </div>

            <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={20} /> Access Logs
                </h3>
                <table style={{ width: '100%', marginBottom: '24px' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Action Event</th>
                            <th>User Entity</th>
                            <th>Timestamp</th>
                            <th>Security Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auditLogs.map((log) => (
                            <tr key={log.id}>
                                <td style={{ fontWeight: '600' }}>{log.id}</td>
                                <td>{log.action}</td>
                                <td>{log.user}</td>
                                <td>{log.time}</td>
                                <td>
                                    <span style={{
                                        color: log.status === 'Success' ? '#166534' : '#991b1b',
                                        fontSize: '0.8rem',
                                        fontWeight: '700'
                                    }}>{log.status.toUpperCase()}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '20px' }}>Audit Reference: Customer Tax Status</h3>
                <VmcDataTable data={records} loading={loading} />
            </div>
        </div>
    );
};

export default Audit;

import React, { useState, useEffect } from 'react';
import { fetchProperties } from '../../services/api';
import { Search, Filter, Download, Plus } from 'lucide-react';
import VmcDataTable from '../../components/Shared/VmcDataTable';

const TaxDashboard = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTaxData = async () => {
            try {
                const data = await fetchProperties();
                const formattedData = data.map((item, index) => ({
                    sno: index + 1,
                    customer_id: item.property_id,
                    phone: "N/A", // Property tax record doesn't have phone in current model
                    owner_name: item.owner_name,
                    description: item.address,
                    status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
                    amount: item.amount,
                    year: item.year,
                    id: item.property_id // For PDF download action
                }));
                setRecords(formattedData);
            } catch (error) {
                console.error("Error fetching tax data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTaxData();
        const interval = setInterval(fetchTaxData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>Property Tax Administration</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Centralized management of municipal property tax assessments and payments.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Download size={18} /> Export CSV
                    </button>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> Add New Entry
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <input
                            type="text"
                            placeholder="Search by owner name or property ID..."
                            style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.9rem' }}
                        />
                    </div>
                </div>
                <VmcDataTable data={records} loading={loading} showPdf={true} />
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '20px' }}>Municipal Assessment Summary</h2>
                <VmcDataTable data={records.slice(0, 3)} loading={loading} />
            </div>
        </div>
    );
};

export default TaxDashboard;

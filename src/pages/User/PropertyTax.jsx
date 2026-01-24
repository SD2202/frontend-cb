import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, FileText, ExternalLink } from 'lucide-react';

const PropertyTax = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTaxData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/user/property-tax');
                setRecords(response.data);
            } catch (error) {
                console.error("Error fetching property tax data:", error);
                // If endpoint doesn't exist, try admin endpoint
                try {
                    const response = await axios.get('http://localhost:8000/api/admin/tax');
                    setRecords(response.data);
                } catch (err) {
                    console.error("Error fetching tax data:", err);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchTaxData();
    }, []);

    const handleDownloadPdf = (id) => {
        window.open(`http://localhost:8000/api/user/property-tax/pdf/${id}`, '_blank');
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>Property Tax Records</h1>
                    <p style={{ color: 'var(--text-muted)' }}>View and download your property tax receipts and payment history.</p>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <input
                            type="text"
                            placeholder="Search by Receipt No, Name, or Bill No..."
                            style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.9rem' }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading property tax records...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}>S.No</th>
                                <th>Receipt No</th>
                                <th>Receipt Date</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Description</th>
                                <th>Bill No</th>
                                <th>Property Tax Year</th>
                                <th>Amount (INR)</th>
                                <th>PDF</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan="10" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                        No property tax records found.
                                    </td>
                                </tr>
                            ) : (
                                records.map((record, index) => (
                                    <tr key={record.id || index}>
                                        <td>{record.sno || index + 1}</td>
                                        <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{record.receipt_no || record.customer_id}</td>
                                        <td>{record.receipt_date || record.date}</td>
                                        <td>{record.name || record.owner_name}</td>
                                        <td style={{ fontSize: '0.85rem', maxWidth: '200px' }}>{record.address || record.description}</td>
                                        <td style={{ fontSize: '0.85rem' }}>{record.property_description || record.description}</td>
                                        <td>{record.bill_no || record.customer_id}</td>
                                        <td>{record.property_tax_year || record.year || '2025'}</td>
                                        <td style={{ fontWeight: '600' }}>₹{parseFloat(record.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td>
                                            <button
                                                onClick={() => handleDownloadPdf(record.id || record.customer_id)}
                                                style={{ 
                                                    background: 'none', 
                                                    border: 'none', 
                                                    color: 'var(--primary)', 
                                                    cursor: 'pointer', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '4px', 
                                                    fontSize: '0.85rem',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                <FileText size={16} /> PDF <ExternalLink size={12} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default PropertyTax;

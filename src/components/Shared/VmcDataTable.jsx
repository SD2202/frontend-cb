import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';

const VmcDataTable = ({ data, loading, showPdf = false }) => {
    if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Fetching secure VMC data...</div>;

    const handleDownloadPdf = (id) => {
window.open(
  "https://chatbot-backend-1-phyu.onrender.com/api/property-tax/pdf/" + propertyId,
  "_blank");
    };

    return (
        <table>
            <thead>
                <tr>
                    <th style={{ width: '60px' }}>S.No</th>
                    <th>Customer ID</th>
                    <th>Phone Number</th>
                    <th>Owner Name</th>
                    <th>Description Details</th>
                    <th>Properties Tax Status</th>
                    <th>Amount Detail</th>
                    <th>Assessment Year</th>
                    {showPdf && <th>Action</th>}
                </tr>
            </thead>
            <tbody>
                {data.map((record) => (
                    <tr key={record.customer_id || record.id}>
                        <td>{record.sno}</td>
                        <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{record.customer_id}</td>
                        <td style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{record.phone}</td>
                        <td>{record.owner_name}</td>
                        <td style={{ fontSize: '0.85rem' }}>{record.description}</td>
                        <td>
                            <span style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                backgroundColor: record.status === 'Paid' ? '#dcfce7' : record.status === 'Pending' ? '#fef9c3' : '#fee2e2',
                                color: record.status === 'Paid' ? '#166534' : record.status === 'Pending' ? '#854d0e' : '#991b1b'
                            }}>
                                {record.status}
                            </span>
                        </td>
                        <td style={{ fontWeight: '600' }}>₹{record.amount.toLocaleString()}</td>
                        <td>{record.year}</td>
                        {showPdf && (
                            <td>
                                <button
                                    onClick={() => handleDownloadPdf(record.id)}
                                    style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
                                >
                                    <FileText size={16} /> PDF <ExternalLink size={12} />
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default VmcDataTable;

import React, { useState, useEffect } from 'react';
import { fetchComplaints, updateComplaintStatus } from '../../services/api';
import { MapPin, ExternalLink, Search, ArrowLeft, CheckCircle, Clock } from 'lucide-react';

const ComplaintsTable = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    const loadComplaints = async () => {
        try {
            setLoading(true);
            const data = await fetchComplaints();
            const formattedData = data.map((c, index) => ({
                id: c.id,
                sno: index + 1,
                phone: c.user_mobile || "N/A",
                complaint_id: c.complaint_id,
                user_name: c.user_name || "N/A",
                description: `${c.category.replace(/_/g, ' ')} - ${c.sub_issue}${c.description ? ': ' + c.description : ''}`,
                area_ward: `${c.user_area || ''} - Ward ${c.user_ward || ''}`,
                image_url: c.image_url,
                latitude: c.latitude,
                longitude: c.longitude,
                status: c.status,
                created_at: c.created_at,
                category: c.category,
                sub_issue: c.sub_issue
            }));
            setComplaints(formattedData);

            // Re-sync selected complaint if it exists
            if (selectedComplaint) {
                const updated = formattedData.find(c => c.complaint_id === selectedComplaint.complaint_id);
                if (updated) setSelectedComplaint(updated);
            }
        } catch (error) {
            console.error("Error fetching complaints:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadComplaints();
    }, []);

    const handleStatusChange = async (id, currentStatus) => {
        const newStatus = currentStatus.toLowerCase() === 'pending' ? 'completed' : 'pending';
        try {
            await updateComplaintStatus(id, newStatus);
            await loadComplaints(); // Refresh data and sync selected view
        } catch (error) {
            alert("Failed to update status");
        }
    };

    if (selectedComplaint) {
        return (
            <div className="animate-fade-in">
                <button
                    onClick={() => setSelectedComplaint(null)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginBottom: '24px', fontWeight: '600' }}
                >
                    <ArrowLeft size={20} /> Back to List
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    <div className="card" style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>Complaint #{selectedComplaint.complaint_id}</h2>
                                <p style={{ color: 'var(--text-muted)' }}>Registered on {new Date(selectedComplaint.created_at).toLocaleString()}</p>
                            </div>
                            <span style={{
                                padding: '6px 14px',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                fontWeight: '800',
                                backgroundColor: selectedComplaint.status.toLowerCase() === 'resolved' || selectedComplaint.status.toLowerCase() === 'completed' ? '#dcfce7' : '#fef9c3',
                                color: selectedComplaint.status.toLowerCase() === 'resolved' || selectedComplaint.status.toLowerCase() === 'completed' ? '#166534' : '#854d0e'
                            }}>
                                {selectedComplaint.status.toLowerCase() === 'resolved' ? 'COMPLETED' : 'PENDING'}
                            </span>
                        </div>

                        <div style={{ display: 'grid', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Reporting Citizen</label>
                                <p style={{ fontWeight: '600' }}>{selectedComplaint.user_name} ({selectedComplaint.phone})</p>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Problem Area</label>
                                <p style={{ fontWeight: '600' }}>{selectedComplaint.description}</p>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Area and ward number</label>
                                <p style={{ fontWeight: '600' }}>{selectedComplaint.area_ward}</p>
                            </div>
                            <div style={{ marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Actions</label>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        onClick={() => handleStatusChange(selectedComplaint.complaint_id, selectedComplaint.status)}
                                        style={{
                                            flex: 1,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                            padding: '12px', borderRadius: '8px', border: 'none',
                                            backgroundColor: selectedComplaint.status.toLowerCase() === 'pending' ? '#166534' : '#fbbf24',
                                            color: 'white', fontWeight: '700', cursor: 'pointer'
                                        }}
                                    >
                                        {selectedComplaint.status.toLowerCase() === 'pending' ? <CheckCircle size={18} /> : <Clock size={18} />}
                                        Mark as {selectedComplaint.status.toLowerCase() === 'pending' ? 'Completed' : 'Pending'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div className="card" style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '16px' }}>Incident Media</h3>
                            {selectedComplaint.image_url ? (
                                <img
                                    src={`http://localhost:8000${selectedComplaint.image_url}`}
                                    alt="Complaint"
                                    style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
                                />
                            ) : (
                                <div style={{ height: '200px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                    No Image Provided
                                </div>
                            )}
                        </div>

                        <div className="card" style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '16px' }}>location Tracking</h3>
                            <a
                                href={selectedComplaint.latitude && selectedComplaint.longitude ? `https://www.google.com/maps?q=${selectedComplaint.latitude},${selectedComplaint.longitude}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedComplaint.area_ward + ", Vadodara")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#eff6ff', borderRadius: '12px', color: 'var(--primary)', textDecoration: 'none', fontWeight: '700' }}
                            >
                                <MapPin size={24} />
                                <div>
                                    <p style={{ fontSize: '0.9rem' }}>Open in Google Maps</p>
                                    <p style={{ fontSize: '0.75rem', color: '#1e40af', opacity: 0.8 }}>Verify precise report coordinates</p>
                                </div>
                                <ExternalLink size={16} style={{ marginLeft: 'auto' }} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>Registered Complaints</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Monitor and track the status of municipal service requests.</p>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <input
                            type="text"
                            placeholder="Search by Complaint ID or User..."
                            style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.9rem' }}
                        />
                    </div>
                </div>

                {loading && complaints.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Accessing VMC database...</div>
                ) : (
                    <table>
                        <thead>
                            <tr style={{ textAlign: 'left' }}>
                                <th style={{ padding: '12px' }}>S.No</th>
                                <th style={{ padding: '12px' }}>Citizen Phone</th>
                                <th style={{ padding: '12px' }}>Complaint ID</th>
                                <th style={{ padding: '12px' }}>Area and ward number</th>
                                <th style={{ padding: '12px' }}>Status</th>
                                <th style={{ padding: '12px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map((c) => (
                                <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '12px' }}>{c.sno}</td>
                                    <td style={{ padding: '12px' }}>{c.phone}</td>
                                    <td style={{ padding: '12px', fontWeight: '600', color: 'var(--primary)', cursor: 'pointer' }} onClick={() => setSelectedComplaint(c)}>
                                        {c.complaint_id} <ExternalLink size={12} style={{ opacity: 0.5 }} />
                                    </td>
                                    <td style={{ padding: '12px', fontSize: '0.85rem' }}>{c.area_ward}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span onClick={() => handleStatusChange(c.complaint_id, c.status)} style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.7rem',
                                            fontWeight: '800',
                                            cursor: 'pointer',
                                            backgroundColor: c.status.toLowerCase() === 'resolved' || c.status.toLowerCase() === 'completed' ? '#dcfce7' : '#fef9c3',
                                            color: c.status.toLowerCase() === 'resolved' || c.status.toLowerCase() === 'completed' ? '#166534' : '#854d0e'
                                        }}>
                                            {c.status.toLowerCase() === 'resolved' ? 'COMPLETED' : 'PENDING'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <button
                                            onClick={() => setSelectedComplaint(c)}
                                            style={{ background: 'none', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)', cursor: 'pointer' }}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ComplaintsTable;

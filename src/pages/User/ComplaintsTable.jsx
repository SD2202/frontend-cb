import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, ExternalLink, Search, Filter } from 'lucide-react';

const ComplaintsTable = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/admin/complaints');
                setComplaints(response.data);
            } catch (error) {
                console.error("Error fetching complaints:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, []);

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

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Accessing VMC database...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}>S.No</th>
                                <th>Phone Number</th>
                                <th>Complaint ID</th>
                                <th>User Name</th>
                                <th>Complaint Description</th>
                                <th>Ward No.</th>
                                <th>Location</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.sno}</td>
                                    <td>{c.phone}</td>
                                    <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{c.complaint_id}</td>
                                    <td>{c.user_name}</td>
                                    <td style={{ maxWidth: '250px', fontSize: '0.85rem' }}>{c.description}</td>
                                    <td>{c.ward_number}</td>
                                    <td>
                                        <a 
                                            href={c.ward_location?.startsWith('http') ? c.ward_location : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.ward_location || `Ward ${c.ward_number}, Vadodara`)}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '500' }}
                                        >
                                            <MapPin size={14} /> View Location <ExternalLink size={12} />
                                        </a>
                                    </td>
                                    <td>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            backgroundColor: c.status === 'Completed' || c.status === 'completed' ? '#dcfce7' : 
                                                          c.status === 'Pending' || c.status === 'pending' ? '#fef9c3' : 
                                                          c.status === 'Active' || c.status === 'active' ? '#dbeafe' : '#fee2e2',
                                            color: c.status === 'Completed' || c.status === 'completed' ? '#166534' : 
                                                  c.status === 'Pending' || c.status === 'pending' ? '#854d0e' : 
                                                  c.status === 'Active' || c.status === 'active' ? '#1e40af' : '#991b1b'
                                        }}>
                                            {c.status.toUpperCase()}
                                        </span>
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

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, MessageSquare, Database, ChevronRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [recentComplaints, setRecentComplaints] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // For demo, we use a mock user ID
    const MOCK_USER_ID = "1234567890";

    // Function to get IST time (GMT+5:30)
    const getISTTime = () => {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const ist = new Date(utc + (5.5 * 3600000));
        return ist;
    };

    // Function to format date in DD-MM-YYYY format
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [profileRes, complaintsRes, allComplaintsRes] = await Promise.all([
                    axios.get(`http://localhost:8000/api/user/profile/${MOCK_USER_ID}`),
                    axios.get(`http://localhost:8000/api/admin/complaints/recent`),
                    axios.get(`http://localhost:8000/api/admin/complaints`)
                ]);
                setProfile(profileRes.data);
                const recent = complaintsRes.data.slice(0, 5);
                setRecentComplaints(recent);

                // Process chart data - group by date and status
                const complaints = allComplaintsRes.data || [];
                const dateMap = {};
                
                // Generate last 7 days
                const dates = [];
                for (let i = 6; i >= 0; i--) {
                    const date = new Date(getISTTime());
                    date.setDate(date.getDate() - i);
                    dates.push(formatDate(date));
                }

                // Initialize dates
                dates.forEach(date => {
                    dateMap[date] = { date, Pending: 0, Completed: 0, Active: 0 };
                });

                // Count complaints by date and status
                complaints.forEach(complaint => {
                    const complaintDate = formatDate(new Date(complaint.created_at || complaint.date || new Date()));
                    if (dateMap[complaintDate]) {
                        const status = complaint.status || 'Pending';
                        if (status === 'Completed' || status === 'completed') {
                            dateMap[complaintDate].Completed++;
                        } else if (status === 'Active' || status === 'active') {
                            dateMap[complaintDate].Active++;
                        } else {
                            dateMap[complaintDate].Pending++;
                        }
                    }
                });

                setChartData(Object.values(dateMap));
            } catch (error) {
                console.error("Error fetching user data:", error);
                // Set default chart data if API fails
                const dates = [];
                for (let i = 6; i >= 0; i--) {
                    const date = new Date(getISTTime());
                    date.setDate(date.getDate() - i);
                    dates.push({
                        date: formatDate(date),
                        Pending: Math.floor(Math.random() * 10),
                        Completed: Math.floor(Math.random() * 10),
                        Active: Math.floor(Math.random() * 10)
                    });
                }
                setChartData(dates);
                // Set default profile if API fails
                if (!profile) {
                    setProfile({
                        user_id: MOCK_USER_ID,
                        language_preference: 'general',
                        status: 'active'
                    });
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>Citizen Dashboard</h1>
                <p style={{ color: 'var(--text-muted)' }}>Access your official records and track municipal requests.</p>
            </div>

            <div className="grid-dashboard" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ padding: '10px', background: '#e8eaf6', borderRadius: '10px', color: 'var(--primary)' }}>
                            <User size={20} />
                        </div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Account Overview</h3>
                    </div>
                    {loading ? <p>Loading...</p> : (
                        profile ? (
                            <div style={{ fontSize: '0.9rem' }}>
                                <p style={{ margin: '8px 0', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>MEMBER ID:</span> <strong>{profile.user_id || 'N/A'}</strong>
                                </p>
                                <p style={{ margin: '8px 0', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>PREFERENCE:</span> <strong>{profile.language_preference?.toUpperCase() || 'GENERAL'}</strong>
                                </p>
                                <p style={{ margin: '8px 0' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>STATUS:</span> <strong style={{ color: '#166534' }}>{profile.status?.toUpperCase() || 'ACTIVE'}</strong>
                                </p>
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-muted)' }}>Unable to load profile data</p>
                        )
                    )}
                </div>

                <div className="card" style={{ padding: '24px', cursor: 'pointer' }} onClick={() => navigate('/complaints')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ padding: '10px', background: '#e8eaf6', borderRadius: '10px', color: 'var(--primary)' }}>
                            <MessageSquare size={20} />
                        </div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Recent Complaints</h3>
                    </div>
                    <div>
                        <p style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b' }}>{recentComplaints.length}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Active Service Requests</p>
                    </div>
                </div>

                <div className="card" style={{ padding: '24px', cursor: 'pointer' }} onClick={() => navigate('/property-tax')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ padding: '10px', background: '#e8eaf6', borderRadius: '10px', color: 'var(--primary)' }}>
                            <Database size={20} />
                        </div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Property Tax</h3>
                    </div>
                    <div>
                        <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>View Records</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Access your annual tax receipts</p>
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginTop: '32px', padding: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '20px' }}>Complaint Status Overview</h2>
                {chartData.length > 0 && (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Pending" stroke="#fbbf24" strokeWidth={2} />
                            <Line type="monotone" dataKey="Completed" stroke="#10b981" strokeWidth={2} />
                            <Line type="monotone" dataKey="Active" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>

            <div className="card" style={{ marginTop: '32px', padding: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '20px' }}>Recent Complaints</h2>
                {recentComplaints.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No recent interaction logs found.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {recentComplaints.map((c, idx) => (
                            <div key={idx} style={{
                                padding: '14px 18px',
                                background: '#ffffff',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '800', textTransform: 'uppercase' }}>
                                        {c.complaint_id} • Ward {c.ward_number}
                                    </p>
                                    <p style={{ fontSize: '0.95rem', color: '#334155', fontWeight: '600' }}>{c.description}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        fontWeight: '700',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        backgroundColor: c.status === 'Completed' || c.status === 'completed' ? '#dcfce7' : 
                                                      c.status === 'Pending' || c.status === 'pending' ? '#fef9c3' : 
                                                      c.status === 'Active' || c.status === 'active' ? '#dbeafe' : '#fee2e2',
                                        color: c.status === 'Completed' || c.status === 'completed' ? '#166534' : 
                                              c.status === 'Pending' || c.status === 'pending' ? '#854d0e' : 
                                              c.status === 'Active' || c.status === 'active' ? '#1e40af' : '#991b1b'
                                    }}>{c.status.toUpperCase()}</span>
                                    <ChevronRight size={18} color="var(--text-muted)" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;

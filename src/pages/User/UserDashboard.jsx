import React, { useState, useEffect } from 'react';
import { fetchComplaints } from '../../services/api';
import { User, MessageSquare, Database, ChevronRight, MapPin, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [recentComplaints, setRecentComplaints] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const MOCK_USER_ID = "1234567890";

    const getISTTime = () => {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const ist = new Date(utc + (5.5 * 3600000));
        return ist;
    };

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    useEffect(() => {
        const loadUserData = async () => {
            try {
                // Fetch only complaints for now as profile API doesn't exist
                const complaintsData = await fetchComplaints();

                // Filter for "recent" (just take last 5)
                const recent = complaintsData.slice(0, 5).map(c => ({
                    complaint_id: c.complaint_id,
                    ward_number: c.ward_number || 'N/A',
                    description: `${c.category} - ${c.sub_issue}`,
                    status: c.status,
                    created_at: c.created_at
                }));
                setRecentComplaints(recent);

                // Process chart data
                const dateMap = {};
                const dates = [];
                for (let i = 6; i >= 0; i--) {
                    const date = new Date(getISTTime());
                    date.setDate(date.getDate() - i);
                    dates.push(formatDate(date));
                }
                dates.forEach(date => {
                    dateMap[date] = { date, Pending: 0, Completed: 0 };
                });

                complaintsData.forEach(complaint => {
                    const complaintDate = formatDate(new Date(complaint.created_at || new Date()));
                    if (dateMap[complaintDate]) {
                        const status = (complaint.status || 'Pending').toLowerCase();
                        if (status === 'completed' || status === 'resolved') {
                            dateMap[complaintDate].Completed++;
                        } else {
                            dateMap[complaintDate].Pending++;
                        }
                    }
                });
                setChartData(Object.values(dateMap));

                // Mock profile data since backend endpoint isn't ready
                setProfile({
                    user_id: MOCK_USER_ID,
                    language_preference: 'English',
                    status: 'active'
                });

            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadUserData();
        const interval = setInterval(loadUserData, 5000);
        return () => clearInterval(interval);
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

            <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div className="card" style={{ padding: '24px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '24px' }}>Daily Case Resolution Performance</h2>
                    {chartData.length > 0 && (
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend
                                    verticalAlign="top"
                                    align="right"
                                    iconType="circle"
                                    wrapperStyle={{ paddingBottom: '20px' }}
                                />
                                <Bar
                                    dataKey="Completed"
                                    stackId="a"
                                    fill="#10b981"
                                    radius={[0, 0, 4, 4]}
                                    barSize={35}
                                />
                                <Bar
                                    dataKey="Pending"
                                    stackId="a"
                                    fill="#fbbf24"
                                    radius={[4, 4, 0, 0]}
                                    barSize={35}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', color: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <CheckCircle size={24} opacity={0.8} />
                            <span style={{ fontSize: '0.75rem', fontWeight: '800', background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '12px' }}>SUCCESS RATE</span>
                        </div>
                        <p style={{ fontSize: '2rem', fontWeight: '800' }}>
                            {Math.round((chartData.reduce((acc, curr) => acc + curr.Completed, 0) / (recentComplaints.length || 1)) * 100)}%
                        </p>
                        <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Overall issues resolved from recent activity</p>
                    </div>

                    <div className="card" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={16} /> Volume Summary
                        </h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Completed</span>
                            <span style={{ fontWeight: '700', color: '#10b981' }}>{chartData.reduce((acc, curr) => acc + curr.Completed, 0)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Pending</span>
                            <span style={{ fontWeight: '700', color: '#fbbf24' }}>{chartData.reduce((acc, curr) => acc + curr.Pending, 0)}</span>
                        </div>
                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: '800', fontSize: '0.85rem' }}>Total Volume</span>
                            <span style={{ fontWeight: '800' }}>{recentComplaints.length}</span>
                        </div>
                    </div>
                </div>
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
                                        backgroundColor: c.status === 'Completed' || c.status === 'completed' || c.status === 'Resolved' || c.status === 'resolved' ? '#dcfce7' :
                                            c.status === 'Pending' || c.status === 'pending' ? '#fef9c3' :
                                                c.status === 'Active' || c.status === 'active' ? '#dbeafe' : '#fee2e2',
                                        color: c.status === 'Completed' || c.status === 'completed' || c.status === 'Resolved' || c.status === 'resolved' ? '#166534' :
                                            c.status === 'Pending' || c.status === 'pending' ? '#854d0e' :
                                                c.status === 'Active' || c.status === 'active' ? '#1e40af' : '#991b1b'
                                    }}>{c.status.toLowerCase() === 'resolved' ? 'COMPLETED' : c.status.toUpperCase()}</span>
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

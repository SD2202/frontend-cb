import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Globe, Clock, ChevronRight, BarChart3 } from 'lucide-react';

const QueriesDashboard = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQueries = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/admin/queries');
                setSessions(response.data);
            } catch (error) {
                console.error("Error fetching queries:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQueries();
        const interval = setInterval(fetchQueries, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>Citizen Service Queries</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Monitoring incoming portal requests and service interactions.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)', fontSize: '0.875rem', padding: '8px 16px', background: 'white', border: '1px solid var(--border)', borderRadius: '6px' }}>
                    <BarChart3 size={18} /> Live Service Traffic
                </div>
            </div>

            <div className="grid-dashboard">
                {loading && sessions.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading request streams...</div>
                ) : sessions.length === 0 ? (
                    <div className="card" style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No active queries reported in the last 24 hours.
                    </div>
                ) : (
                    sessions.map((session) => (
                        <div key={session.user_id} className="card" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ padding: '10px', background: '#eff6ff', borderRadius: '10px', color: 'var(--primary)' }}>
                                        <MessageSquare size={20} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>#{session.user_id.slice(-6)}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            <Globe size={12} /> {session.language?.toUpperCase() || 'GENERAL'}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    <Clock size={12} /> {new Date(session.last_active * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>

                            <div style={{ background: '#f1f5f9', borderRadius: '8px', padding: '12px', marginBottom: '16px', borderLeft: '3px solid var(--primary)' }}>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 'bold' }}>LATEST INQUIRY</p>
                                <p style={{ fontSize: '0.85rem', color: '#1e293b' }}>
                                    {session.recent_messages.length > 0 ? session.recent_messages[session.recent_messages.length - 1].content : 'No data available'}
                                </p>
                            </div>

                            <button style={{ width: '100%', background: 'none', border: '1px solid var(--border)', padding: '8px', borderRadius: '6px', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                Review Full Case <ChevronRight size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default QueriesDashboard;

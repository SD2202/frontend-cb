import React, { useState, useEffect } from 'react';
import { fetchProperties } from '../../services/api';
import { User, Mail, Phone, MapPin, Shield, Edit } from 'lucide-react';
import VmcDataTable from '../../components/Shared/VmcDataTable';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    const MOCK_USER_ID = "1234567890";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const taxData = await fetchProperties();

                // Map tax data for table
                const formattedTaxData = taxData.map((item, index) => ({
                    sno: index + 1,
                    customer_id: item.property_id,
                    phone: "N/A",
                    owner_name: item.owner_name,
                    description: item.address,
                    status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
                    amount: item.amount,
                    year: item.year,
                    id: item.property_id
                }));

                // Mock profile data
                setProfile({
                    user_id: MOCK_USER_ID,
                    language: 'English',
                    status: 'active',
                    name: 'Admin User',
                    role: 'Administrator'
                });

                // Filter records if needed (demo logic kept simple, showing all for now or first few)
                setRecords(formattedTaxData.slice(0, 5));

            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>Administrative Profile</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your official credentials and associated municipal records.</p>
                </div>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Edit size={18} /> Edit Profile
                </button>
            </div>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                <div className="card" style={{ flex: '1', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                            <User size={40} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Mr. Administrative Officer</h2>
                            <p style={{ color: 'var(--text-muted)' }}>VMC Senior Administrator</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                            <Mail size={16} color="var(--text-muted)" /> <span>admin@vmc.gov.in</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                            <Phone size={16} color="var(--text-muted)" /> <span>+91 11-2345-6789</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                            <MapPin size={16} color="var(--text-muted)" /> <span>Main Municipal Building, VMC HQ</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                            <Shield size={16} color="#166534" /> <span style={{ color: '#166534', fontWeight: '600' }}>Full System Access Verified</span>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ flex: '1', padding: '24px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px' }}>Access Statistics</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 'bold' }}>LAST LOGIN</p>
                            <p style={{ fontSize: '1rem', fontWeight: '600' }}>Today, 09:45 AM</p>
                        </div>
                        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 'bold' }}>IP ADDRESS</p>
                            <p style={{ fontSize: '1rem', fontWeight: '600' }}>192.168.1.105</p>
                        </div>
                        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 'bold' }}>TASKS COMPLETED</p>
                            <p style={{ fontSize: '1rem', fontWeight: '600' }}>142</p>
                        </div>
                        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 'bold' }}>SECURITY LEVEL</p>
                            <p style={{ fontSize: '1rem', fontWeight: '600' }}>Tier-1</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '20px' }}>Assigned Municipal Records</h3>
                <VmcDataTable data={records} loading={loading} />
            </div>
        </div>
    );
};

export default Profile;

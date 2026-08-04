// client/src/core/components/IconsGrid.jsx
import React from 'react';
import { 
  Menu, 
  Home, 
  Contact, 
  User, 
  MessageSquare, 
  Settings, 
  MapPin, 
  Calendar, 
  Clock, 
  Bell, 
  History, 
  Stethoscope, 
  FlaskConical, 
  Building2, 
  Pill, 
  FileText, 
  Gauge 
} from 'lucide-react';

const MENU_ITEMS = [
  { id: 'menu', label: 'Menu', icon: Menu },
  { id: 'home', label: 'Home', icon: Home },
  { id: 'contacts', label: 'Contacts', icon: Contact },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'maps', label: 'Maps', icon: MapPin },
  { id: 'calendars', label: 'Calendars', icon: Calendar },
  { id: 'appointments', label: 'Appointments', icon: Clock },
  { id: 'notification', label: 'Notification', icon: Bell },
  { id: 'history', label: 'History', icon: History },
  { id: 'doctors', label: 'Doctors', icon: Stethoscope },
  { id: 'laboratory', label: 'Laboratory', icon: FlaskConical },
  { id: 'clinics', label: 'Clinics', icon: Building2 },
  { id: 'medcins', label: 'Medcins', icon: Pill },
  { id: 'treatments', label: 'Treatments', icon: FileText },
  { id: 'dashboard', label: 'Dashboard', icon: Gauge },
];

export default function IconsGrid() {
  return (
    <div style={{ padding: '30px', backgroundColor: '#0a1120', borderRadius: '20px', margin: '20px auto', maxWidth: '1000px', textAlign: 'center' }}>
      <h2 style={{ color: '#22d3ee', marginBottom: '30px', fontSize: '22px' }}>أقسام المنصة والخدمات</h2>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', justifyContent: 'center' }}>
        {MENU_ITEMS.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90px' }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: '#131f37',
                border: '4px solid #22d3ee',
                boxShadow: '0 0 15px rgba(34,211,238,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px',
                cursor: 'pointer'
              }}>
                <IconComponent style={{ width: '32px', height: '32px', color: '#ffffff' }} />
              </div>
              <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 'bold' }}>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
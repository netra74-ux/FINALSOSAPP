export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  avatar: string;
}

export interface SosLog {
  id: string;
  timestamp: Date;
  latitude: number;
  longitude: number;
  address: string;
  contactsNotified: number;
  duration: number; // seconds
  status: 'resolved' | 'cancelled' | 'active';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodType: string;
  medicalNotes: string;
  avatar: string;
}

export const MOCK_USER: UserProfile = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  phone: '+1 (555) 234-5678',
  bloodType: 'O+',
  medicalNotes: 'No known allergies. Asthmatic.',
  avatar: 'AJ',
};

export const MOCK_CONTACTS: EmergencyContact[] = [
  {
    id: 'c-1',
    name: 'Sarah Johnson',
    phone: '+1 (555) 123-4567',
    relation: 'Spouse',
    avatar: 'SJ',
  },
  {
    id: 'c-2',
    name: 'Dr. Mark Lee',
    phone: '+1 (555) 987-6543',
    relation: 'Doctor',
    avatar: 'ML',
  },
  {
    id: 'c-3',
    name: 'Mom',
    phone: '+1 (555) 456-7890',
    relation: 'Parent',
    avatar: 'MO',
  },
];

export const MOCK_LOGS: SosLog[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    latitude: 40.7128,
    longitude: -74.006,
    address: '350 5th Ave, New York, NY 10118',
    contactsNotified: 3,
    duration: 142,
    status: 'resolved',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    latitude: 40.7484,
    longitude: -73.9967,
    address: '20 W 34th St, New York, NY 10001',
    contactsNotified: 3,
    duration: 68,
    status: 'cancelled',
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    latitude: 40.6892,
    longitude: -74.0445,
    address: 'Liberty Island, New York, NY 10004',
    contactsNotified: 2,
    duration: 310,
    status: 'resolved',
  },
];

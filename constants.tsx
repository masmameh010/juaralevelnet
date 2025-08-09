import { User, UserRole } from './types';
import type React from 'react';

// Anda dapat mengganti nilai Base64 di bawah ini dengan logo Anda sendiri.
export const LOGO_URL = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTM1IDMyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGFyaWEtbGFiZWw9IkxldmVscm5ldCBMb2dvIj48cGF0aCBkPSJNMjYuNDc4IDIuNjI1SDUuNTIyYTMuMTI1IDMuMTI1IDAgMCAwLTMuMTI1IDMuMTI1djIwLjc1YTMuMTI1IDMuMTI1IDAgMCAwIDMuMTI1IDMuMTI1aDIwLjk1NmEzLjEyNSAzLjEyNSAwIDAgMCAzLjEyNS0zLjEyNVY1Ljc1YTMuMTI1IDMuMTI1IDAgMCAwLTMuMTI1LTMuMTI1WiIgZmlsbD0iIzNCODJGNiIvPjxwYXRoIGQ9Ik05Ljg5NiAxNS42OThjLjU1LS41NDIuODI1LTEuMjUuODI1LTIuMTI1cy0uMjc1LTEuNTgzLS44MjUtMi4xMjVhMi43NiAyLjc2IDAgMCAwLTIuMDYyLS44NzUgMi43NiAyLjc2IDAgMCAwLTIuMDYzLjg3NWMtLjU1LS41NDItLjgyNSAxLjI1LS44MjUgMi4xMjVzLjI3NSAxLjU4My44MjUgMi4xMjVhMi43NiAyLjc2IDAgMCAwIDIuMDYzLjg3NWMuNzM3IDAgMS40LS4yOTIgMi4wNjItLjg3NVpNMjIuMDY4IDkuNTQyYy0uNDEyIDAtLjgyNS4xNDYtMS4yMzcuNDM4bC00LjUyMSAzLjI1Yy0uMjc1LjIxOC0uNDEzLjUxLS40MTMuODc1cy4xMzguNjU2LjQxMy44NzVsNC41MiAzLjI1Yy40MTMuMjkyLjgyNS40MzggMS4yMzguNDM4YTIuMzEgMi4zMSAwIDAgMCAxLjY1LS43NWMuNDEyLS40MzguNjE4LTEgLjYxOC0xLjYyNVYxMS45MmMwLS42MjUtLjIwNi0xLjE4Ny0uNjE4LTEuNjI1YTIuMzEgMi4zMSAwIDAgMC0xLjY1LS43NTNaIiBmaWxsPSIjRkZGRkZGIi8+PHRleHQgeD0iNDAiIHk9IjIzIiBmb250RmFtaWx5PSItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsICdTZWdvZSBVSScsIFJvYm90bywgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZiIgZm9udFNpemU9IjIwIiBmb250V2VpZ2h0PSI3MDAiIGZpbGw9ImN1cnJlbnRDb2xvciI+TEVWRUxORVQ8L3RleHQ+PC9zdmc+';


// For demonstration, passwords are in plaintext. In a real app, use a secure backend.
export const SALES_USERS: User[] = [
  { id: 'sales-1', name: 'Azairin Arwan', role: UserRole.SALES, email: 'azairin@levelnet.com', password: 'password123' },
  { id: 'sales-2', name: 'Alvin', role: UserRole.SALES, email: 'alvin@levelnet.com', password: 'password123' },
  { id: 'sales-3', name: 'Dika Alfian Fauzan', role: UserRole.SALES, email: 'dika@levelnet.com', password: 'password123' },
  { id: 'sales-4', name: 'M Rian Supriadi', role: UserRole.SALES, email: 'rian@levelnet.com', password: 'password123' },
  { id: 'sales-5', name: 'Natali Oktaviana', role: UserRole.SALES, email: 'natali@levelnet.com', password: 'password123' },
  { id: 'sales-6', name: 'Aditya Surya Nugroho', role: UserRole.SALES, email: 'aditya@levelnet.com', password: 'password123' },
];

export const ADMIN_USERS: User[] = [
  { id: 'admin-1', name: 'Super Admin', role: UserRole.SUPER_ADMIN, email: 'superadmin@levelnet.com', password: 'superpassword' },
  { id: 'admin-2', name: 'Admin 2', role: UserRole.ADMIN, email: 'admin2@levelnet.com', password: 'adminpassword' },
  { id: 'admin-3', name: 'Admin 3', role: UserRole.ADMIN, email: 'admin3@levelnet.com', password: 'adminpassword' },
];

export const ALL_USERS: User[] = [...SALES_USERS, ...ADMIN_USERS];


const iconProps = {
  className: "h-6 w-6 shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
};

export const MENU_ITEMS = [
    { name: 'Dashboard', path: '/', icon: <HomeIcon {...iconProps} /> },
    { name: 'Laporan Kunjungan', path: '/laporan', icon: <ReportIcon {...iconProps} /> },
    { name: 'Rekap Data', path: '/rekap', icon: <ChartIcon {...iconProps} /> },
    { name: 'Pendaftaran Pelanggan', path: '/pendaftaran', icon: <UserPlusIcon {...iconProps} /> },
    { name: 'Leads Manager', path: '/leads', icon: <LeadsIcon {...iconProps} /> },
    { name: 'Media', path: '/media', icon: <MediaIcon {...iconProps} /> },
    { name: 'Data Akun', path: '/akun', icon: <UsersIcon {...iconProps} /> },
];

export const MEDIA_LINKS = [
  {
    title: 'Brosur Produk',
    description: 'Brosur lengkap mengenai layanan internet dan paket yang ditawarkan.',
    url: 'https://docs.google.com/document/d/1gYy3v2zR_8vW-xX2AmAlF5A_8B4XnJqP/edit?usp=sharing&ouid=112345678901234567890&rtpof=true&sd=true', // Ganti dengan URL Anda
    icon: 'pdf'
  },
  {
    title: 'Banner Promosi',
    description: 'Kumpulan banner digital untuk promosi di media sosial atau cetak.',
    url: 'https://docs.google.com/document/d/1gYy3v2zR_8vW-xX2AmAlF5A_8B4XnJqP/edit?usp=sharing&ouid=112345678901234567890&rtpof=true&sd=true', // Ganti dengan URL Anda
    icon: 'image'
  },
  {
    title: 'Video Company Profile',
    description: 'Video singkat yang memperkenalkan LEVELNET dan keunggulannya.',
    url: 'https://docs.google.com/document/d/1gYy3v2zR_8vW-xX2AmAlF5A_8B4XnJqP/edit?usp=sharing&ouid=112345678901234567890&rtpof=true&sd=true', // Ganti dengan URL Anda
    icon: 'video'
  },
    {
    title: 'Script Penjualan',
    description: 'Panduan dan script untuk membantu tim sales dalam melakukan penawaran.',
    url: 'https://docs.google.com/document/d/1gYy3v2zR_8vW-xX2AmAlF5A_8B4XnJqP/edit?usp=sharing&ouid=112345678901234567890&rtpof=true&sd=true', // Ganti dengan URL Anda
    icon: 'document'
  }
];


// SVG Icon Components
function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
    </svg>
  );
}

function ReportIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  );
}

function ChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

function UserPlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
    </svg>
  );
}

function LeadsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

function MediaIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M12 3.375c-1.841 0-3.375 1.493-3.375 3.333V9.75c0 1.84 1.534 3.333 3.375 3.333c1.84 0 3.375-1.493 3.375-3.333V6.708c0-1.84-1.535-3.333-3.375-3.333z" />
    </svg>
  );
}
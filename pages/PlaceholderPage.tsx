
import React from 'react';
import { Card } from '../components/ui/Card';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{title}</h1>
        <Card>
            <div className="text-center py-16">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">Fitur Dalam Pengembangan</h2>
                <p className="mt-1 text-gray-500 dark:text-gray-400">Halaman untuk {title} sedang dalam pengerjaan dan akan segera tersedia.</p>
            </div>
        </Card>
    </div>
  );
};

export default PlaceholderPage;


import React from 'react';
import { Card } from '../components/ui/Card';
import { MEDIA_LINKS } from '../constants';

const PdfIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.267 3.333A2.667 2.667 0 0 0 6 5.333v13.334a2.667 2.667 0 0 0 2.667 2.666h7.066a.667.667 0 0 0 .447-1.033l-4.553-5.747a.667.667 0 0 1 .5-.967h3.88a.667.667 0 0 0 .666-.667V9.333a.667.667 0 0 0-.666-.666h-3.88a.667.667 0 0 1-.5-.967l4.553-5.747a.667.667 0 0 0-.447-1.033H8.267Z" />
  </svg>
);
const ImageIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06l2.76-2.76a.75.75 0 0 1 1.06 0l1.06 1.06 4.69-4.69a.75.75 0 0 1 1.06 0l2.76 2.76V6H3v10.06Z" clipRule="evenodd" />
    </svg>
);
const VideoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3h-15Zm7.253 8.21-4.14-2.355a.5.5 0 0 1 0-.89l4.14-2.355a.5.5 0 0 1 .747.445v4.71a.5.5 0 0 1-.747.445Z" />
    </svg>
);
const DocumentIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a.375.375 0 0 1-.375-.375V6.75A3.75 3.75 0 0 0 9 3H5.625Z" clipRule="evenodd" />
    </svg>
);

const iconMap = {
    pdf: <PdfIcon className="h-8 w-8 text-red-500" />,
    image: <ImageIcon className="h-8 w-8 text-green-500" />,
    video: <VideoIcon className="h-8 w-8 text-blue-500" />,
    document: <DocumentIcon className="h-8 w-8 text-purple-500" />,
};

const Media: React.FC = () => {
    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Media & Materi Promo</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Gunakan tautan di bawah ini untuk mengakses materi promosi seperti brosur, banner, dan lainnya untuk kebutuhan penjualan.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
                {MEDIA_LINKS.map(link => (
                    <a 
                        key={link.title} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block group"
                    >
                        <Card className="h-full flex items-center p-6 transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02] group-hover:bg-gray-50 dark:group-hover:bg-gray-700">
                            <div className="flex-shrink-0 p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
                                {iconMap[link.icon as keyof typeof iconMap] || <DocumentIcon />}
                            </div>
                            <div className="ml-4 flex-1">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{link.title}</h2>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{link.description}</p>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 ml-2 group-hover:text-blue-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </Card>
                    </a>
                ))}
            </div>
             <Card className="mt-8 text-center bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <p className="text-yellow-800 dark:text-yellow-200">
                    <strong>Penting:</strong> Tautan akan terbuka di tab baru. Pastikan Anda sudah login ke akun Google Anda untuk mengakses file di Google Drive.
                </p>
             </Card>
        </div>
    );
};

export default Media;

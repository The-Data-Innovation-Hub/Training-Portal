import React, { useState } from 'react';
import { ArrowLeft, Award, Calendar, Download, Printer } from 'lucide-react';
import { Certificate } from '../types';
import CertificateComponent from './Certificate';
import { toast } from 'react-hot-toast';

interface CertificateViewerProps {
  certificates: Certificate[];
  onBack: () => void;
}

const CertificateViewer: React.FC<CertificateViewerProps> = ({ certificates, onBack }) => {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  const handlePrint = () => {
    window.print();
    toast.success('Certificate sent to printer');
  };

  const handleDownload = () => {
    // In a real implementation, this would generate and download a PDF
    toast.success('Certificate downloaded successfully');
  };

  if (selectedCertificate) {
    return (
      <div className="bg-white rounded-xl shadow-neumorph p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedCertificate(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">View Certificate</h2>
        </div>

        <CertificateComponent
          certificate={selectedCertificate}
          onPrint={handlePrint}
          onDownload={handleDownload}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-neumorph p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">My Certificates</h2>
        </div>
      </div>

      {/* Certificates List */}
      <div className="grid grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-white rounded-xl shadow-neumorph-sm p-6 hover:shadow-neumorph transition-all duration-200 cursor-pointer"
            onClick={() => setSelectedCertificate(cert)}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">{cert.courseName}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={14} />
                  <span>Issued on {new Date(cert.issueDate).toLocaleDateString()}</span>
                </div>
                {cert.grade && (
                  <div className="mt-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Grade: {cert.grade}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrint();
                  }}
                  className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Printer size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                  }}
                  className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificateViewer;
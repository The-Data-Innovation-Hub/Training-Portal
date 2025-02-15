import React from 'react';
import { Certificate as CertificateType } from '../types';
import { Download, Printer } from 'lucide-react';

interface CertificateProps {
  certificate: CertificateType;
  onPrint?: () => void;
  onDownload?: () => void;
}

const Certificate: React.FC<CertificateProps> = ({ certificate, onPrint, onDownload }) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Certificate Preview */}
      <div className="bg-white rounded-xl shadow-neumorph p-8 mb-6">
        <div className="border-8 border-primary/20 p-8 rounded-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Certificate of Completion</h1>
            <p className="text-gray-600">This is to certify that</p>
          </div>

          {/* Recipient Name */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary">{certificate.userName}</h2>
            <p className="text-gray-600 mt-2">from</p>
            <h3 className="text-xl font-semibold text-gray-800">{certificate.customerName}</h3>
          </div>

          {/* Course Details */}
          <div className="text-center mb-8">
            <p className="text-gray-600">has successfully completed the course</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">{certificate.courseName}</h3>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-3 gap-8 text-center mb-8">
            <div>
              <p className="text-gray-500 text-sm">Certificate Number</p>
              <p className="font-medium text-gray-800">{certificate.certificateNumber}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Issue Date</p>
              <p className="font-medium text-gray-800">
                {new Date(certificate.issueDate).toLocaleDateString()}
              </p>
            </div>
            {certificate.expiryDate && (
              <div>
                <p className="text-gray-500 text-sm">Expiry Date</p>
                <p className="font-medium text-gray-800">
                  {new Date(certificate.expiryDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Grade (if available) */}
          {certificate.grade && (
            <div className="text-center mb-8">
              <p className="text-gray-500 text-sm">Grade Achieved</p>
              <p className="text-2xl font-bold text-primary">{certificate.grade}</p>
            </div>
          )}

          {/* Signatures */}
          {certificate.signatures && certificate.signatures.length > 0 && (
            <div className="grid grid-cols-2 gap-8 mt-12">
              {certificate.signatures.map((sig, index) => (
                <div key={index} className="text-center">
                  <div className="h-16 flex items-end justify-center">
                    <img
                      src={sig.signature}
                      alt={`${sig.name}'s signature`}
                      className="h-12 object-contain"
                    />
                  </div>
                  <div className="border-t border-gray-300 pt-2 mt-2">
                    <p className="font-medium text-gray-800">{sig.name}</p>
                    <p className="text-sm text-gray-500">{sig.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onPrint}
          className="px-4 py-2 bg-primary text-white rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Printer size={20} />
          Print Certificate
        </button>
        <button
          onClick={onDownload}
          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <Download size={20} />
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default Certificate;
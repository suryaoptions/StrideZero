
import React, { useState, useEffect } from 'react';
import { X, Download, FileText, CheckCircle } from 'lucide-react';
import { PRODUCTS, CURRENCY_MAP } from '../constants';
import { Country } from '../types';

interface AdminReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SalesRecord {
  sNo: number;
  customerName: string;
  itemNo: string; // SKU
  amount: number;
  country: Country;
}

const FIRST_NAMES = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson'];
const COUNTRIES_LIST: Country[] = ['US', 'UK', 'DE', 'JP', 'FR', 'AU', 'CA', 'IT', 'IN', 'NZ'];

const AdminReportModal: React.FC<AdminReportModalProps> = ({ isOpen, onClose }) => {
  const [reportData, setReportData] = useState<SalesRecord[]>([]);
  const [isSent, setIsSent] = useState(false);

  // Generate Report Data
  useEffect(() => {
    if (isOpen && reportData.length === 0) {
      const records: SalesRecord[] = [];
      // Generate 15-20 random records
      const count = Math.floor(Math.random() * 5) + 15;

      for (let i = 1; i <= count; i++) {
        const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
        const randomCountry = COUNTRIES_LIST[Math.floor(Math.random() * COUNTRIES_LIST.length)];
        const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        
        // Vary price slightly to simulate taxes/shipping
        const variance = Math.random() * 20;
        const finalAmount = randomProduct.price + variance;

        records.push({
          sNo: i,
          customerName: `${firstName} ${lastName}`,
          itemNo: randomProduct.id.toUpperCase(),
          amount: finalAmount,
          country: randomCountry
        });
      }
      setReportData(records);
    }
  }, [isOpen, reportData.length]);

  const handleSendReport = () => {
    // Simulate sending email logic
    console.log("Simulating Report Email Send...");
    console.table(reportData);
    setIsSent(true);
    setTimeout(() => {
      onClose();
      setIsSent(false);
    }, 2000);
  };

  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-black text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
              <FileText size={24} /> Executive Sales Report
            </h2>
            <p className="text-gray-400 text-xs mt-1 font-mono uppercase">Bi-Weekly Auto-Generated • {currentDate}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Report Content - HTML Table Simulation */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200 text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <th className="p-4 w-20">S. No.</th>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Item No.</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-center">Country Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {reportData.map((record) => (
                  <tr key={record.sNo} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-gray-500">{record.sNo}</td>
                    <td className="p-4 font-bold text-gray-900">{record.customerName}</td>
                    <td className="p-4 font-mono text-gray-600">{record.itemNo}</td>
                    <td className="p-4 text-right font-medium text-black">
                      {CURRENCY_MAP[record.country]}{record.amount.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-2 py-1 rounded bg-gray-200 text-xs font-bold text-gray-700">
                        {record.country}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-white flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-3 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSendReport}
            disabled={isSent}
            className={`px-8 py-3 rounded-lg text-sm font-bold uppercase tracking-widest text-white shadow-lg transition-all flex items-center gap-2 ${isSent ? 'bg-green-600' : 'bg-black hover:bg-gray-800 hover:-translate-y-1'}`}
          >
            {isSent ? (
              <>
                <CheckCircle size={18} /> Report Sent
              </>
            ) : (
              <>
                <Download size={18} /> Confirm & Send Report
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminReportModal;

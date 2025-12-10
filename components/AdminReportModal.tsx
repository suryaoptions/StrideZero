
import React, { useState, useEffect } from 'react';
import { X, Download, FileText, CheckCircle, Sparkles, Copy, Image as ImageIcon, Megaphone } from 'lucide-react';
import { PRODUCTS, CURRENCY_MAP } from '../constants';
import { Country } from '../types';
import { generateMarketingCopy, MarketingOutput } from '../services/geminiService';

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
  const [activeTab, setActiveTab] = useState<'report' | 'marketing'>('report');
  
  // Sales Report State
  const [reportData, setReportData] = useState<SalesRecord[]>([]);
  const [isSent, setIsSent] = useState(false);

  // Marketing Generator State
  const [selectedProductId, setSelectedProductId] = useState<string>(PRODUCTS[0].id);
  const [selectedTone, setSelectedTone] = useState<string>('Luxurious');
  const [isGenerating, setIsGenerating] = useState(false);
  const [marketingResult, setMarketingResult] = useState<MarketingOutput | null>(null);

  // Generate Report Data
  useEffect(() => {
    if (isOpen && reportData.length === 0) {
      const records: SalesRecord[] = [];
      const count = Math.floor(Math.random() * 5) + 15;

      for (let i = 1; i <= count; i++) {
        const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
        const randomCountry = COUNTRIES_LIST[Math.floor(Math.random() * COUNTRIES_LIST.length)];
        const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        
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
    console.log("Simulating Report Email Send...");
    console.table(reportData);
    setIsSent(true);
    setTimeout(() => {
      onClose();
      setIsSent(false);
    }, 2000);
  };

  const handleGenerateMarketing = async () => {
    const product = PRODUCTS.find(p => p.id === selectedProductId);
    if (!product) return;

    setIsGenerating(true);
    setMarketingResult(null);

    // Derive prompts from product data
    const features = product.materials || ['Premium construction', 'Ergonomic fit'];
    const benefit = "Experience the pinnacle of performance and luxury style.";
    const audience = "Discerning athletes and style icons who value quality.";

    const result = await generateMarketingCopy(
      product.name,
      features,
      benefit,
      audience,
      selectedTone
    );

    setMarketingResult(result);
    setIsGenerating(false);
  };

  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[90vh]">
        
        {/* Header */}
        <div className="bg-black text-white p-6 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
               StrideZero Admin
            </h2>
            <p className="text-gray-400 text-xs mt-1 font-mono uppercase">Dashboard • {currentDate}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 shrink-0">
           <button 
             onClick={() => setActiveTab('report')}
             className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 ${activeTab === 'report' ? 'bg-white border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-800'}`}
           >
             <FileText size={18} /> Sales Report
           </button>
           <button 
             onClick={() => setActiveTab('marketing')}
             className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 ${activeTab === 'marketing' ? 'bg-white border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-800'}`}
           >
             <Sparkles size={18} /> AI Marketing Studio
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          
          {/* --- SALES REPORT TAB --- */}
          {activeTab === 'report' && (
            <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr className="border-b border-gray-200 text-xs font-bold text-gray-700 uppercase tracking-wider">
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
          )}

          {/* --- MARKETING STUDIO TAB --- */}
          {activeTab === 'marketing' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
               
               {/* Controls */}
               <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                     <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Configuration</h3>
                     
                     <div className="space-y-4">
                        <div>
                           <label className="block text-xs font-bold text-gray-500 mb-1">Product</label>
                           <select 
                              value={selectedProductId}
                              onChange={(e) => setSelectedProductId(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded text-sm font-medium focus:ring-1 focus:ring-black outline-none"
                           >
                              {PRODUCTS.map(p => (
                                 <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                           </select>
                        </div>
                        
                        <div>
                           <label className="block text-xs font-bold text-gray-500 mb-1">Brand Tone</label>
                           <select 
                              value={selectedTone}
                              onChange={(e) => setSelectedTone(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded text-sm font-medium focus:ring-1 focus:ring-black outline-none"
                           >
                              <option value="Luxurious">Luxurious</option>
                              <option value="Playful">Playful</option>
                              <option value="Practical">Practical</option>
                              <option value="High-Energy">High-Energy</option>
                              <option value="Calming">Calming</option>
                           </select>
                        </div>

                        <button 
                           onClick={handleGenerateMarketing}
                           disabled={isGenerating}
                           className="w-full bg-black text-white py-3 rounded font-bold uppercase tracking-widest text-xs hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                           {isGenerating ? 'Generating...' : <><Sparkles size={14} /> Generate Content</>}
                        </button>
                     </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-xs text-blue-800">
                     <p className="font-bold mb-1">Tip:</p>
                     Use "Luxurious" for high-ticket items like Platinum Series, and "High-Energy" for performance running gear.
                  </div>
               </div>

               {/* Output */}
               <div className="lg:col-span-2 space-y-6 overflow-y-auto">
                  {marketingResult ? (
                     <>
                        {/* 1. Visual Prompt */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                           <div className="flex justify-between items-center mb-2">
                              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                 <ImageIcon size={14} /> Visual Prompt (Midjourney/DALL-E)
                              </h4>
                              <Copy size={14} className="text-gray-400 cursor-pointer hover:text-black" />
                           </div>
                           <p className="text-sm text-gray-800 bg-gray-50 p-4 rounded border border-gray-100 leading-relaxed font-mono">
                              {marketingResult.visualPrompt}
                           </p>
                        </div>

                        {/* 2. Product Description */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                           <div className="flex justify-between items-center mb-2">
                              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                 <FileText size={14} /> Website Description
                              </h4>
                              <Copy size={14} className="text-gray-400 cursor-pointer hover:text-black" />
                           </div>
                           <div className="text-sm text-gray-800 leading-relaxed">
                              {marketingResult.productDescription}
                           </div>
                        </div>

                        {/* 3. Ad Copy */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                           <div className="flex justify-between items-center mb-4">
                              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                 <Megaphone size={14} /> Social Ad Copy
                              </h4>
                              <Copy size={14} className="text-gray-400 cursor-pointer hover:text-black" />
                           </div>
                           <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-w-sm mx-auto">
                              <p className="font-bold text-black mb-2">{marketingResult.adCopy.headline}</p>
                              <p className="text-sm text-gray-700">{marketingResult.adCopy.body}</p>
                              <button className="w-full mt-3 bg-blue-500 text-white text-xs font-bold py-2 rounded">Shop Now</button>
                           </div>
                        </div>
                     </>
                  ) : (
                     <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg p-10">
                        {isGenerating ? (
                           <div className="animate-pulse flex flex-col items-center">
                              <Sparkles size={48} className="mb-4 text-brand-platinum" />
                              <p className="font-bold uppercase tracking-widest">Designing Campaign...</p>
                           </div>
                        ) : (
                           <>
                              <Sparkles size={48} className="mb-4 text-gray-300" />
                              <p className="text-sm font-medium">Select a product and tone to generate assets.</p>
                           </>
                        )}
                     </div>
                  )}
               </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        {activeTab === 'report' && (
           <div className="p-6 border-t border-gray-200 bg-white flex justify-end gap-4 shrink-0">
             <button onClick={onClose} className="px-6 py-3 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">Cancel</button>
             <button onClick={handleSendReport} disabled={isSent} className={`px-8 py-3 rounded-lg text-sm font-bold uppercase tracking-widest text-white shadow-lg transition-all flex items-center gap-2 ${isSent ? 'bg-green-600' : 'bg-black hover:bg-gray-800 hover:-translate-y-1'}`}>
               {isSent ? <><CheckCircle size={18} /> Report Sent</> : <><Download size={18} /> Confirm & Send Report</>}
             </button>
           </div>
        )}
        
        {activeTab === 'marketing' && (
           <div className="p-6 border-t border-gray-200 bg-white flex justify-end gap-4 shrink-0">
              <button onClick={onClose} className="px-6 py-3 text-sm font-bold uppercase tracking-widest text-black hover:bg-gray-100 rounded transition-colors">Close Studio</button>
           </div>
        )}

      </div>
    </div>
  );
};

export default AdminReportModal;

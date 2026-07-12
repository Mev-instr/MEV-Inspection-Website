import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { verifyCertificate, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Search, CheckCircle2, XCircle, Loader2, ArrowLeft, ShieldCheck, FileText } from 'lucide-react';
import { motion } from 'motion/react';

type CertType = 'machine' | 'lifting' | 'operator';

interface VerificationResult {
  found: boolean;
  certId?: string;
  status?: string;
  result?: string;
  validity?: string;
  expirationDate?: string;
  clientName?: string;
  equipmentName?: string;
  operatorName?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  certifiedMachines?: string | string[];
  message?: string;
}

export default function Verify() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const typeParam = searchParams.get('type') || 'all';
  
  const [searchQuery, setSearchQuery] = useState(id || '');
  const [certType, setCertType] = useState<CertType>(
    typeParam === 'all' ? 'operator' : 
    typeParam === 'liftingToolCertificates' ? 'machine' : 
    typeParam === 'operatorCards' || typeParam === 'operators' ? 'operator' :
    typeParam === 'machineCertificates' ? 'machine' : 'machine'
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'not-found'>('idle');

  useEffect(() => {
    if (id) {
      setSearchQuery(id);
      verifyId(id, certType);
    }
  }, [id, certType]);

  const verifyId = async (certificateId: string, type: CertType) => {
    if (!certificateId.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setStatus('loading');

    try {
      const response = await verifyCertificate({ 
        certId: certificateId.trim(), 
        certType: type 
      });
      const data = response.data as VerificationResult;
      setResult(data);
      setStatus(data.found ? 'found' : 'not-found');
    } catch (err: any) {
      console.warn('Callable function verification failed. Attempting direct Firestore fallback...', err);
      
      try {
        const collectionMap: Record<CertType, string> = {
          operator: 'operators',
          machine: 'machineCertificates',
          lifting: 'liftingToolCertificates'
        };
        const collectionName = collectionMap[type];
        const docRef = doc(db, collectionName, certificateId.trim());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const docData = docSnap.data();
          setResult({
            found: true,
            certId: certificateId.trim(),
            ...docData
          } as VerificationResult);
          setStatus('found');
        } else {
          setResult({ found: false, message: 'Certificate or Operator card not found in database.' });
          setStatus('not-found');
        }
      } catch (fallbackErr: any) {
        console.error('Firestore fallback also failed:', fallbackErr);
        setStatus('not-found');
        
        if (err.code === 'functions/resource-exhausted') {
          setError('Too many searches. Please wait a few minutes and try again.');
        } else if (err.code === 'functions/failed-precondition') {
          setError('Security check failed. Please refresh the page.');
        } else if (err.code === 'functions/internal' || err.message === 'internal') {
          setError('The backend is undergoing setup. We are accessing the database directly in the meantime.');
        } else {
          setError(err.message || 'Verification failed. Please try again.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      let url = `/verify/${searchQuery.trim()}`;
      url += `?type=${certType}`;
      navigate(url);
    }
  };

  const renderValue = (value: any, key: string) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      if ('seconds' in value && 'nanoseconds' in value) {
        return new Date(value.seconds * 1000).toLocaleDateString();
      }
      return JSON.stringify(value);
    }
    if (typeof value === 'string' && value.startsWith('https://') && (value.includes('.png') || value.includes('.jpg') || value.includes('.jpeg') || value.includes('.webp') || value.includes('alt=media'))) {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer">
          <img src={value} alt={key} className="h-16 w-auto object-contain rounded border border-gray-200 mt-2 sm:mt-0" />
        </a>
      );
    }
    return String(value);
  };

  const renderResultDetails = () => {
    if (!result) return null;

    const excludedKeys = ['found', 'message'];
    const entries = Object.entries(result).filter(([key, value]) => {
      const lowerKey = key.toLowerCase();
      return (
        !excludedKeys.includes(key) && 
        value !== undefined && value !== null && value !== '' &&
        !lowerKey.includes('signature') && 
        !lowerKey.includes('naming') && 
        lowerKey !== 'status'
      );
    });

    const isHighlightKey = (k: string) => {
      const lower = k.toLowerCase();
      return lower.includes('date') || lower.includes('expiry') || lower.includes('result') || lower.includes('report') || lower.includes('validity');
    };

    const isClientKey = (k: string) => {
      const lower = k.toLowerCase();
      return lower.includes('client') || lower.includes('company') || lower.includes('location') || lower.includes('project') || lower.includes('address') || lower.includes('site');
    };

    const highlights = entries.filter(([key]) => isHighlightKey(key));
    const clients = entries.filter(([key]) => isClientKey(key) && !isHighlightKey(key));
    const others = entries.filter(([key]) => !isHighlightKey(key) && !isClientKey(key));

    const renderField = ([key, value]: [string, any], highlight = false) => {
      const formattedKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/_/g, ' ');

      return (
        <div key={key} className={`flex flex-col py-3 border-b border-gray-100 ${highlight ? 'bg-primary/5 p-4 rounded-xl border-none mb-2' : ''}`}>
          <span className={`text-xs font-medium uppercase tracking-wider mb-1 ${highlight ? 'text-primary' : 'text-gray-500'}`}>{formattedKey}</span>
          <span className={`break-words mt-1 ${highlight ? 'font-bold text-navy text-base' : 'font-semibold text-navy text-sm'}`}>
            {renderValue(value, key)}
          </span>
        </div>
      );
    };

    return (
      <div className="flex flex-col gap-8 mt-6">
        {highlights.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map(entry => renderField(entry, true))}
          </div>
        )}
        
        {clients.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-navy border-b border-gray-200 pb-2 mb-3">Client & Location Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {clients.map(entry => renderField(entry))}
            </div>
          </div>
        )}

        {others.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-navy border-b border-gray-200 pb-2 mb-3">Record Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {others.map(entry => renderField(entry))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-navy py-4 px-6 border-b border-white/10 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0459155438.firebasestorage.app/o/Branding%2FHorizonal%20MEV%20logo.png?alt=media&token=6fd9c05f-5c66-4c31-94b5-06ff4cb6c980" 
              alt="MEV Logo" 
              className="h-8 object-contain"
            />
          </button>
          <div className="text-white text-sm font-medium hidden sm:block">
            Public Verification Portal
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8 lg:py-12 w-full max-w-7xl mx-auto">
        <div className="w-full mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </button>

          <h1 className="text-3xl font-bold text-navy mb-2">Verify Certificate</h1>
          <p className="text-gray-600 mb-8">
            Enter a Certificate ID or Operator Card ID to verify its authenticity and check current status.
          </p>

          <form onSubmit={handleSearch} className="relative shadow-sm rounded-xl overflow-hidden flex flex-col sm:flex-row bg-white border border-gray-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            <div className="flex w-full sm:w-auto border-b sm:border-b-0 sm:border-r border-gray-200 bg-gray-50">
              <div className="pl-4 flex items-center justify-center pointer-events-none text-gray-400">
                <FileText className="w-5 h-5" />
              </div>
              <select
                value={certType}
                onChange={(e) => setCertType(e.target.value as CertType)}
                className="py-4 px-3 outline-none text-gray-700 bg-transparent font-medium text-sm w-full cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <option value="operator">Operator Card</option>
                <option value="machine">Machine Certificate</option>
                <option value="lifting">Lifting Tool Certificate</option>
              </select>
            </div>
            <div className="flex-1 flex">
              <div className="pl-4 flex items-center justify-center pointer-events-none text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. MEV-2026-ABC123"
                className="flex-1 py-4 px-4 outline-none text-gray-700 bg-transparent w-full"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || !searchQuery.trim()}
              className="bg-primary text-white px-8 py-4 sm:py-auto font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>

        <motion.div 
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          {loading && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center justify-center p-12 h-64">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-gray-500 font-medium animate-pulse">Verifying Database Records...</p>
            </div>
          )}

          {!loading && status === 'found' && result && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8 sm:p-10">
                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-100 pb-8 mb-8 gap-6">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-navy">Verified Authentic</h2>
                      <p className="text-gray-500 text-sm mt-1">{
                        certType === 'operator' ? 'Operator Card' : 
                        certType === 'lifting' ? 'Lifting Tool Certificate' : 
                        'Machine Certificate'
                      }</p>
                    </div>
                  </div>
                  <div className={`text-white px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center ${
                    result.status === 'VALID' || result.result === 'Pass' ? 'bg-green-500 shadow-green-500/20' : 
                    result.status === 'EXPIRED' ? 'bg-red-500 shadow-red-500/20' : 
                    'bg-amber-500 shadow-amber-500/20'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                    {result.status || result.result || 'VALID RECORD'}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
                  <div className="flex items-center gap-2 mb-4 text-navy font-semibold pb-3 border-b border-gray-200">
                    <Search className="w-5 h-5 text-primary" />
                    <h3>Record Details</h3>
                  </div>

                  <div className="mb-4">
                    <span className="block text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">ID Number</span>
                    <span className="block text-lg font-mono font-bold text-navy bg-white px-3 py-2 border border-gray-200 rounded-lg">
                      {result.certId || id || searchQuery}
                    </span>
                  </div>

                  {renderResultDetails()}
                </div>

                <div className="text-center text-sm text-gray-400">
                  <p>This is a certified digital record issued by MEV Inspection & Training.</p>
                  <p className="mt-1">For inquiries or reporting discrepancies, please contact us directly.</p>
                </div>
              </div>
            </div>
          )}

          {!loading && status === 'not-found' && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                <XCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-navy mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-8 max-w-md">
                {result?.message || `We could not find any active certificate or operator card matching the ID "${id || searchQuery}".`}
              </p>
              <div className="bg-orange-50 text-orange-800 p-4 rounded-lg text-sm max-w-md border border-orange-100">
                <p className="font-semibold mb-1">Why might this happen?</p>
                <ul className="text-left list-disc pl-5 space-y-1">
                  <li>The ID was typed incorrectly.</li>
                  <li>The certificate type selected does not match.</li>
                  <li>The certificate has expired and was removed.</li>
                  <li>The record does not belong to an authentic MEV-issued document.</li>
                </ul>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

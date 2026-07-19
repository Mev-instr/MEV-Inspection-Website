import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';

const Verify = lazy(() => import('./pages/Verify'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-[#0E1B2D] flex items-center justify-center text-[#683EFF]">Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/verify/:id" element={<Verify />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

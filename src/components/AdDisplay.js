// src/components/AdDisplay.js
import React, { useEffect } from 'react';

const AdDisplay = () => {
  useEffect(() => {
    try {
      // 確保 AdSense 代碼已加載
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className="w-full my-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3209606861190317"
        data-ad-slot="YOUR_AD_SLOT_ID" // 需要替換為你的廣告位 ID
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdDisplay;
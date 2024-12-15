// src/components/AdDisplay.js
import React, { useEffect, useRef } from 'react';

const AdDisplay = () => {
  const adRef = useRef(null);
  
  useEffect(() => {
    // 確保 script 只被加載一次
    const currentAd = adRef.current;
    
    if (currentAd) {
      try {
        // 插入 AdSense script
        const script = document.createElement('script');
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3209606861190317";
        script.async = true;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
        
        // 初始化廣告
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }

    // Cleanup
    return () => {
      if (currentAd) {
        try {
          // 清理廣告相關的腳本
          const scripts = document.querySelectorAll('script[src*="adsbygoogle"]');
          scripts.forEach(script => script.remove());
        } catch (err) {
          console.error('Cleanup error:', err);
        }
      }
    };
  }, []);

  return (
    <div className="w-full my-4" ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3209606861190317"
        data-ad-slot="6507739652"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdDisplay;
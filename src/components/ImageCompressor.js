import React, { useState, useCallback, useRef } from 'react';
import { UploadCloud, Download, X } from 'lucide-react';
import AdDisplay from './AdDisplay.js';
const ImageCompressor = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [compressedImage, setCompressedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quality, setQuality] = useState(80);
  const fileInputRef = useRef(null);
  
  // 使用簡單的 Map 來存儲壓縮後的圖片
  const cacheRef = useRef(new Map());

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    processFile(file);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const processFile = (file) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('請上傳圖片文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setImage(file);
      setError('');
      compressImage(file);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = async (file) => {
    setLoading(true);
    setError('');

    try {
      // 檢查緩存中是否已有壓縮過的圖片
      const cacheKey = `${file.name}-${quality}`;
      const cachedImage = cacheRef.current.get(cacheKey);
      
      if (cachedImage) {
        setCompressedImage(cachedImage);
        setLoading(false);
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      await new Promise((resolve) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // 保持原始寬高比
          canvas.width = img.width;
          canvas.height = img.height;
          
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                // 將壓縮後的圖片存入緩存
                cacheRef.current.set(cacheKey, blob);
                
                // 保持緩存大小在合理範圍內
                if (cacheRef.current.size > 20) {
                  const firstKey = cacheRef.current.keys().next().value;
                  cacheRef.current.delete(firstKey);
                }
                
                setCompressedImage(blob);
              }
              resolve();
            },
            'image/jpeg',
            quality / 100
          );
        };
      });
    } catch (err) {
      setError('圖片壓縮失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!compressedImage) return;
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(compressedImage);
    link.download = `compressed-${image.name}`;
    link.click();
  };

  const clearImage = () => {
    setImage(null);
    setPreview('');
    setCompressedImage(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
        <AdDisplay />
      <h1 className="text-3xl font-bold text-center mb-8">圖片壓縮工具</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {!image ? (
          <>
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-600">拖拽圖片到此處或</p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => processFile(e.target.files[0])}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              選擇文件
            </button>
          </>
        ) : (
          <div className="relative">
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={preview}
              alt="Preview"
              className="max-h-96 mx-auto rounded"
            />
          </div>
        )}
      </div>

      {image && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              壓縮質量: {quality}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={quality}
              onChange={(e) => {
                setQuality(Number(e.target.value));
                if (image) {
                  compressImage(image);
                }
              }}
              className="w-full"
            />
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>原始大小: {(image.size / 1024).toFixed(2)} KB</div>
            <div>
              壓縮後大小:{' '}
              {compressedImage
                ? (compressedImage.size / 1024).toFixed(2)
                : '0'} KB
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={loading || !compressedImage}
            className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            {loading ? (
              '處理中...'
            ) : (
              <>
                <Download className="h-5 w-5" />
                下載壓縮後的圖片
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageCompressor;
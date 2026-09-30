'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight, 
  Sliders, 
  X,
  Package,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { detectWaste } from '@/lib/ai/waste-detector';
import { WasteDetectionResult } from '@/lib/ai/types';
import { getConfidenceThreshold, setConfidenceThreshold } from '@/lib/ai/model-config';
import { useI18n } from '@/lib/i18n';

interface WasteDetectionScannerProps {
  onMaterialSelected?: (materialSlug: string, detectedItems: WasteDetectionResult[]) => void;
  onClose?: () => void;
  standalone?: boolean;
}

export const WasteDetectionScanner: React.FC<WasteDetectionScannerProps> = ({
  onMaterialSelected,
  onClose,
  standalone = false,
}) => {
  const { t } = useI18n();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [detections, setDetections] = useState<WasteDetectionResult[]>([]);
  const [threshold, setThreshold] = useState<number>(getConfidenceThreshold());
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageElementRef = useRef<HTMLImageElement>(null);

  // Stop camera stream when unmounted
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const startCamera = async () => {
    try {
      setSelectedImage(null);
      setDetections([]);
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraActive(false);
      // Fallback to file picker
      fileInputRef.current?.click();
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    stopCamera();
    setSelectedImage(dataUrl);
    runInferenceOnImage(dataUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      stopCamera();
      setSelectedImage(dataUrl);
      runInferenceOnImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const runInferenceOnImage = async (dataUrl: string) => {
    setIsAnalyzing(true);
    setDetections([]);

    const img = new Image();
    img.src = dataUrl;
    img.onload = async () => {
      try {
        const results = await detectWaste(img, threshold);
        setDetections(results);
      } catch (err) {
        console.error('Detection error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    };
  };

  const handleThresholdChange = (val: number) => {
    setThreshold(val);
    setConfidenceThreshold(val);
    if (selectedImage) {
      runInferenceOnImage(selectedImage);
    }
  };

  const handleSelectMaterial = (result: WasteDetectionResult) => {
    const targetSlug = result.mappedMaterialSlug || 'pet_bottle';
    if (onMaterialSelected) {
      onMaterialSelected(targetSlug, detections);
    }
  };

  return (
    <div className={`flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm ${standalone ? 'p-4' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-[#FAFBFB]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2E7D1F]/10 flex items-center justify-center text-[#2E7D1F]">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-base font-black text-[#14181A] flex items-center gap-1.5">
              AI Waste Scanner
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                YOLO11n ONNX
              </span>
            </h3>
            <p className="text-xs text-gray-500 font-medium">On-Device Local Inference • 100% Offline</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
            title="Configure Confidence"
          >
            <Sliders size={14} />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Central Configuration Drawer */}
      {showConfig && (
        <div className="p-3 bg-gray-50 border-b border-gray-200 flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-700">Confidence Threshold:</span>
            <span className="font-mono font-bold text-[#2E7D1F] bg-white px-2 py-0.5 rounded border border-gray-200">
              {(threshold * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="0.9"
            step="0.05"
            value={threshold}
            onChange={(e) => handleThresholdChange(parseFloat(e.target.value))}
            className="w-full accent-[#2E7D1F] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>More Detections (20%)</span>
            <span>Balanced (45%)</span>
            <span>Strict High Confidence (90%)</span>
          </div>
        </div>
      )}

      {/* Main Viewfinder / Canvas Area */}
      <div className="relative bg-black min-h-[260px] max-h-[380px] flex items-center justify-center overflow-hidden">
        {/* Hidden video and canvas for camera capture */}
        <video
          ref={videoRef}
          playsInline
          className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Selected Image with Bounding Box Overlay */}
        {selectedImage && !cameraActive && (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              ref={imageElementRef}
              src={selectedImage}
              alt="Scrap Preview"
              className="max-h-[360px] w-auto object-contain select-none"
            />
            {/* SVG Bounding Boxes Overlay */}
            {detections.length > 0 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {detections.map((det) => {
                  if (!det.boundingBox) return null;
                  const { x, y, width, height } = det.boundingBox;
                  const color = det.isLowConfidence ? '#EF4444' : '#22C55E';
                  return (
                    <g key={det.id}>
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill="none"
                        stroke={color}
                        strokeWidth="3"
                        strokeDasharray={det.isLowConfidence ? '6,4' : undefined}
                        rx="4"
                      />
                      <rect
                        x={x}
                        y={Math.max(0, y - 24)}
                        width={Math.min(160, Math.max(90, width))}
                        height="22"
                        fill={color}
                        rx="3"
                      />
                      <text
                        x={x + 6}
                        y={Math.max(14, y - 8)}
                        fill="#FFFFFF"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="sans-serif"
                      >
                        {det.className === 'metal' ? 'IRON / METAL' : det.className.toUpperCase()} {det.confidencePercentage}%
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>
        )}

        {/* Empty state placeholder when neither camera nor image is selected */}
        {!selectedImage && !cameraActive && (
          <div className="text-center p-6 text-white space-y-3">
            <div className="w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center">
              <Camera size={30} className="text-white/80" />
            </div>
            <div>
              <p className="font-bold text-sm">Take photo or upload scrap image</p>
              <p className="text-xs text-white/60">YOLO11n will instantly detect waste category</p>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2">
            <RefreshCw size={28} className="animate-spin text-emerald-400" />
            <span className="text-xs font-bold tracking-wide">YOLO11n Analyzing Waste...</span>
            <span className="text-[11px] text-white/70">Scanning on-device (Zero cloud lag)</span>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Action Buttons: Camera Capture / Upload */}
      <div className="p-3 bg-white border-b border-gray-100 flex items-center gap-2">
        {cameraActive ? (
          <button
            type="button"
            onClick={capturePhoto}
            className="flex-1 h-11 bg-[#2E7D1F] hover:bg-[#256619] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-98 shadow-sm transition-all"
          >
            <Camera size={18} />
            <span>Click Photo Now (फोटो खींचें)</span>
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={startCamera}
              className="flex-1 h-11 bg-[#14181A] hover:bg-black text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Camera size={16} />
              <span>Use Camera</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 h-11 bg-gray-100 hover:bg-gray-200 text-[#14181A] rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Upload size={16} />
              <span>Upload Photo</span>
            </button>
          </>
        )}
      </div>

      {/* Detection Results Container */}
      <div className="p-4 bg-gray-50 flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Detected Items ({detections.length})
          </span>
          {detections.length > 0 && (
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <ShieldCheck size={12} /> Ready for Best Deals
            </span>
          )}
        </div>

        {detections.length === 0 && !isAnalyzing && (
          <div className="p-4 text-center text-gray-400 text-xs italic bg-white rounded-xl border border-dashed border-gray-200">
            Take a photo of scrap bottles, metal, cardboard, or wire to view AI classification.
          </div>
        )}

        {detections.map((det) => (
          <div
            key={det.id}
            className={`p-3 rounded-xl border transition-all ${
              det.isLowConfidence
                ? 'bg-amber-50/50 border-amber-200 text-amber-900'
                : 'bg-white border-gray-200 hover:border-[#2E7D1F] shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-[#14181A]">
                    {det.displayNameHi}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      det.isLowConfidence
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {det.isLowConfidence ? 'Low Confidence' : `${det.confidencePercentage}% Match`}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium">{det.displayNameEn}</p>
                {det.suggestedRatePerKg && det.suggestedRatePerKg > 0 ? (
                  <p className="text-xs font-bold text-[#2E7D1F]">
                    Mandi Rate: ~₹{det.suggestedRatePerKg}/kg
                  </p>
                ) : null}

                {/* 1-Tap Category Adjustment Chips */}
                <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-gray-400 font-medium">बदलें:</span>
                  {[
                    { label: 'लोहा (Iron)', cls: 'metal', rate: 38, slug: 'iron_scrap' },
                    { label: 'प्लास्टिक (Plastic)', cls: 'plastic', rate: 28, slug: 'pet_bottle' },
                    { label: 'गत्ता (Cardboard)', cls: 'cardboard', rate: 14, slug: 'cardboard' },
                    { label: 'ई-कचरा (E-Waste)', cls: 'e_waste', rate: 120, slug: 'pcb_motherboard' }
                  ].map((item) => (
                    <button
                      key={item.cls}
                      type="button"
                      onClick={() => {
                        setDetections([{
                          ...det,
                          className: item.cls,
                          displayNameHi: item.label,
                          displayNameEn: item.cls.toUpperCase(),
                          mappedMaterialSlug: item.slug,
                          suggestedRatePerKg: item.rate,
                          confidence: 0.95,
                          confidencePercentage: 95,
                          isLowConfidence: false
                        }]);
                      }}
                      className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                        det.className === item.cls
                          ? 'bg-[#2E7D1F] text-white border-[#2E7D1F] font-bold'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectMaterial(det)}
                className="px-3 py-2 bg-[#2E7D1F] hover:bg-[#256619] text-white rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95 transition-all shadow-xs shrink-0"
              >
                <span>Sell This</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

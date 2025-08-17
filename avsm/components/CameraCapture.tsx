
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Spinner } from './Spinner';

declare global {
  interface Window {
    FaceDetector: any;
  }
}

type Status = 'initializing' | 'no_faces' | 'faces_detected' | 'manual_mode' | 'capturing' | 'error';

interface CameraCaptureProps {
  onImageReady: (previewUrl: string, base64Data: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageReady }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
    const captureCanvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const detectorRef = useRef<any>(null);
    const animationFrameIdRef = useRef<number | null>(null);
    
    const [status, setStatus] = useState<Status>('initializing');
    const [error, setError] = useState<string | null>(null);
    const [detectedFaces, setDetectedFaces] = useState<any[]>([]);
    const [hoveredFaceIndex, setHoveredFaceIndex] = useState<number | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    const handleCapture = useCallback(() => {
        if (!videoRef.current || !captureCanvasRef.current) return;
        
        setStatus('capturing');
        
        const video = videoRef.current;
        const canvas = captureCanvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');

        if (context) {
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg');
            const base64Data = dataUrl.split(',')[1];
            onImageReady(dataUrl, base64Data);
        }
    }, [onImageReady]);

    const triggerCapture = useCallback(() => {
        if (isCapturing) return;
        setIsCapturing(true);
        handleCapture();
    }, [isCapturing, handleCapture]);


    const detectFacesLoop = useCallback(async () => {
        if (videoRef.current && detectorRef.current && videoRef.current.readyState >= 2) {
            const faces = await detectorRef.current.detect(videoRef.current);
            setDetectedFaces(faces);
            if (!isCapturing) {
              setStatus(faces.length > 0 ? 'faces_detected' : 'no_faces');
            }
        }
        animationFrameIdRef.current = requestAnimationFrame(detectFacesLoop);
    }, [isCapturing]);

    const drawOverlay = useCallback(() => {
        const overlayCanvas = overlayCanvasRef.current;
        const context = overlayCanvas?.getContext('2d');
        if (!context || !overlayCanvas) return;

        context.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        
        if (status === 'faces_detected' || status === 'no_faces') {
            detectedFaces.forEach((face, index) => {
                const boundingBox = face.boundingBox;
                context.lineWidth = index === hoveredFaceIndex ? 6 : 4;
                context.strokeStyle = index === hoveredFaceIndex ? '#06b6d4' : '#9ca3af'; // cyan-500 or gray-400
                context.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
            });
        }
    }, [detectedFaces, hoveredFaceIndex, status]);

    useEffect(() => {
        drawOverlay();
    }, [drawOverlay]);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
                streamRef.current = mediaStream;
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.onloadedmetadata = () => {
                        if (!videoRef.current) return;
                        const { videoWidth, videoHeight } = videoRef.current;
                        if (overlayCanvasRef.current) {
                            overlayCanvasRef.current.width = videoWidth;
                            overlayCanvasRef.current.height = videoHeight;
                        }
                        
                        const isFaceDetectorSupported = typeof window.FaceDetector === 'function';
                        if (isFaceDetectorSupported) {
                           try {
                                detectorRef.current = new window.FaceDetector({ fastMode: true });
                                animationFrameIdRef.current = requestAnimationFrame(detectFacesLoop);
                            } catch (e) {
                                console.warn("FaceDetector init failed, falling back to manual mode:", e);
                                setStatus('manual_mode');
                            }
                        } else {
                            console.log("FaceDetector not supported, using manual capture mode.");
                            setStatus('manual_mode');
                        }
                    };
                }
            } catch (err) {
                console.error("Camera access denied:", err);
                setStatus('error');
                setError("Camera access was denied. Please allow camera permissions in your browser settings.");
            }
        };

        startCamera();

        return () => {
            if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
            streamRef.current?.getTracks().forEach(track => track.stop());
        };
    }, [detectFacesLoop]);
    
    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = overlayCanvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = canvas.width - (event.clientX - rect.left) * (canvas.width / rect.width);
        const y = (event.clientY - rect.top) * (canvas.height / rect.height);
        
        let foundFace = false;
        for (let i = 0; i < detectedFaces.length; i++) {
            const face = detectedFaces[i].boundingBox;
            if (x >= face.x && x <= face.x + face.width && y >= face.y && y <= face.y + face.height) {
                setHoveredFaceIndex(i);
                foundFace = true;
                break;
            }
        }
        if (!foundFace) setHoveredFaceIndex(null);
    };

    const handleClick = () => {
        if (hoveredFaceIndex !== null) {
            triggerCapture();
        }
    };

    const renderStatusMessage = () => {
        switch (status) {
            case 'initializing': return <p>Initializing Camera...</p>;
            case 'no_faces': return <p>Position face(s) in the frame.</p>;
            case 'faces_detected': return <p className="text-cyan-500">Hover and click on a face to capture.</p>;
            case 'manual_mode': return <p>Position visitor in frame and click Capture.</p>;
            case 'capturing': return <p className="text-cyan-500 animate-pulse">Captured! Analyzing...</p>;
            case 'error': return <p className="text-amber-500">{error}</p>;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl font-bold text-cyan-500 mb-2">Live Scan</h2>
            <div className="w-full max-w-2xl aspect-video bg-gray-900 rounded-2xl overflow-hidden relative border-2 border-gray-300 shadow-lg">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                {(status === 'faces_detected' || status === 'no_faces') && (
                  <canvas 
                      ref={overlayCanvasRef} 
                      className="absolute top-0 left-0 w-full h-full object-cover transform scale-x-[-1] cursor-pointer"
                      onMouseMove={handleMouseMove}
                      onClick={handleClick}
                  />
                )}
                {status === 'initializing' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Spinner />
                    </div>
                )}
                {status === 'error' && !streamRef.current && (
                     <div className="absolute inset-0 flex items-center justify-center bg-red-100/80 p-4">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}
            </div>
            <div className="mt-4 h-6 text-gray-600 font-semibold">
                {renderStatusMessage()}
            </div>
             {status === 'manual_mode' && (
                <div className="mt-4">
                  <button
                      onClick={triggerCapture}
                      disabled={isCapturing}
                      className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                      Capture Image
                  </button>
                </div>
            )}
            <canvas ref={captureCanvasRef} className="hidden"></canvas>
        </div>
    );
};
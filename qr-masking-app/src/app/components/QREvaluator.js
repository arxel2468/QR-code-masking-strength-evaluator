"use client";
import { useState, useRef } from 'react';
import jsQR from 'jsqr';

export default function QREvaluator() {
  const [qrCodeFile, setQrCodeFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const imgRef = useRef(null); // Reference to the image element

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setQrCodeFile(file);
    setResult(null); // Reset result and error on new file
    setError(null);
  };

  const evaluateQRCode = async () => {
    if (!qrCodeFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const decodedQR = jsQR(imageData.data, canvas.width, canvas.height);

        if (decodedQR) {
          // Here you can implement your masking strength evaluation logic
          const score = Math.random() * 100; // Dummy scoring logic
          setResult(`Decoded QR Data: ${decodedQR.data} | Masking Strength: ${score.toFixed(2)}/100`);
          setError(null);
        } else {
          setError('No QR code found. Please try another image.');
          setResult(null);
        }
      };
    };
    reader.readAsDataURL(qrCodeFile);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        className="border border-gray-300 p-2"
      />
      <button
        onClick={evaluateQRCode}
        className="rounded bg-blue-500 text-white px-4 py-2"
      >
        Evaluate QR Code
      </button>
      {result && <div className="mt-4 font-semibold">{result}</div>}
      {error && <div className="mt-4 text-red-500">{error}</div>}
    </
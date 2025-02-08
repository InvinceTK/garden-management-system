'use client'

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Upload, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { processImage } from "@/app/actions/processImage";

const WeedDetectionCard = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedImage({
          url: URL.createObjectURL(file),
          file: file
        });
        setProcessedImage(null);
        setError(null);
      } else {
        setError("Please upload an image file");
      }
    }
  };

  const handleProcessImage = async () => {
    if (!selectedImage?.file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage.file);

      const result = await processImage(formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      setProcessedImage(result.image);
    } catch (err) {
      console.error(err);
      setError("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-zinc-900 border-green-500/20 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 transition-all">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2" />
            Weed Detection
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="aspect-video bg-zinc-800 rounded-lg overflow-hidden relative">
              {selectedImage ? (
                <img
                  src={selectedImage.url}
                  alt="Upload Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto mb-2 text-green-400" />
                    <p className="text-zinc-400">Upload an image</p>
                  </div>
                </div>
              )}
              <input
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            <div className="aspect-video bg-zinc-800 rounded-lg overflow-hidden">
              {processedImage ? (
                <img
                  src={processedImage}
                  alt="Processed Result"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-400">
                  {isProcessing ? (
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p>Processing image...</p>
                    </div>
                  ) : (
                    <p>Processed image will appear here</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            className="w-full md:w-auto bg-green-600 hover:bg-green-500 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleProcessImage}
            disabled={!selectedImage || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Detect Weeds"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeedDetectionCard;

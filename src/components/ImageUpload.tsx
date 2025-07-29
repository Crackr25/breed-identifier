"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  loading: boolean;
}

export default function ImageUpload({
  onImageUpload,
  loading,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
      // Reset the input value to allow selecting the same file again
      e.target.value = "";
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file of your furry friend! 🐱🐶");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    onImageUpload(file);
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive
            ? "border-pink-400 bg-pink-50"
            : "border-gray-300 hover:border-pink-400"
        } ${loading ? "opacity-50 pointer-events-none" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
          disabled={loading}
        />

        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Pet preview"
              className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
            />
            <div className="text-sm text-gray-600">
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600"></div>
                  <span>Identifying your furry friend... 🔍</span>
                </div>
              ) : (
                <p onClick={onButtonClick} className="cursor-pointer hover:text-pink-600">
                  Click or drag another photo to replace 📸
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-6xl mb-4">🐱🐶</div>
            <div>
              <p className="text-xl font-semibold text-gray-700 mb-2">
                Upload a photo of your pet! ✨
              </p>
              <p className="text-gray-500 mb-4">
                Drag and drop a cute photo here, or click to select 📸
              </p>
              <button
                type="button"
                onClick={onButtonClick}
                disabled={loading}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? "Processing... 🐾" : "Choose Photo 📸"}
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Supported formats: JPG, PNG, GIF, WebP
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

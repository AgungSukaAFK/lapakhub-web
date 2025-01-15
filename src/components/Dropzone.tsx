import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface DropzoneProps {
  onFileSelected: (file: File | null) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileSelected }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onFileSelected(file); // Kirim file ke komponen induk
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
      } else {
        onFileSelected(null);
      }
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div className="flex flex-col items-center">
      <div
        {...getRootProps()}
        className={`${
          preview ? "hidden" : ""
        } border-2 border-dashed rounded-lg p-4 w-80 h-48 flex items-center justify-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-indigo-600 bg-indigo-50"
            : "border-gray-300 bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-indigo-600">Drop the image here...</p>
        ) : (
          <p className="text-gray-500">
            Drag & drop an image here, or click to select one
          </p>
        )}
      </div>
      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full aspect-video object-cover rounded-lg border border-gray-200"
          />
        </div>
      )}
    </div>
  );
};

export default Dropzone;

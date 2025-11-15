
import React, { useRef } from 'react';
import { UploadIcon } from './icons';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  previewUrl: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileSelect(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0] || null;
    onFileSelect(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div>
      <label
        htmlFor="file-upload"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative cursor-pointer bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col justify-center items-center text-center hover:border-sky-400 transition-colors duration-300 min-h-[200px]"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Scan preview"
            className="max-h-48 max-w-full object-contain rounded-md"
          />
        ) : (
          <>
            <UploadIcon className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <span className="block text-sm font-semibold text-slate-600">
              Drag & Drop or Click to Upload
            </span>
            <span className="block text-xs text-slate-500 mt-1">
              PNG, JPG, DICOM up to 10MB
            </span>
          </>
        )}
      </label>
      <input
        id="file-upload"
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/png, image/jpeg, .dcm"
      />
      {selectedFile && (
        <div className="text-center mt-3 text-sm text-slate-700">
          <strong>Selected file:</strong> {selectedFile.name}
        </div>
      )}
    </div>
  );
};

export default FileUpload;

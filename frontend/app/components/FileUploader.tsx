import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X } from "lucide-react";
import { formatSize } from "~/lib/utils";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string[];
  maxSize?: number;
}

const FileUploader = ({ 
  onFileSelect, 
  acceptedTypes = ['.pdf', '.doc', '.docx'],
  maxSize = 5 * 1024 * 1024 // 5MB
}: FileUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
  });

  const removeFile = () => {
    setSelectedFile(null);
  };

  if (selectedFile) {
    return (
      <div className="uploader-selected-file">
        <div className="flex items-center gap-3">
          <FileText size={24} className="text-blue-600" />
          <div>
            <p className="font-medium">{selectedFile.name}</p>
            <p className="text-sm text-gray-500">{formatSize(selectedFile.size)}</p>
          </div>
        </div>
        <button
          onClick={removeFile}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`uploader-drag-area ${
        isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <Upload size={48} className="text-gray-400" />
        <div>
          <p className="text-lg font-medium text-gray-700">
            {isDragActive ? 'Drop your CV here' : 'Drag & drop your CV here'}
          </p>
          <p className="text-sm text-gray-500">
            or click to browse files
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Supports PDF, DOC, DOCX (max {formatSize(maxSize)})
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;

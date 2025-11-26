import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { useState } from "react";
import { Upload as UploadIcon, FileText, CheckCircle } from "lucide-react";
import { uploadCv } from "~/lib/api";
import { generateUUID } from "~/lib/utils";
import { UploadResponse } from "~/types";
import { NavigationProps, View } from "../root"; // Import NavigationProps and View

export default function Upload({ navigateTo }: NavigationProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [cvTitle, setCvTitle] = useState("");
  const [extractedText, setExtractedText] = useState("");
  // const navigate = useNavigate(); // Removed useNavigate

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // Auto-generate title from filename
    const title = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    setCvTitle(title);
  };

  const handleUpload = async () => {
    if (!selectedFile || !cvTitle) return;

    try {
      setUploading(true);
      
      // Upload file
      const response: UploadResponse = await uploadCv(selectedFile);
      setExtractedText(response.extracted_text);
      
      setUploadSuccess(true);
      
      // Navigate to the CV detail page with the new CV ID
      navigateTo(View.CVDetail, response.cv_id);

    } catch (error) {
      console.error('Upload failed:', error);
      // Handle error (show toast, etc.)
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="bg-gradient min-h-screen">
      <Navbar navigateTo={navigateTo} />

      <section className="main-section">
        <div className="page-heading">
          <h1>Upload Your CV</h1>
          <h2>Get instant AI-powered analysis and feedback on your resume</h2>
        </div>

        <div className="w-full max-w-2xl">
          {uploadSuccess ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
              <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                CV Uploaded Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                Your CV is being analyzed. You'll receive detailed feedback shortly.
              </p>
              <p className="text-gray-600 mb-6">
                Redirecting to your CV analysis...
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Select Your CV File
                  </h3>
                  <FileUploader 
                    onFileSelect={handleFileSelect}
                    acceptedTypes={['.pdf', '.doc', '.docx']}
                    maxSize={5 * 1024 * 1024} // 5MB
                  />
                </div>

                {selectedFile && (
                  <div className="form-div">
                    <label htmlFor="cv-title" className="text-sm font-medium text-gray-700">
                      CV Title
                    </label>
                    <input
                      id="cv-title"
                      type="text"
                      value={cvTitle}
                      onChange={(e) => setCvTitle(e.target.value)}
                      placeholder="Enter a title for your CV"
                      className="mt-1"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile || !cvTitle || uploading}
                    className="primary-button flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <UploadIcon size={20} />
                        Upload & Analyze CV
                      </>
                    )}
                  </button>

                  <div className="text-sm text-gray-500 text-center">
                    <p>• Supports PDF, DOC, and DOCX formats</p>
                    <p>• Maximum file size: 5MB</p>
                    <p>• Your data is secure and private</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

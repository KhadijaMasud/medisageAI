import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useUserSettings } from "@/hooks/useUserSettings";

type MedicineInfo = {
  name: string;
  primaryUse: string;
  commonUses: string[];
  dosage: string;
  warnings: string;
  imageUrl?: string;
};

export default function MedicineScanner() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { settings } = useUserSettings();
  const { speak, cancel } = useSpeechSynthesis({ rate: settings.voiceSpeed });

  // Handle file drag and drop
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (newFile: File) => {
    // Check file type
    if (!newFile.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (10MB max)
    if (newFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 10MB",
        variant: "destructive"
      });
      return;
    }
    
    setFile(newFile);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(newFile);
    
    // Reset any previous medicine info
    setMedicineInfo(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

  const resetImage = () => {
    setFile(null);
    setPreviewUrl(null);
    setMedicineInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*';
      fileInputRef.current.capture = 'environment';
      fileInputRef.current.click();
    }
  };

  const scanMedicineMutation = useMutation({
    mutationFn: async () => {
      if (!file) {
        throw new Error("No image file");
      }
      
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await fetch('/api/medicine-scanner', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error("Failed to analyze medicine");
      }
      
      return res.json();
    },
    onSuccess: (data: MedicineInfo) => {
      setMedicineInfo(data);
      
      // Read out the medicine information if voice interface is enabled
      if (settings.voiceInterface) {
        const summaryText = `Identified ${data.name}. This is ${data.primaryUse}. Typical dosage: ${data.dosage}. Warning: ${data.warnings.split('.')[0]}.`;
        speak(summaryText);
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to analyze the medicine image. Please try again with a clearer image.",
        variant: "destructive"
      });
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Medicine Scanner</h2>
        <p className="text-sm text-gray-600">Upload an image of your medicine to get information about it.</p>
      </div>
      
      <div className="p-4">
        <div 
          className={`mb-6 bg-gray-50 border-2 border-dashed ${isDragging ? 'border-primary' : 'border-gray-300'} rounded-lg p-6 text-center`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {!previewUrl ? (
            <div className="space-y-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="flex text-sm text-gray-600 justify-center">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                  <span>Upload an image</span>
                  <input 
                    id="file-upload" 
                    name="file-upload" 
                    type="file" 
                    className="sr-only" 
                    accept="image/*"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          ) : (
            <div className="mt-4">
              <img src={previewUrl} className="mx-auto max-h-64 rounded-md" alt="Medicine preview" />
              <button 
                onClick={resetImage}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Remove image
              </button>
            </div>
          )}
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={() => scanMedicineMutation.mutate()}
            disabled={!file || scanMedicineMutation.isPending}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {scanMedicineMutation.isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Scan Medicine
              </>
            )}
          </button>
          <button
            onClick={openCamera}
            className="ml-2 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Use Camera
          </button>
        </div>
      </div>
      
      {medicineInfo && (
        <div className="border-t border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              {medicineInfo.imageUrl ? (
                <img 
                  src={medicineInfo.imageUrl} 
                  alt={medicineInfo.name} 
                  className="w-full rounded-md" 
                />
              ) : (
                <img 
                  src={previewUrl!} 
                  alt="Uploaded medicine" 
                  className="w-full rounded-md" 
                />
              )}
            </div>
            <div className="md:col-span-2">
              <h3 className="text-md font-semibold text-gray-800 mb-2">{medicineInfo.name}</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Primary Use</h4>
                  <p className="text-sm text-gray-600">{medicineInfo.primaryUse}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Common Uses</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    {medicineInfo.commonUses.map((use, index) => (
                      <li key={index}>{use}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Typical Dosage</h4>
                  <p className="text-sm text-gray-600">{medicineInfo.dosage}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Warnings</h4>
                  <p className="text-sm text-gray-600">
                    <span className="text-red-600 font-medium">Caution:</span> {medicineInfo.warnings}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 italic">
                  <strong>Disclaimer:</strong> This information is not a substitute for professional medical advice. Always consult with a healthcare professional before taking any medication.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

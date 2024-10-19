import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  imageUrl: string | undefined;
  onRemoveImage: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, imageUrl, onRemoveImage }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      onImageUpload(result.url); // Update parent component with the new image URL
      toast({ title: "Image uploaded successfully" });
    } catch (error) {
      console.error("Failed to upload image", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-row">
      <Input className='bg-blue-50 dark:bg-blue-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0 hover:bg-blue-200 hover:text-blue-900' type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={uploading} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-xs mr-1">
        {uploading ? "Uploading..." : "Upload Image"}
      </Button>
      
    </div>
  );
};

export default ImageUpload;

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, File, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileUpload: (url: string, fileName: string) => void;
  accept?: string;
  maxSizeMB?: number;
  disabled?: boolean;
}

export const FileUpload = ({ 
  onFileUpload, 
  accept = ".zip,.rar,.tar.gz", 
  maxSizeMB = 100,
  disabled = false 
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{name: string, url: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSizeMB}MB`,
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to upload files",
          variant: "destructive"
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('project-files')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('project-files')
        .getPublicUrl(data.path);

      setUploadedFile({ name: file.name, url: publicUrl });
      onFileUpload(publicUrl, file.name);

      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileUpload('', '');
  };

  return (
    <div className="space-y-4">
      <Label>Project Files *</Label>
      
      {!uploadedFile ? (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload Project ZIP</h3>
          <p className="text-muted-foreground mb-4">
            Drop your ZIP file here or click to browse
          </p>
          
          <Input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileUpload}
            disabled={disabled || uploading}
            className="hidden"
            id="file-upload"
          />
          
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Uploading..." : "Choose File"}
          </Button>
          
          <p className="text-xs text-muted-foreground mt-2">
            Maximum file size: {maxSizeMB}MB
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <File className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground">File uploaded successfully</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveFile}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
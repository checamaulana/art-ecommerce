import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useRef, useState } from 'react';

interface ImageUploadProps {
    onUpload: (files: File[]) => void;
    maxFiles?: number;
    existingImages?: Array<{ id: number; url: string; is_primary?: boolean }>;
    onDelete?: (imageId: number) => void;
}

export default function ImageUpload({
    onUpload,
    maxFiles = 10,
    existingImages = [],
    onDelete,
}: ImageUploadProps) {
    const [previews, setPreviews] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newFiles = files.slice(0, maxFiles - selectedFiles.length);
        setSelectedFiles((prev) => [...prev, ...newFiles]);

        // Create previews
        newFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });

        // Call onUpload callback
        onUpload([...selectedFiles, ...newFiles]);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter((file) => file.type.startsWith('image/'));

        if (imageFiles.length === 0) return;

        const newFiles = imageFiles.slice(0, maxFiles - selectedFiles.length);
        setSelectedFiles((prev) => [...prev, ...newFiles]);

        // Create previews
        newFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });

        // Call onUpload callback
        onUpload([...selectedFiles, ...newFiles]);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const removeNewImage = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        setPreviews(newPreviews);
        onUpload(newFiles);
    };

    return (
        <div className="space-y-4">
            {/* Dropzone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <div>
                        <p className="font-medium">Click to upload or drag and drop</p>
                        <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                    </div>
                </div>
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium mb-2">Existing Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {existingImages.map((image) => (
                            <div key={image.id} className="relative group">
                                <img
                                    src={image.url}
                                    alt="Product"
                                    className="w-full h-32 object-cover rounded-lg border"
                                />
                                {image.is_primary && (
                                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                        Primary
                                    </div>
                                )}
                                {onDelete && (
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="destructive"
                                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => onDelete(image.id)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* New Image Previews */}
            {previews.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium mb-2">New Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border"
                                />
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="destructive"
                                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeNewImage(index)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

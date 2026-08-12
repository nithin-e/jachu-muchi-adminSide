import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);
const ACCEPT_ATTR = "image/png,image/jpeg,image/webp";

type ImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  uploadFile: (file: File, onProgress?: (percentLoaded: number) => void) => Promise<string>;
  label?: string;
  hint?: string;
  maxSizeBytes?: number;
  disabled?: boolean;
};

const ImageUpload = ({
  value,
  onChange,
  uploadFile,
  label = "Image",
  hint = "PNG, JPG, WEBP up to 5MB",
  maxSizeBytes = DEFAULT_MAX_BYTES,
  disabled,
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draftPreview, setDraftPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [error, setError] = useState("");

  const hasImage = Boolean(value) || Boolean(draftPreview);
  const previewSrc = draftPreview || value;

  const openPicker = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    await handleFile(file);
  };

  const handleFile = async (file: File | undefined) => {
    setError("");
    if (!file) return;

    if (!ACCEPTED_TYPES.has(file.type)) {
      setError("Only PNG, JPG, or WEBP images are allowed.");
      return;
    }
    if (file.size > maxSizeBytes) {
      setError(`Image must be ${Math.floor(maxSizeBytes / (1024 * 1024))}MB or smaller.`);
      return;
    }

    setIsUploading(true);
    setUploadPercent(0);
    const objectUrl = URL.createObjectURL(file);
    setDraftPreview(objectUrl);
    try {
      const url = await uploadFile(file, setUploadPercent);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
    } finally {
      URL.revokeObjectURL(objectUrl);
      setDraftPreview("");
      setUploadPercent(0);
      setIsUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (disabled || isUploading) return;
    void handleFile(event.dataTransfer.files?.[0]);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemove = () => {
    onChange("");
    setDraftPreview("");
    setError("");
  };

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-gray-200">{label}</span>

      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        className={`relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-white/20 text-center transition-all duration-200 hover:border-blue-400 ${
          hasImage ? "aspect-[16/7]" : "p-6"
        }`}
      >
        {hasImage ? (
          <>
            <img
              src={previewSrc}
              alt="Selected image preview"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              aria-label="Remove image"
              disabled={disabled || isUploading}
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition-all duration-200 hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <X className="h-4 w-4" />
            </button>
            {!isUploading ? (
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white/90">
                Click to replace
              </span>
            ) : null}
          </>
        ) : (
          <>
            <ImagePlus className="mb-2 h-6 w-6 text-gray-500" />
            <p className="text-sm font-medium text-gray-200">
              Click or Drag &amp; Drop to Upload
            </p>
            <p className="mt-1 text-xs text-gray-500">{hint}</p>
          </>
        )}

        {isUploading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 text-gray-100">
            <Loader2 className="h-6 w-6 animate-spin" />
            <div className="flex w-3/4 flex-col items-center gap-1.5">
              <span className="text-xs">
                {uploadPercent > 0 ? `Uploading… ${uploadPercent}%` : "Uploading…"}
              </span>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-200"
                  style={{ width: `${uploadPercent}%` }}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_ATTR}
        onChange={(e) => void handleFileSelect(e)}
        style={{ display: "none" }}
      />

      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </div>
  );
};

export default ImageUpload;

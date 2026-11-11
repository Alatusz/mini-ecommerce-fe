import React from "react"
import { ImageIcon, UploadCloud, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  Attachment,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
} from "@/components/ui/attachment"

export interface ProductImageUploadProps {
  value: string
  selectedFile: File | null
  isUploading?: boolean
  useUrlInput: boolean
  onToggleUrlInput: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onOpenFileDialog: () => void
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: () => void
  onUrlChange: (url: string) => void
  disabled?: boolean
}

/**
 * ProductImageUpload
 * Standardized single-image upload control supporting both direct file upload
 * via Base UI Attachment and manual URL input.
 */
export function ProductImageUpload({
  value,
  selectedFile,
  isUploading = false,
  useUrlInput,
  onToggleUrlInput,
  fileInputRef,
  onOpenFileDialog,
  onFileSelect,
  onRemoveImage,
  onUrlChange,
  disabled = false,
}: ProductImageUploadProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">
          Product Image <span className="font-normal text-muted-foreground">(optional)</span>
        </span>
        <button
          type="button"
          onClick={onToggleUrlInput}
          disabled={disabled}
          className="cursor-pointer text-[11px] text-muted-foreground hover:text-foreground"
        >
          {useUrlInput ? "Upload File instead" : "or enter URL"}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={onFileSelect}
        disabled={disabled}
      />

      {useUrlInput ? (
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/60 bg-muted/40 p-1">
            {value ? (
              <img
                src={value}
                alt="Preview"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <ImageIcon className="size-4 text-muted-foreground" />
            )}
          </div>
          <Input
            id="prod-image-url"
            placeholder="https://... or /images/..."
            value={value}
            onChange={(e) => onUrlChange(e.target.value)}
            disabled={disabled}
            className="h-9 font-mono text-xs"
          />
        </div>
      ) : isUploading && selectedFile ? (
        <Attachment state="uploading" className="w-full p-2.5">
          <AttachmentMedia variant="icon" className="size-10 rounded-md">
            <Spinner className="size-4 text-muted-foreground" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle className="text-xs">
              Uploading {selectedFile.name}...
            </AttachmentTitle>
            <AttachmentDescription className="text-[11px]">
              Saving file to server
            </AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      ) : value ? (
        <Attachment state="done" className="w-full p-2">
          <AttachmentMedia variant="image" className="size-10 rounded-md">
            <img
              src={value}
              alt="Product preview"
              className="size-full object-cover"
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle className="truncate text-xs">
              {selectedFile?.name || value.split("/").pop() || "Uploaded Image"}
            </AttachmentTitle>
            <AttachmentDescription className="text-[11px]">
              {selectedFile
                ? `${(selectedFile.size / 1024).toFixed(1)} KB · Ready`
                : "Ready"}
            </AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction
              type="button"
              size="icon-xs"
              variant="ghost"
              onClick={onRemoveImage}
              disabled={disabled}
              className="cursor-pointer text-muted-foreground hover:text-destructive"
              title="Remove image"
            >
              <X className="size-3.5" />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ) : (
        <Attachment
          state="idle"
          onClick={disabled ? undefined : onOpenFileDialog}
          className="w-full cursor-pointer p-2.5 transition-colors hover:bg-muted/40"
        >
          <AttachmentMedia variant="icon" className="size-10 rounded-md">
            <UploadCloud className="size-4 text-muted-foreground" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle className="text-xs">Upload image</AttachmentTitle>
            <AttachmentDescription className="text-[11px]">
              SVG, PNG, JPG under 5MB
            </AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      )}
    </div>
  )
}


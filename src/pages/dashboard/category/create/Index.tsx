import { Link } from "react-router-dom"
import {
  AlertCircle,
  Check,
  ImageIcon,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react"
import { Controller } from "react-hook-form"

import { useCategoryCreate } from "./useHooks"
import { PageContent } from "@/components/common/PageContent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
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

export default function DashboardCategoryCreatePage() {
  const {
    control,
    handleSubmit,
    selectedFile,
    isSubmitting,
    isError,
    useUrlInput,
    toggleUseUrlInput,
    fileInputRef,
    openFileDialog,
    handleFileSelect,
    handleRemoveImage,
  } = useCategoryCreate()

  return (
    <PageContent>
      <div className="mx-auto max-w-2xl space-y-4 pt-1">
        {/* ── Form Card ── */}
        <Card className="border-border/60 bg-card shadow-2xs">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category Name */}
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="category-name"
                      className="text-xs font-medium text-foreground"
                    >
                      Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      {...field}
                      id="category-name"
                      placeholder="Smart Watches"
                      autoFocus
                      aria-invalid={fieldState.invalid}
                      className="h-9 text-xs"
                    />
                    {fieldState.error && (
                      <p className="flex items-center gap-1 text-[11px] text-destructive">
                        <AlertCircle className="size-3" />
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Category Image with Shadcn/ui Attachment */}
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="category-image"
                        className="text-xs font-medium text-foreground"
                      >
                        Image{" "}
                        <span className="font-normal text-muted-foreground">
                          (optional)
                        </span>
                      </Label>
                      <button
                        type="button"
                        onClick={toggleUseUrlInput}
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
                      onChange={(e) => handleFileSelect(e, field.onChange)}
                    />

                    {useUrlInput ? (
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/60 bg-muted/40 p-1">
                          {field.value ? (
                            <img
                              src={field.value}
                              alt="Preview"
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <ImageIcon className="size-4 text-muted-foreground" />
                          )}
                        </div>
                        <Input
                          {...field}
                          id="category-image"
                          placeholder="https://... or /images/..."
                          className="h-9 font-mono text-xs"
                        />
                      </div>
                    ) : isSubmitting && selectedFile ? (
                      /* Attachment Uploading State (on Save) */
                      <Attachment state="uploading" className="w-full p-2.5">
                        <AttachmentMedia
                          variant="icon"
                          className="size-10 rounded-md"
                        >
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
                    ) : field.value ? (
                      /* Attachment Done / Preview State */
                      <Attachment state="done" className="w-full p-2">
                        <AttachmentMedia
                          variant="image"
                          className="size-10 rounded-md"
                        >
                          <img
                            src={field.value}
                            alt="Category"
                            className="size-full object-cover"
                          />
                        </AttachmentMedia>
                        <AttachmentContent>
                          <AttachmentTitle className="truncate text-xs">
                            {selectedFile?.name ||
                              field.value.split("/").pop() ||
                              "Uploaded Image"}
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
                            onClick={() =>
                              handleRemoveImage(
                                field.onChange,
                                field.value || ""
                              )
                            }
                            className="cursor-pointer text-muted-foreground hover:text-destructive"
                            title="Remove image"
                          >
                            <X className="size-3.5" />
                          </AttachmentAction>
                        </AttachmentActions>
                      </Attachment>
                    ) : (
                      /* Attachment Idle State (Click to Upload) */
                      <Attachment
                        state="idle"
                        onClick={openFileDialog}
                        className="w-full cursor-pointer p-2.5 transition-colors hover:bg-muted/40"
                      >
                        <AttachmentMedia
                          variant="icon"
                          className="size-10 rounded-md"
                        >
                          <UploadCloud className="size-4 text-muted-foreground" />
                        </AttachmentMedia>
                        <AttachmentContent>
                          <AttachmentTitle className="text-xs">
                            Click to upload image
                          </AttachmentTitle>
                          <AttachmentDescription className="text-[11px]">
                            PNG, JPG, WEBP or GIF up to 5MB
                          </AttachmentDescription>
                        </AttachmentContent>
                      </Attachment>
                    )}
                  </div>
                )}
              />

              {/* Status Segmented Selection */}
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <div className="space-y-1.5 pt-1">
                    <Label className="text-xs font-medium text-foreground">
                      Status
                    </Label>
                    <div className="grid grid-cols-3 gap-3 pt-0.5">
                      {[
                        {
                          value: "active",
                          label: "Active",
                          tag: "Public",
                          dotClass: "bg-emerald-500",
                        },
                        {
                          value: "archived",
                          label: "Archived",
                          tag: "Hidden",
                          dotClass: "bg-zinc-400",
                        },
                        {
                          value: "draft",
                          label: "Draft",
                          tag: "Unpublished",
                          dotClass: "bg-amber-500",
                        },
                      ].map((status) => {
                        const selected = field.value === status.value

                        return (
                          <button
                            key={status.value}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => field.onChange(status.value)}
                            className={`flex cursor-pointer items-center justify-between rounded-lg border px-3.5 py-2.5 text-left transition-all ${
                              selected
                                ? "border-primary/40 bg-primary/5 text-foreground ring-1 ring-primary/20"
                                : "border-border/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`size-2 rounded-full ${status.dotClass}`}
                              />
                              <span className="text-xs font-medium text-foreground">
                                {status.label}
                              </span>
                            </div>
                            <span className="text-[11px] text-muted-foreground">
                              {status.tag}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              />

              {isError && (
                <p
                  role="alert"
                  className="flex items-center gap-1 text-xs text-destructive"
                >
                  <AlertCircle className="size-3.5" />
                  Save failed
                </p>
              )}

              {/* Bottom Action Footer */}
              <div className="flex items-center justify-end gap-2 border-t border-border/40 pt-4">
                <Link to="/dashboard/category">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 cursor-pointer text-xs"
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="h-8 cursor-pointer gap-1.5 bg-foreground px-3.5 text-xs text-background hover:bg-foreground/90"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  <span>{isSubmitting ? "Saving..." : "Create"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContent>
  )
}

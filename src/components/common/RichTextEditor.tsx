import { useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Minus,
} from "lucide-react"

import { cn } from "cn"
import { Button } from "@/components/ui/button"

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
  error?: boolean
  disabled?: boolean
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write product description...",
  error = false,
  disabled = false,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:float-left before:text-muted-foreground/60 before:pointer-events-none before:h-0",
      }),
    ],
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "max-h-[300px] min-h-[140px] overflow-y-auto px-3 py-2.5 text-xs text-foreground focus:outline-none",
          // กำหนด typography พื้นฐาน
          "[&_p]:mb-1 [&_p]:leading-relaxed",
          "[&_h2]:mt-1 [&_h2]:mb-2 [&_h2]:text-sm [&_h2]:font-semibold",
          "[&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-4",
          "[&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-4",
          "[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-2.5 [&_blockquote]:text-muted-foreground [&_blockquote]:italic",
          "[&_hr]:my-2 [&_hr]:border-border/60"
        ),
      },
    },
    onUpdate: ({ editor }) => {
      // เมื่อผู้ใช้พิมพ์ ส่ง HTML ออกไป
      const html = editor.isEmpty ? "" : editor.getHTML()
      onChange(html)
    },
  })

  // ซิงค์ค่า value จากภายนอกเข้ามา (เช่น ตอนโหลดข้อมูลในหน้า Edit)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      if (!editor.isFocused) {
        editor.commands.setContent(value || "", false)
      }
    }
  }, [value, editor])

  if (!editor) return null

  return (
    <div
      className={cn(
        "rounded-md border bg-background shadow-2xs transition-colors focus-within:ring-1",
        error
          ? "border-destructive focus-within:ring-destructive"
          : "border-input focus-within:border-ring focus-within:ring-ring",
        disabled && "pointer-events-none bg-muted/20 opacity-50",
        className
      )}
    >
      {/* ── Toolbar Bar ── */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border/50 bg-muted/20 px-2 py-1">
        {/* Bold */}
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="size-7 cursor-pointer p-0"
          title="Bold (Ctrl+B)"
        >
          <Bold className="size-3.5" />
        </Button>

        {/* Italic */}
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="size-7 cursor-pointer p-0"
          title="Italic (Ctrl+I)"
        >
          <Italic className="size-3.5" />
        </Button>

        {/* Strikethrough */}
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("strike") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className="size-7 cursor-pointer p-0"
          title="Strikethrough"
        >
          <Strikethrough className="size-3.5" />
        </Button>

        <span className="mx-1 h-3.5 w-px bg-border/60" />

        {/* Heading 2 */}
        <Button
          type="button"
          size="sm"
          variant={
            editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="size-7 cursor-pointer p-0"
          title="Heading"
        >
          <Heading2 className="size-3.5" />
        </Button>

        {/* Bullet List */}
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="size-7 cursor-pointer p-0"
          title="Bullet List"
        >
          <List className="size-3.5" />
        </Button>

        {/* Ordered List */}
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="size-7 cursor-pointer p-0"
          title="Numbered List"
        >
          <ListOrdered className="size-3.5" />
        </Button>

        {/* Blockquote */}
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="size-7 cursor-pointer p-0"
          title="Quote"
        >
          <Quote className="size-3.5" />
        </Button>

        {/* Horizontal Divider */}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="size-7 cursor-pointer p-0"
          title="Horizontal Line"
        >
          <Minus className="size-3.5" />
        </Button>

        <span className="mx-1 h-3.5 w-px bg-border/60" />

        {/* Undo */}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
          className="size-7 cursor-pointer p-0 disabled:opacity-30"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="size-3.5" />
        </Button>

        {/* Redo */}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
          className="size-7 cursor-pointer p-0 disabled:opacity-30"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="size-3.5" />
        </Button>
      </div>

      {/* ── Editor Canvas ── */}
      <EditorContent editor={editor} />
    </div>
  )
}

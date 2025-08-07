"use client"

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MenuBarProps {
  editor: any;
}

const MenuBar = ({ editor }: MenuBarProps) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-gray-200' : ''}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-gray-200' : ''}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'bg-gray-200' : ''}
      >
        <Code className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  resizable?: boolean;
}

export function TiptapEditor({
  value,
  onChange,
  onBlur,
  placeholder = "Start typing...",
  className,
  minHeight = "200px",
  resizable = false,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: true,
    onUpdate: ({ editor }) => {
      // Only call onChange when the content actually changes
      const newContent = editor.getHTML();
      if (newContent !== value) {
        onChange(newContent);
      }
    },
    onBlur: ({ editor }) => {
      onBlur && onBlur(editor.getHTML());
    },
    editorProps: {
      attributes: {
        'data-placeholder': placeholder,
        style: `min-height: ${minHeight};`,
      },
    },
  });

  useEffect(() => {
    // Only update content from props if the editor isn't currently focused
    // This prevents content jumps while typing
    if (editor && value !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  return (
    <div className={`tiptap-editor-wrapper ${resizable ? 'resizable' : ''}`}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
}
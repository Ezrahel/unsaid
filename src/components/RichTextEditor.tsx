import React from 'react';
import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { 
  Bold, 
  Code2,
  Eraser,
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Heading1, 
  Heading2,
  Quote,
  Strikethrough,
  Type,
  Palette,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Custom FontSize extension
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run();
      },
    };
  },
});

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const fontSizes = [
    { label: 'DEFAULT', value: null },
    { label: 'TINY', value: '12px' },
    { label: 'SMALL', value: '14px' },
    { label: 'BODY', value: '16px' },
    { label: 'NORMAL', value: '18px' },
    { label: 'MEDIUM', value: '20px' },
    { label: 'LARGE', value: '24px' },
    { label: 'X-LARGE', value: '32px' },
    { label: 'DISPLAY', value: '40px' },
    { label: '2X-LARGE', value: '48px' },
    { label: 'MASSIVE', value: '64px' },
    { label: 'MONUMENT', value: '72px' },
  ];

  const colorFamilies = [
    {
      label: 'NEUTRALS',
      colors: [
        { label: 'DEFAULT', value: 'currentColor' },
        { label: 'SILENCE', value: '#737373' },
        { label: 'SOUL', value: '#404040' },
        { label: 'MIDNIGHT', value: '#0f172a' },
        { label: 'PURITY', value: '#ffffff' },
      ],
    },
    {
      label: 'EMBERS',
      colors: [
        { label: 'BLOOD', value: '#ef4444' },
        { label: 'AMBER', value: '#f59e0b' },
        { label: 'EMBER', value: '#f97316' },
        { label: 'WARNING', value: '#eab308' },
      ],
    },
    {
      label: 'TIDES',
      colors: [
        { label: 'SORROW', value: '#3b82f6' },
        { label: 'TIDE', value: '#14b8a6' },
        { label: 'AURA', value: '#8b5cf6' },
        { label: 'BLOOM', value: '#ec4899' },
      ],
    },
    {
      label: 'EARTH',
      colors: [
        { label: 'GROWTH', value: '#22c55e' },
        { label: 'MOSS', value: '#84cc16' },
      ],
    },
  ];

  const buttons = [
    {
      icon: Heading1,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
      label: 'H1',
    },
    {
      icon: Heading2,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
      label: 'H2',
    },
    {
      icon: Bold,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      label: 'Bold',
    },
    {
      icon: Italic,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      label: 'Italic',
    },
    {
      icon: Strikethrough,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
      label: 'Strike',
    },
    {
      icon: UnderlineIcon,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
      label: 'Underline',
    },
    {
      icon: Quote,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
      label: 'Quote',
    },
    {
      icon: Code2,
      onClick: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code'),
      label: 'Code',
    },
    {
      icon: List,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      label: 'Bullet List',
    },
    {
      icon: ListOrdered,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      label: 'Ordered List',
    },
  ];

  const alignmentButtons = [
    {
      icon: AlignLeft,
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: editor.isActive({ textAlign: 'left' }),
      label: 'Align Left',
    },
    {
      icon: AlignCenter,
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: editor.isActive({ textAlign: 'center' }),
      label: 'Align Center',
    },
    {
      icon: AlignRight,
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: editor.isActive({ textAlign: 'right' }),
      label: 'Align Right',
    },
    {
      icon: AlignJustify,
      onClick: () => editor.chain().focus().setTextAlign('justify').run(),
      isActive: editor.isActive({ textAlign: 'justify' }),
      label: 'Justify',
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 mb-6 p-1 border-b border-foreground/5 sticky top-0 bg-background/50 backdrop-blur-md z-10 rounded-t-lg">
      <DropdownMenu>
        <DropdownMenuTrigger render={
            <Button variant="ghost" size="sm" className="h-8 gap-1 font-mono text-[10px] tracking-widest opacity-60 hover:opacity-100 transition-opacity">
              <Type className="h-3.5 w-3.5" />
              SIZE
              <ChevronDown className="h-3 w-3 opacity-40" />
            </Button>
          } 
        />
        <DropdownMenuContent className="nothing-border glass font-mono text-[10px] tracking-widest min-w-[120px]">
          {fontSizes.map((size) => (
            <DropdownMenuItem 
              key={size.label}
              onClick={() => size.value ? editor.chain().focus().setFontSize(size.value).run() : editor.chain().focus().unsetFontSize().run()}
              className="hover:bg-foreground/5 cursor-pointer"
            >
              {size.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover>
        <PopoverTrigger render={
            <Button variant="ghost" size="sm" className="h-8 gap-1 font-mono text-[10px] tracking-widest opacity-60 hover:opacity-100 transition-opacity">
              <Palette className="h-3.5 w-3.5" />
              COLOR
              <ChevronDown className="h-3 w-3 opacity-40" />
            </Button>
          } 
        />
        <PopoverContent className="nothing-border glass p-3 min-w-[240px]">
          <div className="space-y-3">
            {colorFamilies.map((family) => (
              <div key={family.label}>
                <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.25em] opacity-40">
                  {family.label}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {family.colors.map((color) => (
                    <button
                      key={color.label}
                      onClick={() => editor.chain().focus().setColor(color.value).run()}
                      className="w-8 h-8 rounded-full border border-foreground/10 hover:scale-110 transition-transform flex items-center justify-center p-1"
                      title={color.label}
                      style={{ backgroundColor: color.value === 'currentColor' ? 'transparent' : color.value }}
                    >
                      {color.value === 'currentColor' && <Type className="h-3 w-3" />}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="h-6 mx-1 bg-foreground/10" />

      {buttons.map((btn, i) => (
        <Button
          key={i}
          size="icon"
          variant="ghost"
          onClick={btn.onClick}
          className={`h-8 w-8 nothing-border transition-colors ${
            btn.isActive ? 'bg-foreground text-background' : 'opacity-40 hover:opacity-100'
          }`}
          title={btn.label}
        >
          <btn.icon className="h-4 w-4" />
        </Button>
      ))}

      <Separator orientation="vertical" className="h-6 mx-1 bg-foreground/10" />

      {alignmentButtons.map((btn, i) => (
        <Button
          key={i}
          size="icon"
          variant="ghost"
          onClick={btn.onClick}
          className={`h-8 w-8 nothing-border transition-colors ${
            btn.isActive ? 'bg-foreground text-background' : 'opacity-40 hover:opacity-100'
          }`}
          title={btn.label}
        >
          <btn.icon className="h-4 w-4" />
        </Button>
      ))}

      <Separator orientation="vertical" className="h-6 mx-1 bg-foreground/10" />

      <Button
        size="icon"
        variant="ghost"
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        className="h-8 w-8 nothing-border opacity-40 hover:opacity-100 transition-colors"
        title="Clear Formatting"
      >
        <Eraser className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        underline: false,
      }),
      Underline,
      TextStyle,
      Color,
      FontSize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: placeholder || 'START TYPING HERE...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[400px] focus:outline-none font-light text-xl md:text-2xl leading-relaxed p-6',
      },
    },
  });

  return (
    <div className="w-full border border-foreground/5 rounded-lg">
      <MenuBar editor={editor} />
      <div className="bg-foreground/[0.02]">
        <EditorContent editor={editor} />
      </div>
      <style>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: currentColor;
          opacity: 0.1;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror blockquote {
          border-left: 2px solid currentColor;
          padding-left: 1.5rem;
          opacity: 0.6;
          font-style: italic;
        }
        .ProseMirror code {
          background: rgba(0, 0, 0, 0.06);
          padding: 0.15rem 0.35rem;
          border-radius: 0.25rem;
          font-size: 0.9em;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
        }
        .ProseMirror h1 {
          font-size: 2.25rem;
          line-height: 2.5rem;
          margin-bottom: 1.5rem;
        }
        .ProseMirror h2 {
          font-size: 1.875rem;
          line-height: 2.25rem;
          margin-bottom: 1.25rem;
        }
        .ProseMirror {
          min-height: 400px;
        }
      `}</style>
    </div>
  );
};

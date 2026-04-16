import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import { useEffect } from 'react';
import {
    Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2,
    List, ListOrdered, ListChecks, ImageIcon, Link as LinkIcon, Minus, Youtube as YoutubeIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import './RichTextEditor.css';

interface Props {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

interface ToolbarButtonProps {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
}

function ToolbarButton({ onClick, active, title, children }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            className={cn('rte-toolbar-btn', active && 'active')}
        >
            {children}
        </button>
    );
}

function ToolbarDivider() {
    return <span className="rte-toolbar-divider" />;
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Image.configure({ inline: false }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Link.configure({ openOnClick: false }),
            Youtube.configure({ width: 640, height: 360, nocookie: true }),
        ],
        content: value || '',
        editorProps: {
            attributes: {
                class: 'rte-content',
                ...(placeholder ? { 'data-placeholder': placeholder } : {}),
            },
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });

    // Sync external resets (e.g. form reset after submit)
    useEffect(() => {
        if (!editor) return;
        if (value === '' && editor.getHTML() !== '<p></p>') {
            editor.commands.clearContent();
        }
    }, [value, editor]);

    if (!editor) return null;

    function handleImage() {
        const url = window.prompt('Image URL');
        if (url) editor?.chain().focus().setImage({ src: url }).run();
    }

    function handleLink() {
        const url = window.prompt('URL');
        if (url) editor?.chain().focus().setLink({ href: url }).run();
        else editor?.chain().focus().unsetLink().run();
    }

    function handleYoutube() {
        const url = window.prompt('YouTube URL');
        if (url) editor?.chain().focus().setYoutubeVideo({ src: url }).run();
    }

    return (
        <div className="rte-wrapper">
            <div className="rte-toolbar">
                <ToolbarButton title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
                    <Bold size={14} />
                </ToolbarButton>
                <ToolbarButton title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
                    <Italic size={14} />
                </ToolbarButton>
                <ToolbarButton title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')}>
                    <UnderlineIcon size={14} />
                </ToolbarButton>

                <ToolbarDivider />

                <ToolbarButton title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })}>
                    <Heading1 size={14} />
                </ToolbarButton>
                <ToolbarButton title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>
                    <Heading2 size={14} />
                </ToolbarButton>

                <ToolbarDivider />

                <ToolbarButton title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
                    <List size={14} />
                </ToolbarButton>
                <ToolbarButton title="Ordered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
                    <ListOrdered size={14} />
                </ToolbarButton>
                <ToolbarButton title="Checklist" onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive('taskList')}>
                    <ListChecks size={14} />
                </ToolbarButton>

                <ToolbarDivider />

                <ToolbarButton title="Image" onClick={handleImage}>
                    <ImageIcon size={14} />
                </ToolbarButton>
                <ToolbarButton title="Link" onClick={handleLink} active={editor.isActive('link')}>
                    <LinkIcon size={14} />
                </ToolbarButton>
                <ToolbarButton title="YouTube embed" onClick={handleYoutube}>
                    <YoutubeIcon size={14} />
                </ToolbarButton>

                <ToolbarDivider />

                <ToolbarButton title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                    <Minus size={14} />
                </ToolbarButton>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}

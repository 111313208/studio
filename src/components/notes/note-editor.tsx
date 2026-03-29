"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Note } from "@/hooks/use-notes";
import { Bold, Italic, List, ListOrdered, Save, Trash2, X, Tag as TagIcon, Layout } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NoteEditorProps {
  note: Note | null;
  onSave: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

export function NoteEditor({ note, onSave, onUpdate, onDelete, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [category, setCategory] = useState(note?.category || "未分類");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(note?.tags || []);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category);
      setTags(note.tags);
    } else {
      setTitle("");
      setContent("");
      setCategory("未分類");
      setTags([]);
    }
  }, [note]);

  const handleSave = () => {
    if (!title.trim()) return;
    
    if (note) {
      onUpdate(note.id, { title, content, category, tags });
    } else {
      onSave({ title, content, category, tags });
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-4 border-b bg-muted/30 flex items-center justify-between gap-4">
        <div className="flex-1">
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            placeholder="請輸入筆記標題..." 
            className="text-xl font-headline font-bold bg-transparent border-none focus-visible:ring-0 px-0 h-auto"
          />
        </div>
        <div className="flex items-center gap-2">
          {note && (
            <Button variant="ghost" size="icon" onClick={() => onDelete(note.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button variant="outline" onClick={onCancel}>取消</Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            儲存筆記
          </Button>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-b bg-background/50">
        <div className="flex items-center gap-2">
          <Layout className="h-4 w-4 text-muted-foreground" />
          <Input 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="學科或分類 (例如: 微積分)"
            className="h-8 bg-transparent"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TagIcon className="h-4 w-4 text-muted-foreground shrink-0" />
          {tags.map(tag => (
            <Badge key={tag} variant="secondary" className="gap-1 px-2 py-0.5">
              {tag}
              <button onClick={() => removeTag(tag)} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Input 
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="新增標籤... (Enter)"
            className="h-8 w-32 bg-transparent text-xs"
          />
        </div>
      </div>

      {/* Toolbar - Decorative for UI mockup of "Rich Text" */}
      <div className="px-4 py-2 border-b flex gap-1 bg-muted/10">
        <Button variant="ghost" size="icon" className="h-8 w-8"><Bold className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8"><Italic className="h-4 w-4" /></Button>
        <div className="w-px h-4 bg-border self-center mx-1" />
        <Button variant="ghost" size="icon" className="h-8 w-8"><List className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8"><ListOrdered className="h-4 w-4" /></Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="開始撰寫您的學習內容、重點整理..."
          className="min-h-full resize-none border-none focus-visible:ring-0 p-0 text-lg leading-relaxed font-body"
        />
      </div>
    </div>
  );
}
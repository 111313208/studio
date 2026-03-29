"use client"

import { useState, useMemo } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { NoteSidebar } from "@/components/notes/note-sidebar";
import { NoteCard } from "@/components/notes/note-card";
import { NoteEditor } from "@/components/notes/note-editor";
import { useNotes, Note } from "@/hooks/use-notes";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Clock, SortAsc, LayoutGrid, List } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { notes, addNote, updateNote, deleteNote, isLoaded } = useNotes();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(notes.map(n => n.category).filter(Boolean));
    return Array.from(cats);
  }, [notes]);

  const tags = useMemo(() => {
    const allTags = notes.flatMap(n => n.tags);
    return Array.from(new Set(allTags));
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategoryId ? note.category === selectedCategoryId : true;
      const matchesTag = selectedTagId ? note.tags.includes(selectedTagId) : true;
      
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [notes, searchQuery, selectedCategoryId, selectedTagId]);

  const currentEditingNote = useMemo(() => {
    return notes.find(n => n.id === editingNoteId) || null;
  }, [notes, editingNoteId]);

  const handleNewNote = () => {
    setEditingNoteId(null);
    setIsCreating(true);
  };

  const handleSaveNew = (note: Omit<Note, 'id' | 'updatedAt'>) => {
    const id = addNote(note);
    setEditingNoteId(id);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    deleteNote(id);
    setEditingNoteId(null);
  };

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-full" />
          <p className="font-headline font-bold text-lg text-primary">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <NoteSidebar 
        categories={categories}
        tags={tags}
        selectedCategory={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        selectedTag={selectedTagId}
        onSelectTag={setSelectedTagId}
        onNewNote={handleNewNote}
      />
      <SidebarInset className="bg-background">
        <div className="flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b px-6 bg-white shadow-sm z-10">
            <div className="flex items-center gap-4 flex-1">
              <SidebarTrigger className="-ml-1" />
              <div className="relative max-w-md w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="搜尋筆記標題、內容、標籤..."
                  className="pl-9 bg-muted/20 border-muted focus-visible:ring-primary h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" title="切換檢視"><LayoutGrid className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" title="排序方式"><SortAsc className="h-4 w-4" /></Button>
            </div>
          </header>

          <main className="flex-1 flex overflow-hidden">
            {/* List area */}
            <div className={`flex flex-col border-r bg-muted/10 transition-all duration-300 ${editingNoteId || isCreating ? 'w-full md:w-80' : 'w-full'}`}>
              <div className="p-4 border-b bg-white flex items-center justify-between">
                <h2 className="font-headline font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  最近筆記
                </h2>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                  {filteredNotes.length} 份
                </span>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {filteredNotes.map(note => (
                    <NoteCard 
                      key={note.id} 
                      note={note} 
                      onClick={() => { setEditingNoteId(note.id); setIsCreating(false); }}
                      isActive={editingNoteId === note.id}
                    />
                  ))}
                  {filteredNotes.length === 0 && (
                    <div className="text-center py-12 flex flex-col items-center gap-4 opacity-40">
                      <BookOpen className="h-12 w-12" />
                      <div className="space-y-1">
                        <p className="font-bold">找不到筆記</p>
                        <p className="text-xs">試試搜尋其他關鍵字或是建立一份新筆記</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Editor area */}
            <div className={`flex-1 p-6 bg-muted/5 transition-all duration-500 overflow-hidden ${editingNoteId || isCreating ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0 pointer-events-none absolute'}`}>
              {(editingNoteId || isCreating) && (
                <NoteEditor 
                  note={currentEditingNote}
                  onSave={handleSaveNew}
                  onUpdate={updateNote}
                  onDelete={handleDelete}
                  onCancel={() => { setEditingNoteId(null); setIsCreating(false); }}
                />
              )}
            </div>

            {/* Empty State when no editor is open */}
            {!(editingNoteId || isCreating) && (
              <div className="hidden md:flex flex-1 flex-col items-center justify-center p-12 text-center opacity-40">
                <div className="bg-primary/10 p-8 rounded-full mb-6">
                  <BookOpen className="h-24 w-24 text-primary" />
                </div>
                <h2 className="text-3xl font-headline font-bold text-primary mb-2">準備好開始學習了嗎？</h2>
                <p className="max-w-md text-lg leading-relaxed">
                  點擊左側筆記進行瀏覽，或是建立一份新的學科筆記來記錄您的課程重點。
                </p>
                <Button onClick={handleNewNote} className="mt-8 gap-2 px-8" size="lg">
                  <Plus className="h-5 w-5" />
                  立即建立首份筆記
                </Button>
              </div>
            )}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
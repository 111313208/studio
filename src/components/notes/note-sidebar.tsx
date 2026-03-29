"use client"

import { Book, Hash, LayoutGrid, Plus, Search, Tag, Trash2 } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Note } from "@/hooks/use-notes";

interface NoteSidebarProps {
  categories: string[];
  tags: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  onNewNote: () => void;
}

export function NoteSidebar({
  categories,
  tags,
  selectedCategory,
  onSelectCategory,
  selectedTag,
  onSelectTag,
  onNewNote
}: NoteSidebarProps) {
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-primary p-2 rounded-lg">
            <Book className="text-primary-foreground h-5 w-5" />
          </div>
          <h1 className="font-headline font-bold text-xl tracking-tight text-primary">學習筆記通</h1>
        </div>
        <Button onClick={onNewNote} className="w-full justify-start gap-2 shadow-sm font-medium" size="lg">
          <Plus className="h-4 w-4" />
          建立新筆記
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 font-headline uppercase tracking-wider text-xs font-bold text-muted-foreground">主選單</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={selectedCategory === null && selectedTag === null}
                  onClick={() => { onSelectCategory(null); onSelectTag(null); }}
                  className="px-4"
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span>所有筆記</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 font-headline uppercase tracking-wider text-xs font-bold text-muted-foreground">課程分類</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((cat) => (
                <SidebarMenuItem key={cat}>
                  <SidebarMenuButton 
                    isActive={selectedCategory === cat}
                    onClick={() => { onSelectCategory(cat); onSelectTag(null); }}
                    className="px-4"
                  >
                    <Book className="h-4 w-4" />
                    <span>{cat}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {categories.length === 0 && (
                <div className="px-6 py-2 text-xs text-muted-foreground italic">尚未建立分類</div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 font-headline uppercase tracking-wider text-xs font-bold text-muted-foreground">熱門標籤</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tags.map((tag) => (
                <SidebarMenuItem key={tag}>
                  <SidebarMenuButton 
                    isActive={selectedTag === tag}
                    onClick={() => { onSelectTag(tag); onSelectCategory(null); }}
                    className="px-4"
                  >
                    <Hash className="h-4 w-4" />
                    <span>{tag}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {tags.length === 0 && (
                <div className="px-6 py-2 text-xs text-muted-foreground italic">尚未建立標籤</div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="bg-secondary/50 p-3 rounded-lg text-xs text-muted-foreground border border-dashed">
          💡 點擊上方按鈕開始記錄您的學習靈感
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
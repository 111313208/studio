"use client"

import { Note } from "@/hooks/use-notes";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Hash, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  isActive?: boolean;
}

export function NoteCard({ note, onClick, isActive }: NoteCardProps) {
  return (
    <Card 
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 ${isActive ? 'border-l-primary ring-1 ring-primary/20 bg-primary/5 shadow-inner' : 'border-l-transparent'}`}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-tight mb-2 text-primary border-primary/20">
            {note.category}
          </Badge>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {format(note.updatedAt, 'yyyy/MM/dd', { locale: zhTW })}
          </span>
        </div>
        <CardTitle className="text-lg font-headline font-semibold line-clamp-1 text-primary">
          {note.title || "未命名筆記"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-normal font-body">
          {note.content || "無內容..."}
        </p>
      </CardContent>
      {note.tags.length > 0 && (
        <CardFooter className="p-4 pt-0 flex flex-wrap gap-1">
          {note.tags.slice(0, 3).map(tag => (
            <span key={tag} className="flex items-center gap-0.5 text-[10px] bg-secondary px-1.5 py-0.5 rounded-full text-secondary-foreground font-medium">
              <Hash className="h-2 w-2" />
              {tag}
            </span>
          ))}
          {note.tags.length > 3 && <span className="text-[10px] text-muted-foreground">+{note.tags.length - 3}</span>}
        </CardFooter>
      )}
    </Card>
  );
}
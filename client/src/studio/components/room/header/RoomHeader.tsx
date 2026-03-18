import { Link } from "wouter";
import { ArrowLeft, User, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@studio/lib/utils";

interface RoomHeaderProps {
  isMobile: boolean;
  studioId: string;
  sessionId: string;
  productionName?: string;
  sessionTitle?: string;
  sideScriptWidth?: number;
  recordingStatus?: string;
  recordingProfile?: any;
  charSelectorOpen: boolean;
  setCharSelectorOpen: (open: boolean) => void;
  charactersList: any[];
  handleCharacterChange: (char: any) => void;
  onExitRequest?: () => boolean;
}

export function RoomHeader({
  isMobile,
  studioId,
  sessionId,
  productionName = "Sessão",
  sessionTitle = "",
  sideScriptWidth = 320,
  recordingStatus,
  recordingProfile,
  charSelectorOpen,
  setCharSelectorOpen,
  charactersList,
  handleCharacterChange,
  onExitRequest
}: RoomHeaderProps) {
  return (
    <header 
      className={cn(
        "shrink-0 flex items-center px-4 h-16 relative z-20 transition-[grid-template-columns] duration-75 room-header",
        !isMobile ? "grid" : "justify-between"
      )} 
      style={{
        background: "hsl(var(--background) / 0.90)", 
        backdropFilter: "blur(16px)", 
        WebkitBackdropFilter: "blur(16px)", 
        borderBottom: "1px solid hsl(var(--border) / 0.9)",
        gridTemplateColumns: !isMobile ? `1fr ${sideScriptWidth}px` : undefined
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <Link href={`/hub-dub/studio/${studioId}/dashboard`}>
          <button
            onClick={(e) => {
              if (onExitRequest && !onExitRequest()) {
                e.preventDefault();
              }
            }}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-xs sm:text-sm truncate text-foreground">{productionName}</span>
          <span className="text-[10px] text-muted-foreground truncate">{sessionTitle}</span>
        </div>
        
        <div className="relative ml-2">
          <button
            onClick={() => setCharSelectorOpen(!charSelectorOpen)}
            className="h-7 px-2 rounded-md bg-white/5 border border-white/10 text-[11px] text-muted-foreground hover:text-foreground hover:bg-white/10 flex items-center gap-1.5"
            data-testid="button-character-selector"
          >
            <User className="w-3.5 h-3.5" />
            <span className="max-w-[140px] truncate">{recordingProfile?.characterName || "Personagem"}</span>
            <ChevronRight className={cn("w-3 h-3 transition-transform", charSelectorOpen && "rotate-90")} />
          </button>
          <AnimatePresence>
            {charSelectorOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute top-full left-0 mt-2 w-64 rounded-xl bg-popover/95 backdrop-blur-xl border border-border shadow-2xl p-2"
                style={{ zIndex: 1150 }}
              >
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1.5 border-b border-border/60 mb-1">Selecionar personagem</div>
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                  {(charactersList || []).map((char) => (
                    <button
                      key={char.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCharacterChange(char);
                        setCharSelectorOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-2 py-2 rounded-md text-xs transition-colors",
                        recordingProfile?.characterId === char.id ? "bg-primary/12 text-primary" : "text-foreground hover:bg-muted/60"
                      )}
                    >
                      {char.name}
                    </button>
                  ))}
                  {(!charactersList || charactersList.length === 0) && (
                    <div className="px-2 py-3 text-xs text-muted-foreground">Nenhum personagem cadastrado.</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

import { Mic, Play, Pause, RotateCcw, Square, Repeat, Loader2 } from "lucide-react";
import { cn } from "@studio/lib/utils";
import { type RecordingStatus } from "@studio/pages/room";

interface DesktopControlsBarProps {
  isPlaying: boolean;
  isLooping: boolean;
  recordingStatus: RecordingStatus;
  micReady: boolean;
  isSaving: boolean;
  micInitializing: boolean;
  videoTime: number;
  videoDuration: number;
  formatTimecode: (t: number) => string;
  onSeekBack: () => void;
  onPlayPause: () => void;
  onSeekForward: () => void;
  onScrub: (ratio: number) => void;
  onLoop: () => void;
  onRecord: () => void;
  onStopRecord: () => void;
}

export function DesktopControlsBar({
  isPlaying,
  isLooping,
  recordingStatus,
  micReady,
  isSaving,
  micInitializing,
  videoTime,
  videoDuration,
  formatTimecode,
  onSeekBack,
  onPlayPause,
  onSeekForward,
  onScrub,
  onLoop,
  onRecord,
  onStopRecord,
}: DesktopControlsBarProps) {
  const isRecording = recordingStatus === "recording";
  const canRecord = recordingStatus === "idle" || recordingStatus === "recorded";

  return (
    <div className="shrink-0 h-20 room-controls flex items-center px-8 gap-6 z-40">
      <div className="flex items-center gap-2">
        <button
          onClick={onSeekBack}
          className="w-9 h-9 room-rounded flex items-center justify-center room-button-secondary room-transition"
          title="Recuar 2s"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={onPlayPause}
          className={cn(
            "w-11 h-11 room-rounded flex items-center justify-center room-transition",
            isPlaying ? "room-button-primary" : "room-button-secondary"
          )}
          title={isPlaying ? "Pausar" : "Reproduzir"}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={onSeekForward}
          className="w-9 h-9 room-rounded flex items-center justify-center room-button-secondary room-transition"
          title="Avançar 2s"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex justify-between text-[10px] font-mono text-white/30 uppercase tracking-tighter">
          <span>{formatTimecode(videoTime)}</span>
          <span>{formatTimecode(videoDuration)}</span>
        </div>
        <div
          className="relative h-1.5 rounded-full bg-white/10 cursor-pointer overflow-hidden"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            onScrub((e.clientX - rect.left) / rect.width);
          }}
        >
          <div
            className="absolute top-0 bottom-0 bg-primary transition-all duration-100"
            style={{ width: `${videoDuration > 0 ? (videoTime / videoDuration) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onLoop}
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center border transition-all",
            isLooping
              ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
              : "bg-white/5 border-white/10 text-white/60 hover:text-white"
          )}
          title="Configurar Loop"
        >
          <Repeat className="w-4 h-4" />
        </button>

        {canRecord ? (
          <button
            onClick={onRecord}
            disabled={!micReady || isSaving || micInitializing}
            className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center transition-all",
              micInitializing
                ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-300 animate-pulse"
                : !micReady
                ? "bg-red-500/20 border-red-500/40 text-red-300"
                : "bg-white/10 border-white/20 text-white hover:bg-white/20"
            )}
            title={
              micInitializing
                ? "Inicializando microfone..."
                : !micReady
                ? "Microfone não disponível"
                : "Gravar"
            }
          >
            {isSaving || micInitializing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        ) : isRecording ? (
          <button
            onClick={onStopRecord}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-red-500 animate-pulse"
            title="Parar Gravação"
          >
            <Square className="w-5 h-5 text-white fill-white" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

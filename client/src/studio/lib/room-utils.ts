import { type Shortcuts } from "@studio/pages/room";

export const DEFAULT_SHORTCUTS: Shortcuts = {
  playPause: "Space",
  record: "KeyR",
  stop: "KeyS",
  back: "ArrowLeft",
  forward: "ArrowRight",
  loop: "KeyL",
};

export const SHORTCUT_LABELS: Record<keyof Shortcuts, string> = {
  playPause: "Play / Pause",
  record: "Gravar",
  stop: "Parar",
  back: "Voltar 2s",
  forward: "Avançar 2s",
  loop: "Alternar Loop",
};

export const UI_LAYER_BASE = {
  playerControls: 160,
  floatingButtons: 180,
  chatPanel: 1150,
  modalOverlay: 1400,
  confirmationModal: 1500,
  mobileDrawerOverlay: 1450,
  mobileDrawerContent: 1500,
} as const;

export function keyLabel(code: string) {
  if (code === "Space") return "Espaço";
  if (code.startsWith("Key")) return code.slice(3);
  if (code.startsWith("Arrow")) return code.slice(5);
  return code;
}

export function normalizeRoomRole(role: unknown): string {
  const str = String(role || "").trim().toLowerCase();
  switch (str) {
    case "owner":
    case "admin":
    case "director":
      return str;
    default:
      return "dubber";
  }
}

export type UiRole = "viewer" | "text_controller" | "audio_controller" | "admin";
export type UiPermission = "text_control" | "audio_control" | "presence_view" | "approve_take" | "dashboard_access";

export const UI_ROLE_PERMISSIONS: Record<UiRole, UiPermission[]> = {
  viewer: [],
  text_controller: ["text_control", "presence_view"],
  audio_controller: ["audio_control", "presence_view"],
  admin: ["text_control", "audio_control", "approve_take", "dashboard_access", "presence_view"],
};

const PRIVILEGED_ROLES = new Set([
  "owner",
  "admin", 
  "director",
]);

export function resolveUiRole(role: unknown, controlledText: boolean): UiRole {
  const normalized = normalizeRoomRole(role);
  if (normalized === "director") return "admin";
  if (controlledText) return "text_controller";
  return "audio_controller";
}

export function hasUiPermission(role: string | undefined, permission: UiPermission): boolean {
  if (!role) return false;
  
  // Directors and admins can do most things
  if (PRIVILEGED_ROLES.has(role)) {
    return true;
  }
  
  // Dubbers can only view presence
  if (permission === "presence_view" && role === "dubber") {
    return true;
  }
  
  return false;
}

export function canReceiveTextControl(role: unknown) {
  return normalizeRoomRole(role) !== "director";
}

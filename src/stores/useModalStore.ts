"use client";

import { create } from "zustand";

// App-wide confirm/alert popups (replaces window.confirm / window.alert).
// UI-only store: no Firestore listener, so no `subscribe`. Rendered by <AppModal />.

type ModalKind = "confirm" | "alert";

type ConfirmOptions = {
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Red confirm button, for deletes and other destructive actions. */
  danger?: boolean;
};

type AlertOptions = {
  title?: string;
  confirmLabel?: string;
};

type ModalState = {
  open: boolean;
  kind: ModalKind;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  danger: boolean;
  resolve: ((value: boolean) => void) | null;
  confirm: (message: string, options?: ConfirmOptions) => Promise<boolean>;
  alert: (message: string, options?: AlertOptions) => Promise<void>;
  resolveModal: (value: boolean) => void;
};

export const useModalStore = create<ModalState>((set, get) => ({
  open: false,
  kind: "alert",
  title: "",
  message: "",
  confirmLabel: "OK",
  cancelLabel: "Cancel",
  danger: false,
  resolve: null,

  confirm: (message, options = {}) =>
    new Promise<boolean>((resolve) => {
      // A popup already open (rare) is answered "no" so its caller doesn't hang.
      get().resolve?.(false);
      set({
        open: true,
        kind: "confirm",
        title: options.title ?? "",
        message,
        confirmLabel: options.confirmLabel ?? "Confirm",
        cancelLabel: options.cancelLabel ?? "Cancel",
        danger: options.danger ?? false,
        resolve,
      });
    }),

  alert: (message, options = {}) =>
    new Promise<void>((resolve) => {
      get().resolve?.(false);
      set({
        open: true,
        kind: "alert",
        title: options.title ?? "",
        message,
        confirmLabel: options.confirmLabel ?? "OK",
        cancelLabel: "",
        danger: false,
        resolve: () => resolve(),
      });
    }),

  resolveModal: (value) => {
    get().resolve?.(value);
    set({ open: false, resolve: null });
  },
}));

/** Styled replacement for window.confirm. Resolves true when confirmed. */
export function confirmDialog(message: string, options?: ConfirmOptions) {
  return useModalStore.getState().confirm(message, options);
}

/** Styled replacement for window.alert. Resolves when dismissed. */
export function alertDialog(message: string, options?: AlertOptions) {
  return useModalStore.getState().alert(message, options);
}

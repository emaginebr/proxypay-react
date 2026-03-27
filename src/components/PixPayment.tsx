import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useProxyPay } from "../hooks/useProxyPay";
import type {
  PixPaymentProps,
  QRCodeResponse,
  QRCodeStatusResponse,
} from "../types/payment";

type ModalState =
  | { step: "closed" }
  | { step: "loading" }
  | { step: "qrcode"; data: QRCodeResponse }
  | { step: "error"; error: Error };

const DEFAULT_POLL_INTERVAL = 10000;

export function PixPayment({
  customer,
  items,
  onSuccess,
  onError,
  onStatusChange,
  pollInterval = DEFAULT_POLL_INTERVAL,
  modalTitle = "Pagamento PIX",
  children,
  overlayClassName,
  modalClassName,
}: PixPaymentProps) {
  const { createQRCode, checkQRCodeStatus } = useProxyPay();
  const [state, setState] = useState<ModalState>({ step: "closed" });
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const expirationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimers = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    if (expirationRef.current) {
      clearInterval(expirationRef.current);
      expirationRef.current = null;
    }
  }, []);

  const closeModal = useCallback(() => {
    stopTimers();
    setState({ step: "closed" });
    setCopied(false);
    setTimeLeft(null);
  }, [stopTimers]);

  const handleOpen = useCallback(async () => {
    setState({ step: "loading" });
    try {
      const data = await createQRCode(customer, items);
      setState({ step: "qrcode", data });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setState({ step: "error", error });
      onError?.(error);
    }
  }, [createQRCode, customer, items, onError]);

  // Polling
  useEffect(() => {
    if (state.step !== "qrcode") return;

    const { invoiceId } = state.data;

    pollingRef.current = setInterval(async () => {
      try {
        const status = await checkQRCodeStatus(invoiceId);
        onStatusChange?.(status);

        if (status.paid) {
          stopTimers();
          onSuccess?.(status);
        } else if (
          status.statusText === "Expired" ||
          status.statusText === "Cancelled"
        ) {
          stopTimers();
          const error = new Error(
            `Pagamento ${status.statusText.toLowerCase()}`,
          );
          setState({ step: "error", error });
          onError?.(error);
        }
      } catch {
        // Retry silently on network errors
      }
    }, pollInterval);

    return stopTimers;
  }, [
    state.step,
    state.step === "qrcode" ? state.data.invoiceId : null,
    pollInterval,
    checkQRCodeStatus,
    onSuccess,
    onError,
    onStatusChange,
    stopTimers,
  ]);

  // Countdown
  useEffect(() => {
    if (state.step !== "qrcode" || !state.data.expiredAt) {
      setTimeLeft(null);
      return;
    }

    const expiry = new Date(state.data.expiredAt).getTime();

    const tick = () => {
      const diff = expiry - Date.now();
      if (diff <= 0) {
        setTimeLeft("Expirado");
        stopTimers();
        const error = new Error("QR Code expirado");
        setState({ step: "error", error });
        onError?.(error);
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${mins}:${secs.toString().padStart(2, "0")}`);
    };

    tick();
    expirationRef.current = setInterval(tick, 1000);

    return () => {
      if (expirationRef.current) {
        clearInterval(expirationRef.current);
        expirationRef.current = null;
      }
    };
  }, [
    state.step,
    state.step === "qrcode" ? state.data.expiredAt : null,
    stopTimers,
    onError,
  ]);

  const handleCopy = useCallback(async (brCode: string) => {
    try {
      await navigator.clipboard.writeText(brCode);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = brCode;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) closeModal();
    },
    [closeModal],
  );

  // Trigger button
  const trigger = (
    <div onClick={handleOpen} style={{ display: "inline-block" }}>
      {children}
    </div>
  );

  if (state.step === "closed") return trigger;

  // Modal
  const modal = createPortal(
    <div
      className={overlayClassName}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.5)",
        ...(!overlayClassName ? {} : undefined),
      }}
    >
      <div
        className={modalClassName}
        style={
          !modalClassName
            ? {
                background: "#fff",
                borderRadius: "12px",
                padding: "32px",
                maxWidth: "400px",
                width: "90%",
                position: "relative",
                textAlign: "center",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }
            : undefined
        }
      >
        {/* Close button */}
        <button
          onClick={closeModal}
          style={{
            position: "absolute",
            top: "12px",
            right: "16px",
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: "#6b7280",
            lineHeight: 1,
          }}
          aria-label="Fechar"
        >
          ✕
        </button>

        {/* Loading */}
        {state.step === "loading" && (
          <p style={{ padding: "40px 0", color: "#6b7280" }}>
            Gerando QR Code...
          </p>
        )}

        {/* Error */}
        {state.step === "error" && (
          <div>
            <p style={{ color: "#dc2626", marginBottom: "16px" }}>
              {state.error.message}
            </p>
            <button
              onClick={handleOpen}
              style={{
                background: "#3b82f6",
                color: "#fff",
                border: "none",
                padding: "10px 24px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* QR Code */}
        {state.step === "qrcode" && (
          <>
            <h2 style={{ margin: "0 0 20px", fontSize: "18px" }}>
              {modalTitle}
            </h2>

            <img
              src={state.data.brCodeBase64}
              alt="QR Code PIX"
              style={{
                width: "220px",
                height: "220px",
                borderRadius: "8px",
              }}
            />

            {timeLeft && (
              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                Expira em:{" "}
                <strong style={{ color: "#111827" }}>{timeLeft}</strong>
              </p>
            )}

            <p
              style={{
                margin: "16px 0 8px",
                fontSize: "13px",
                color: "#6b7280",
              }}
            >
              Ou copie o codigo PIX:
            </p>

            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                readOnly
                value={state.data.brCode}
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontFamily: "monospace",
                }}
              />
              <button
                onClick={() => handleCopy(state.data.brCode)}
                style={{
                  background: copied ? "#10b981" : "#3b82f6",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  whiteSpace: "nowrap",
                  transition: "background 0.2s",
                }}
              >
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>

            <p
              style={{
                margin: "20px 0 0",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              Aguardando pagamento...
            </p>
          </>
        )}
      </div>
    </div>,
    document.body,
  );

  return (
    <>
      {trigger}
      {modal}
    </>
  );
}

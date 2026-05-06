import QRCode from "react-qr-code";

export function QrInline({ value, caption }: { value: string; caption?: string }) {
  return (
    <figure style={{ margin: "var(--space-md) 0", textAlign: "center" }}>
      <div style={{ display: "inline-block", padding: "0.65rem", background: "#fff", borderRadius: "12px", border: "1px solid var(--color-border)" }}>
        <QRCode value={value} size={148} />
      </div>
      {caption ? (
        <figcaption style={{ marginTop: "0.35rem", fontSize: "0.82rem", color: "var(--color-ink-muted)" }}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}

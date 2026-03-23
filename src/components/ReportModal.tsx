import { useState } from "react";
import type { Report } from "../types";
import { getReports, saveReports } from "../lib/storage";
import { useAuth } from "../context/AuthContext";

export function ReportModal({
  open,
  onClose,
  targetType,
  targetId,
  threadId,
}: {
  open: boolean;
  onClose: () => void;
  targetType: Report["targetType"];
  targetId: string;
  threadId?: string;
}) {
  const { user } = useAuth();
  const [reason, setReason] = useState("");
  const [done, setDone] = useState(false);

  if (!open || !user) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    const r: Report = {
      id: crypto.randomUUID?.() ?? `r_${Date.now()}`,
      targetType,
      targetId,
      threadId,
      reason: reason.trim(),
      reporterId: user.id,
      reporterName: user.displayName,
      createdAt: new Date().toISOString(),
      status: "open",
    };
    saveReports([r, ...getReports()]);
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setReason("");
      onClose();
    }, 900);
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal surface"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="report-title">Report to moderators</h2>
        <p className="lede" style={{ fontSize: "0.95rem" }}>
          Your report is confidential. We review reports to keep this space safe. For emergencies,
          use the Resource Directory on the Support page.
        </p>
        {done ? (
          <p className="report-thanks">Thank you — our team will review this.</p>
        ) : (
          <form onSubmit={submit}>
            <div className="field">
              <label className="label" htmlFor="report-reason">
                What’s going on?
              </label>
              <select
                id="report-reason"
                className="select"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="">Choose a reason</option>
                <option value="harassment">Harassment or bullying</option>
                <option value="hate">Hate or discrimination</option>
                <option value="privacy">Privacy concern / oversharing someone else</option>
                <option value="self-harm">Self-harm or crisis content</option>
                <option value="spam">Spam or scams</option>
                <option value="other">Something else</option>
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Submit report
              </button>
            </div>
          </form>
        )}
      </div>
      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(45, 42, 50, 0.45);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: var(--space-md);
        }
        @media (min-width: 520px) {
          .modal-backdrop {
            align-items: center;
          }
        }
        .modal {
          width: 100%;
          max-width: 420px;
          padding: var(--space-lg);
        }
        .modal-actions {
          display: flex;
          gap: var(--space-sm);
          justify-content: flex-end;
          margin-top: var(--space-md);
        }
        .report-thanks {
          color: var(--color-success);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

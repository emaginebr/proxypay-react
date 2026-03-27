interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ width = "100%", height = "16px", borderRadius = "6px", style }: SkeletonProps) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius, ...style }}
    />
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i}><Skeleton width="70%" height="14px" /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c}><Skeleton width={c === 0 ? "40px" : "80%"} height="14px" /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonCards({ count = 4 }: { count?: number }) {
  return (
    <div className="dashboard-cards">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="dashboard-card">
          <Skeleton width="60%" height="12px" style={{ marginBottom: "12px" }} />
          <Skeleton width="80%" height="28px" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div className="admin-form">
      {Array.from({ length: 3 }).map((_, i) => (
        <label key={i}>
          <Skeleton width="100px" height="12px" style={{ marginBottom: "8px" }} />
          <Skeleton width="100%" height="40px" borderRadius="8px" />
        </label>
      ))}
      <div className="admin-form-actions">
        <Skeleton width="140px" height="40px" borderRadius="8px" />
      </div>
    </div>
  );
}

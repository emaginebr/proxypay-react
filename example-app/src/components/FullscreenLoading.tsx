export function FullscreenLoading({ message = "Processing payment..." }: { message?: string }) {
  return (
    <div className="fullscreen-loading">
      <div className="fullscreen-loading-content">
        <div className="fullscreen-loading-spinner" />
        <p>{message}</p>
      </div>
    </div>
  );
}

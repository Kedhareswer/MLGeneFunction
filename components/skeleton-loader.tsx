export function SkeletonLoader() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center space-y-4"
      aria-label="Loading sketch"
      role="status"
    >
      <div className="h-32 w-32 animate-pulse-light rounded-full bg-muted-foreground/20" />
      <div className="h-4 w-32 animate-pulse-light rounded bg-muted-foreground/20" />
      <div className="h-4 w-24 animate-pulse-light rounded bg-muted-foreground/20" />
      <span className="sr-only">Processing image, please wait...</span>
    </div>
  )
}

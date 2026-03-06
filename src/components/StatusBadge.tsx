interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    Active: "bg-success/10 text-success",
    Accepted: "bg-success/10 text-success",
    Minted: "bg-success/10 text-success",
    Verified: "bg-success/10 text-success",
    Pending: "bg-warning/10 text-warning",
    Draft: "bg-muted text-muted-foreground",
    Transferred: "bg-accent/10 text-accent",
    Rejected: "bg-destructive/10 text-destructive",
    Completed: "bg-accent/10 text-accent",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  );
}

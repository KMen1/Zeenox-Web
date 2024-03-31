type ContentCardProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  rightSection?: React.ReactNode;
  bg?: string;
};

export function ContentCard({
  title,
  icon,
  children,
  rightSection,
  bg,
}: ContentCardProps) {
  return (
    <div className="rounded-2xl border-2 px-4 pb-4">
      <div className="flex justify-between pb-3 pt-4">
        <div className="flex gap-2">
          {icon}
          <h2>{title}</h2>
        </div>
        {rightSection}
      </div>
      <div className={`rounded-2xl`} style={{ background: bg }}>
        {children}
      </div>
    </div>
  );
}

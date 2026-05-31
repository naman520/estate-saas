type PageHeaderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-950">
          {title}
        </h1>

        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-700">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
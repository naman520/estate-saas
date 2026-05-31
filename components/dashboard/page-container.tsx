type PageContainerProps = {
  children: React.ReactNode;
};

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
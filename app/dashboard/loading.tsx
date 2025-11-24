export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-center">
        <div className="h-80 w-full max-w-md bg-secondary animate-pulse rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-secondary animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="h-96 bg-secondary animate-pulse rounded-lg" />
      <div className="h-64 bg-secondary animate-pulse rounded-lg" />
    </div>
  )
}

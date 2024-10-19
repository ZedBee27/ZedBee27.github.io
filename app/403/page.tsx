// app/403/page.tsx or pages/403.tsx
export default function ForbiddenPage() {
  return (
        <div className="h-full flex flex-col items-center">
          <h1 className="text-xl sm:text-3xl font-bold pt-52">403 - Forbidden</h1>
          <p className="text-medium sm:text-xl font-semibold">You do not have permission to access this page.</p>
        </div>
    );
  }

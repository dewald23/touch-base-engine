import AuditForm from '@/components/AuditForm';

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-white">Touch Base Consulting</h1>
          <p className="text-emerald-400 font-medium">High-Performance Digital Infrastructure & Local SEO</p>
        </div>
        <AuditForm />
      </div>
    </main>
  );
}

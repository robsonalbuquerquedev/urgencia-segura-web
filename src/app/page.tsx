import UrgenciasList from './components/UrgenciasList';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#D5EAF7FF] p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-10 text-[#264D73FF]">
        Portal Urgência Segura
      </h1>
      <UrgenciasList />
    </main>
  );
}

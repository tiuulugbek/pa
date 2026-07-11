import { ProjectForm } from '@/components/ProjectForm';

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-text-dark">Loyihani tahrirlash</h1>
      <ProjectForm projectId={Number(id)} />
    </div>
  );
}

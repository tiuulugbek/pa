import { ProjectForm } from '@/components/ProjectForm';

export default function EditProjectPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-text-dark">Loyihani tahrirlash</h1>
      <ProjectForm projectId={Number(params.id)} />
    </div>
  );
}

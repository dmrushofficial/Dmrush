import { StudentAssignmentDetailClient } from "@/components/student/StudentAssignmentDetailClient";

type Props = { params: Promise<{ id: string }> };

export default async function StudentAssignmentDetailPage({ params }: Props) {
  const { id } = await params;
  return <StudentAssignmentDetailClient id={id} />;
}

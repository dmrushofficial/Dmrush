import { TeacherAssignmentReviewClient } from "@/components/teacher/TeacherAssignmentReviewClient";

type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <TeacherAssignmentReviewClient id={id} />;
}

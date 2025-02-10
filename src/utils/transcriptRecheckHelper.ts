import { CurriGroup } from '@/Interfaces';
import { SubjectTranscriptDto } from '@/Interfaces/transcript.interface';

export const formatDataForCreateTranscript = (
  selectedCurriGroup: CurriGroup,
  matchSubjects: SubjectTranscriptDto[],
  unmatchSubjects: SubjectTranscriptDto[],
) => {
  const allSubjects = [...matchSubjects, ...unmatchSubjects];
  const data = {
    info: {
      faculty: selectedCurriGroup.faculty.value,
      department: selectedCurriGroup.department.value,
      curriculum: selectedCurriGroup.curriculum.value,
      curriculumYear: selectedCurriGroup.curriculumYear.value,
    },
    subjects: allSubjects,
  };

  return data;
};

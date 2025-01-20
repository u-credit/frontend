// import { CustomSelectOutlined } from '@/components';
// import React, { useState } from 'react';

// export default function CategorySelectGroup() {
//     const [selectedCategory, setSelectedCategory] = useState<string>('');
//     const [selectedGroup, setSelectedGroup] = useState<string>('');
//     const [selectedSubGroup, setSelectedSubGroup] = useState<string>('');
//     const [selectedSubSubGroup, setSelectedSubSubGroup] = useState<string>('');


//   return (
//     <>
//       <CustomSelectOutlined
//         onSelectedValueChange={handleFacultyChange}
//         selectOptions={facultyOptions}
//         selectedValue={String(selectedFaculty)}
//         label="หมวดหมู่รายวิชา"
//       />
//       <CustomSelectOutlined
//         onSelectedValueChange={handleDepartmentChange}
//         selectOptions={departmentOptions}
//         selectedValue={String(selectedDepartment)}
//         label="หมวดหมู่ย่อย"
//         disabled={!selectedFaculty}
//       />
//       <CustomSelectOutlined
//         onSelectedValueChange={handleCurriculumChange}
//         selectOptions={curriculumOptions}
//         selectedValue={String(selectedCurriculum)}
//         label="กลุ่มวิชา"
//         disabled={!selectedDepartment}
//       />
//       <CustomSelectOutlined
//         onSelectedValueChange={handleCurriculumYearChange}
//         selectOptions={curriculumYearOptions}
//         selectedValue={String(selectedCurriculumYear)}
//         label="กลุ่มวิชาย่อย"
//         disabled={!selectedCurriculum}
//       />
//     </>
//   );
// }

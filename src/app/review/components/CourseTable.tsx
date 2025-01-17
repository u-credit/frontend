interface Section {
    sec: string;
    day: string;
    time: string;
    room: string;
    teacher_name: string;
  }
  
  interface CourseData {
    sections: Section[];
    midtermExam: string;
    finalExam: string;
  }
  
  interface CourseTableProps {
    courseData: CourseData;
  }
  
  const CourseTable: React.FC<CourseTableProps> = ({ courseData }) => {
    const columns = [
      'sec',
      'วันเวลา',
      'อาคารเรียน',
      'ผู้สอน',
      'สอบกลางภาค',
      'สอบปลายภาค',
    ];
  
    return (
      <div
        id="CourseTable"
        className="table w-full border-[1px] border-gray-200 rounded-[8px] relative mt-4 overflow-visible py-2"
      >
        <div className="table-header-group border-collapse divide-x divide-gray-200 overflow-x-scroll -translate-y-[20px]">
          <div className="table-row text-center">
            {columns.map((column, index) => (
              <div key={index} className="table-cell text-center">
                <span className="bg-white px-2 group-hover:bg-gray-50">
                  {column}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="table-row-group -translate-y-[8px]">
          {courseData.sections.map((section, index) => (
            <div key={index} className="table-row text-center">
              <div className="table-cell border-r border-gray-200">
                {section.sec}
              </div>
              <div className="table-cell border-r border-gray-200">
                <div className="flex items-center">
                  <span className="basis-1/3 -mr-2.5">{section.day}</span>
                  <span className="basis-2/3">{section.time}</span>
                </div>
              </div>
  
              <div className="table-cell border-r border-gray-200">
                {section.room}
              </div>
              <div className="table-cell border-r border-gray-200">
                {section.teacher_name}
              </div>
              {index === 0 && (
                <>
                  <div className="table-cell border-r border-gray-200">
                    {courseData.midtermExam}
                  </div>
                  <div className="table-cell">{courseData.finalExam}</div>
                </>
              )} 
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default CourseTable;
  
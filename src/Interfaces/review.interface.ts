interface Review {
  [x: string]: Key | null | undefined;
  id: string;
  subjectId: string;
  rating: number;
  year: number;
  semester: number;
  teacherName: string;
  reviewText: string;
  createdAt: string;
}
'use client';

import React, { useState, useEffect, useRef, Key } from 'react';
import axios from 'axios';
import { Button, CircularProgress } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';

import ReviewCard from './components/ReviewCard';
import { BookmarkModal } from '../course/components';
import CourseTable from './components/CourseTable';
import ReviewForm from './components/ReviewForm';
import RatingButtons from './components/RatingButtons';
import CustomSelect from '@/components/CustomSelect';

import { SelectOption } from '@/types';

// Mock data
const courseData = {
  subjectId: '01076011',
  subject_name: 'OPERATING SYSTEMS',
  courseType: 'วิชาเฉพาะ-แกนวิศวะฯ',
  description:
    'โครงสร้างและการจัดการของระบบปฏิบัติการ การควบคุม การสื่อสารและการประสานงานของโพรเซสที่ร่วมงาน โพรเซสเซอร์ และ การจัดตารางงาน โครงสร้างหน่วยความจำและการจัดการ รวมถึง เพจจิ้ง เซ็กเมนเตชันและหน่วยความจำเสมือน การบริหารทรัพยากร การป้องกัน การตรวจจับและการกู้คืนล็อคตาย     แนวคิดและโครงสร้างของระบบไฟล์ การป้องกันและความมั่นคง การประมวลผลแบบกระจาย การทำงานแบบเสมือนและการประมวลผลแบบคราวด์ แนวคิดและโครงสร้างของระบบไฟลแนวคิดและการประมวลผลแบบคราวด์ Organization and structure of operating systems. Control, communication and synchronization of concurrent processes. Processor and job scheduling. Memory organization and management including paging, segmentation, and virtual memory. Resource management. Deadlock avoidance, detection, recovery. File system concepts and structure. Protection and security. Distributed processing. Virtualization and cloud computing.',
  sections: [
    {
      sec: '18',
      day: 'อ.',
      time: '13:00-15:00',
      room: 'ECC-801',
      teacherName: 'ผศ. วินพงศ์ เกษมศิริ',
    },
    {
      sec: '19',
      day: 'พ.',
      time: '09:00-12:00',
      room: 'ECC-801',
      teacherName: 'ผศ. วินพงศ์ เกษมศิริ',
    },
    {
      sec: '20',
      day: 'พฤ.',
      time: '13:00-15:00',
      room: 'ECC-801',
      teacherName: 'ผศ. วินพงศ์ เกษมศิริ',
    },
  ],
  midtermExam: 'ศุกร์ 11 มี.ค. 2022 13:30 - 16:30',
  finalExam: 'ศุกร์ 20 พ.ค. 2022 13:30 - 16:30',
};

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

const API_BASE_URL = 'http://localhost:3000/api/reviews';

export default function Review() {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedTeacherName, setSelectedTeacherName] = useState<string>('');
  const [reviewText, setReviewText] = useState('');
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [subjectId, setSubjectId] = useState<string>('01076011');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [openBookmarkModal, setOpenBookmarkModal] = useState(false);
  const [isToggled, setIsToggled] = useState(false);

  const handleOpen = () => setOpenBookmarkModal(true);
  const handleClose = () => setOpenBookmarkModal(false);

  const [selectedValue, setSelectedValue] = useState<string>('');

  const handleButtonClick = () => {
    setIsToggled(!isToggled);
  };

  const fetchReviews = async () => {
    setIsLoading(true); 

    try {
      const response = await axios.get(`${API_BASE_URL}/${subjectId}`);
      if (response.data && response.data.data) {
        setReviews(response.data.data); 
        setError(null);
      } else {
        setReviews([]);
        setError('ไม่มีรีวิว');
      }
    } catch (err) {
      setError('ไม่สามารถโหลดรีวิวได้');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchAverageRating();
  }, [subjectId]);

  const fetchAverageRating = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${subjectId}/average`);
      setAverageRating(response.data.averageRating || 0);
      setError(null);
    } catch (err) {
      setError('ไม่สามารถโหลดคะแนนเฉลี่ยได้');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedYear || !selectedTeacherName || rating === 0) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }
  
    const [semester, year] = selectedYear.split('/').map(Number);
    console.log('Semester:', semester, 'Year:', year);
  
    const review = {
      subjectId: '01076011',
      rating: selectedRating,
      year: year,
      semester: semester, 
      teacherName: selectedTeacherName,
      reviewText: reviewText,
      ownerId: 'ca112387-c9f2-11ef-9b06-0242ac12000',
    };
  
    try {
      await axios.post('http://localhost:3000/api/reviews', review);
      fetchReviews();
    } catch (err) {
      console.error('Error:', err);
    }
  };  

  const mockSelectOptions: SelectOption[] = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
  ];

  const handleSelectValueChange = (value: string) => {
    setSelectedValue(value);
  };

  const filteredReviews = selectedRating
    ? reviews.filter((r) => r.rating === selectedRating)
    : reviews;

  return (
    <div className="bg-white font-bai-jamjuree">
      <div className="max-w-8xl mx-auto p-6">
        <div className="flex justify-between items-center pb-3 w-full">
          <Button
            variant="text"
            startIcon={<ArrowBackIosIcon />}
            sx={{ color: 'black', fontSize: '18px' }}
          >
            กลับ
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ minWidth: '115px' }}
            onClick={handleOpen}
          >
            วิชาที่บันทึกไว้
          </Button>
          <BookmarkModal open={openBookmarkModal} onClose={handleClose} />
        </div>
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-rubik font-semibold mt-2">
              {courseData.subjectId} {courseData.subject_name}
              <span className="inline-block border border-primary-500 text-primary-500 font-bai-jamjuree rounded-full px-3 py-1 text-sm font-normal ml-4">
                {courseData.courseType}
              </span>
            </h1>

            <div className="flex items-center space-x-2">
              <CustomSelect
                onSelectedValueChange={handleSelectValueChange}
                selectOptions={mockSelectOptions}
                selectedValue={selectedValue}
              />

              <Button
                variant={isToggled ? 'outlined' : 'contained'}
                startIcon={isToggled ? <CheckIcon /> : <AddIcon />}
                sx={{
                  minWidth: '98px',
                  backgroundColor: isToggled ? 'white' : 'primary.main',
                  borderColor: isToggled ? 'primary.main' : 'transparent',
                  color: isToggled ? 'primary.main' : 'white',
                  '&:hover': {
                    backgroundColor: isToggled ? '#f5f5f5' : 'primary.dark',
                    borderColor: 'primary.main',
                  },
                }}
                onClick={handleButtonClick}
              >
                บันทึก
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-medium font-mitr mb-2">
              คำอธิบายรายวิชา
            </h2>
            <p
              ref={descriptionRef}
              className="text-black border rounded-sm p-4 font-normal text-lg bg-gray-100"
            >
              {courseData.description}
            </p>
          </div>
          <div className="mb-6 rounded-md overflow-hidden">
            <CourseTable courseData={courseData} />
          </div>
        </div>

        <div>
          <h2
            className="text-xl font-medium font-mitr mb-2 mt-10"
            style={{ fontFamily: 'Mitr, sans-serif !important' }}
          >
            เขียนรีวิว
            <span className="text-base font-normal font-bai-jamjuree text-primary-400 ml-5 bai-jamjuree-font">
              * การรีวิวนี้จะเป็นแบบไม่ระบุตัวตน
            </span>
          </h2>
          <ReviewForm
            rating={rating}
            selectedYear={selectedYear || ''}
            selectedTeacherName={selectedTeacherName || ''}
            reviewText={reviewText}
            setRating={setRating}
            setSelectedYear={setSelectedYear}
            setSelectedTeacherName={setSelectedTeacherName}
            setReviewText={setReviewText}
            handleSubmit={handleSubmit}
          />
        </div>

        <hr className="mt-6 mb-12" />

        <div className="mb-6 mt-2">
          <h2 className="text-lg font-mitr font-medium ">รีวิวจากคนอื่น ๆ </h2>
          <div className="flex items-center -mt-5 relative">
            <RatingButtons
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
            />
            <span className="text-6xl font-semibold ml-auto rounded-lg p-7 mb-5 bg-primary-100 text-primary-400">
              {typeof averageRating === 'number'
                ? averageRating.toFixed(1)
                : '0.0'}{' '}
              <span className="text-base font-normal text-black -ml-2">/5</span>
            </span>
          </div>
          {isLoading ? (
            <div className="text-center mt-4">
              <CircularProgress color="primary" />
              <p className="text-gray-500 mt-2">กำลังโหลดรีวิว...</p>
            </div>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard
                key={review.review_id}
                rating={review.rating}
                year={review.year}
                semester={review.semester}
                teacherName={review.teacherName || ':D'}
                reviewText={review.reviewText || 'บลาๆๆ'}
                date={review.createdAt}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 mt-4">
              ยังไม่มีรีวิวในขณะนี้
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

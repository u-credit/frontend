import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Container, CircularProgress } from '@mui/material';
import { setSemester, setYear } from '@/features/selectorValueSlice';
import { SemesterSettingCard } from './SemesterSettingCard';
import { ChangeSemesterModal } from './ChangeSemesterModal';
import CustomAlert from '@/components/CustomAlert';
import { SemesterSetting } from '@/Interfaces/semester-settings.interface';

interface YearRange {
  maxSemester: number;
  minSemester: number;
  minYear: number;
  maxYear: number;
  min: number;
  max: number;
}

export default function SemesterSettings() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [setting, setSetting] = useState<SemesterSetting | null>(null);
  const [yearRange, setYearRange] = useState<YearRange>({
    min: 0,
    max: 0,
    minYear: 0,
    maxYear: 0,
    minSemester: 0,
    maxSemester: 0,
  });
  const [addModal, setAddModal] = useState(false);
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const dispatch = useDispatch();

  const fetchYearRange = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/semester-settings/year-range`,
      );
      if (!response.ok) throw new Error('Failed to fetch year range');

      const { data } = await response.json();
      setYearRange({
        minYear: data.min,
        maxYear: data.max,
        minSemester: data.minSemester,
        maxSemester: data.maxSemester,
        min: data.min,
        max: data.max,
      });
    } catch (error) {
      console.error('Error fetching year range:', error);
      setAlert({
        open: true,
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูลช่วงปีการศึกษา',
        severity: 'error',
      });
    }
  };

  const fetchSetting = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/semester-settings`,
      );
      if (!response.ok) throw new Error('Network response was not ok');

      const { data } = await response.json();
      if (data?.[0]) {
        setSetting(data[0]);
        dispatch(setSemester(String(data[0].semester)));
        dispatch(setYear(String(data[0].year)));
      } else {
        setSetting(null);
        dispatch(setSemester('1'));
        dispatch(setYear(new Date().getFullYear().toString()));
      }
    } catch (error) {
      console.error('Error fetching setting:', error);
      setError(true);
      setSetting(null);
      dispatch(setSemester('1'));
      dispatch(setYear(new Date().getFullYear().toString()));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSetting();
    fetchYearRange();
  }, []);

  const handleAddSetting = async (year: number, semester: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/semester-settings`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ year, semester }),
        },
      );
      if (!response.ok) throw new Error('Failed to add setting');

      setAlert({
        open: true,
        message: 'เปลี่ยนภาคการศึกษาสำเร็จ',
        severity: 'success',
      });
      setAddModal(false);
      await fetchSetting();
    } catch (error) {
      console.error('Error adding setting:', error);
      setAlert({
        open: true,
        message: 'เกิดข้อผิดพลาดในการเปลี่ยนภาคการศึกษา',
        severity: 'error',
      });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ pt: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ pt: 4 }}>
      <SemesterSettingCard
        setting={setting}
        onChangeSemester={() => setAddModal(true)}
      />

      <ChangeSemesterModal
        open={addModal}
        onClose={() => setAddModal(false)}
        onSubmit={handleAddSetting}
        yearRange={yearRange}
      />

      <CustomAlert />
    </Container>
  );
}

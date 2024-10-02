import {
    ListSubjectQueryParams,
    PageDto,
    ResponseDto,
    SubjectDto,
  } from '@/Interfaces';
  
  export const fetchListFaculty = async (
    params: ListSubjectQueryParams,
  ): Promise<ResponseDto<PageDto<SubjectDto>>> => {
    const queryParams = new URLSearchParams();
  
    Object.keys(params).forEach((key) => {
      const value = params[key as keyof ListSubjectQueryParams];
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    const res = await fetch(
      `http://localhost:3000/subjects?${queryParams.toString()}`,
      {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  
    return res.json();
  };
  
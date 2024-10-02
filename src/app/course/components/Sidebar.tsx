import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { Checkbox, Divider, FormControlLabel, FormGroup } from '@mui/material';
import { green, pink } from '@mui/material/colors';
import { useState } from 'react';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import CustomSelect from './CustomSelect';
import CustomSelectOutlined from './CustomSelectOutlined';
export default function Sidebar() {
  const [day, setDay] = useState<string[]>([]);
  const [state, setState] = useState({
    gilad: true,
    jason: false,
    antoine: false,
  });
  const handleChange = (event: { target: { name: any; checked: any } }) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const { gilad, jason, antoine } = state;
  return (
    <div className="w-full flex flex-col gap-y-4 p-4 overflow-y-auto ">
      <div className="flex items-center font-semibold	text-primary-400 space-x-2">
        <FilterAltOutlinedIcon color="primary" />
        <span>ค้นหาแบบละเอียด</span>
      </div>

      <FormGroup className="flex flex-col border-solid border-b-[1px] gap-2 pb-3">
        <span className="font-semibold">หมวดหมู่วิชา</span>
        <FormControlLabel
          control={
            <Checkbox
              checked={gilad}
              onChange={handleChange}
              name="gilad"
              sx={{
                padding: 0,
                color: 'grey.300',
                marginRight: '16px',
              }}
            />
          }
          label="Gilad Gray"
          sx={{ margin: 0 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={jason}
              onChange={handleChange}
              name="jason"
              sx={{
                padding: 0,
                color: 'grey.300',
                marginRight: '16px',
              }}
            />
          }
          label="Jason Killian"
          sx={{ margin: 0 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={antoine}
              onChange={handleChange}
              name="antoine"
              sx={{ padding: 0, color: 'grey.300', marginRight: '16px' }}
            />
          }
          label="Antoine Llorca"
          sx={{ margin: 0 }}
        />
      </FormGroup>

      <FormGroup className="gap-y-2 border-solid border-b-[1px] pb-3">
        <span className="font-semibold">หลักสูตร/ชั้นปี</span>
        <CustomSelectOutlined
          onSelectedValueChange={function (value: string): void {
            throw new Error('Function not implemented.');
          }}
          selectOptions={[]}
          selectedValue={''}
          label="คณะ"
        />
        <div className="flex flex-col border-[1px] rounded-lg p-3 gap-y-2 border-gray-300">
          <CustomSelectOutlined
            onSelectedValueChange={function (value: string): void {
              throw new Error('Function not implemented.');
            }}
            selectOptions={[]}
            selectedValue={''}
            label="ภาควิชา"
            disabled={true}
          />

          <CustomSelectOutlined
            onSelectedValueChange={function (value: string): void {
              throw new Error('Function not implemented.');
            }}
            selectOptions={[]}
            selectedValue={''}
            label="หลักสูตร"
            disabled={true}
          />
        </div>
        <CustomSelectOutlined
          onSelectedValueChange={function (value: string): void {
            throw new Error('Function not implemented.');
          }}
          selectOptions={[]}
          selectedValue={''}
          label="ชั้นปี"
        />
      </FormGroup>
      <FormGroup className="gap-y-2 border-solid border-b-[1px] pb-3">
        <div className="flex flex-row justify-between items-end">
          <span className="font-semibold">วันที่เรียน</span>
          <span className="text-sm">เลือกทั้งหมด</span>
        </div>

        <FormControlLabel
          control={
            <Checkbox
              checked={antoine}
              onChange={handleChange}
              name="antoine"
              sx={{ padding: 0, color: 'grey.300', marginRight: '16px' }}
            />
          }
          label="Antoine Llorca"
          sx={{ margin: 0 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={antoine}
              onChange={handleChange}
              name="antoine"
              sx={{ padding: 0, color: 'grey.300', marginRight: '16px' }}
            />
          }
          label="Antoine Llorca"
          sx={{ margin: 0 }}
        />
      </FormGroup>
      <FormGroup className="gap-y-2 border-solid border-b-[1px] pb-3">
        <span className="font-semibold">ช่วงเวลาที่เรียน</span>

        <FormControlLabel
          control={
            <Checkbox
              checked={antoine}
              onChange={handleChange}
              name="antoine"
              sx={{ padding: 0, color: 'grey.300', marginRight: '16px' }}
            />
          }
          label="Antoine Llorca"
          sx={{ margin: 0 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={antoine}
              onChange={handleChange}
              name="antoine"
              sx={{ padding: 0, color: 'grey.300', marginRight: '16px' }}
            />
          }
          label="Antoine Llorca"
          sx={{ margin: 0 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={antoine}
              onChange={handleChange}
              name="antoine"
              sx={{ padding: 0, color: 'grey.300', marginRight: '16px' }}
            />
          }
          label="Antoine Llorca"
          sx={{ margin: 0 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={antoine}
              onChange={handleChange}
              name="antoine"
              sx={{ padding: 0, color: 'grey.300', marginRight: '16px' }}
            />
          }
          label="Antoine Llorca"
          sx={{ margin: 0 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={antoine}
              onChange={handleChange}
              name="antoine"
              sx={{ padding: 0, color: 'grey.300', marginRight: '16px' }}
            />
          }
          label="Antoine Llorca"
          sx={{ margin: 0 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={antoine}
              onChange={handleChange}
              name="antoine"
              sx={{ padding: 0, color: 'grey.300', marginRight: '16px' }}
            />
          }
          label="Antoine Llorca"
          sx={{ margin: 0 }}
        />
      </FormGroup>
    </div>
  );
}

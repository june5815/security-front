import { Option } from './adminNotice.types';
import { ResidentDto } from '@/lib/types';

export const AdminResidentCOLUMNS: {
  key: (keyof ResidentDto) | 'note' | 'isRegistered';
  title: string;
  width: string;
}[] = [
  { key: 'id', title: 'NO.', width: '100px' },
  { key: 'building', title: '동', width: '' },
  { key: 'unit', title: '호', width: '' },
  { key: 'name', title: '이름', width: '' },
  { key: 'contact', title: '연락처', width: '' },
  { key: 'isHouseholder', title: '거주', width: '' },
  { key: 'isRegistered', title: '위리브 가입', width: '' },
  { key: 'note', title: '비고', width: '100px' },
];

export const RESIDENCE_OPTIONS: Option[] = [
  { value: 'true', label: '세대주' },
  { value: 'false', label: '세대원' },
];
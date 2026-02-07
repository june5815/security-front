import { ResidentCreateRequest, ResidentDto, ResidentUpdateRequest } from '@/lib/types';

export interface DeleteModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onDelete: () => void;
}

export interface Option {
  value: string;
  label: string;
}

export interface ResidentModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (formData: ResidentCreateRequest) => Promise<void>;
}

export interface EditResidentModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (formData: ResidentUpdateRequest) => Promise<void>;
  resident?: ResidentDto;
}

export interface AdminButtonProps {
  title: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export interface AdminResidentTable {
  data: ResidentDto[];
  startingIndex: number;
  COLUMNS: { key: (keyof ResidentDto) | 'note' | 'isRegistered'; title: string; width: string }[];
  editClick: (row: ResidentDto) => void;
  deleteClick: (row: ResidentDto) => void;
  loading: boolean;
}
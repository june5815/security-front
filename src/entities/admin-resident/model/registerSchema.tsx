import { z } from 'zod';

export const registerSchema = z.object({
  apartmentId: z.string(),
  building: z.coerce.number().min(1, '동을 입력해주세요.'),
  unit: z.coerce.number().min(1, '호를 입력해주세요.'),
  name: z.string().min(1, '이름을 입력해주세요.'),
  contact: z.string().regex(/^010\d{8}$/, '연락처 형식이 올바르지 않습니다.'),
  isHouseholder: z.preprocess((val) => val === 'true' || val === true, z.boolean()),
  email: z.string().email('이메일 형식이 올바르지 않습니다.'),
});

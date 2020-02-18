/* tslint:disable */
import { LocalTime } from './local-time';
export interface DoctorSessionInfoDTO {
  fromDate?: string;
  fromTime?: LocalTime;
  id?: number;
  toDate?: string;
  toTime?: LocalTime;
  weekday?: number;
}

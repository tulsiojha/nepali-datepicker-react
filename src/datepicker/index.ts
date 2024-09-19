import '../css/index.scss';
import NepaliDatePicker from './nepali-date-picker';

export { toAD, toBS, NepaliDate } from '../utils/nepali-date';

export type {
  INepaliDatePicker,
  IComponents,
  IDatePickerType,
  ILang,
  ISuffixRender,
} from './nepali-date-picker';

export default NepaliDatePicker;

import Immutable from "immutable";
import {createAtom} from "js-atom";
import moment from "moment";

export default createAtom(Immutable.Map({
  month: moment().month(),
  party: 2,
  selectedDate: moment().format("YYYY-MM-DD"),
  selectedTime: null,
  step: 1,
  time: null,
  width: 0,
  year: moment().year()
}));

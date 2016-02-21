import Immutable from "immutable";
import {createAtom} from "js-atom";
import moment from "moment";

export default createAtom(Immutable.Map({
  email: "",
  message: "",
  month: moment().month(),
  name: "",
  open: false,
  party: 2,
  phone: "",
  selectedDate: moment().format("YYYY-MM-DD"),
  selectedTime: null,
  step: 0,
  time: null,
  width: 0,
  year: moment().year()
}));

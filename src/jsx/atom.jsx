import Immutable from "immutable";
import {createAtom} from "js-atom";
import moment from "moment";

export function getDefaultValues() {
  return Immutable.Map({
    booked: false,
    bookingSuccess: true,
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
    width: 500,
    year: moment().year()
  })
};

export const atom = createAtom(getDefaultValues());

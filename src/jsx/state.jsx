import {createAtom} from "js-atom";
import Immutable from "immutable";

export default createAtom(Immutable.Map({
  step: 0,
  width: 0
}));

import { withPrefix } from 'gatsby-link';
import { getLanguageForNavigator } from '../utils/language';

let Comp;
if (process.env.NODE_ENV === 'production') {
  if (global.location) global.location.replace(withPrefix(getLanguageForNavigator()));
  Comp = () => null;
} else {
  Comp = props => {
    props.history.replace(withPrefix(getLanguageForNavigator()));
    // global.location.replace(withPrefix(getLanguageForNavigator()));
    return null;
  };
}

export default Comp;

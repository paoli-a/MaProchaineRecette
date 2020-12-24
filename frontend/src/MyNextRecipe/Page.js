import { useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Changes document title
 *
 * @component
 */
const Page = ({ title, children }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return children;
};

Page.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Page;

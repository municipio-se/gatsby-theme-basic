import PropTypes from "prop-types";
import React from "react";

DefaultPostsModule.propTypes = {
  module: PropTypes.shape({
    modPostsDataDisplay: PropTypes.shape({ postsDisplayAs: PropTypes.string }),
  }),
};

export default function DefaultPostsModule({ module }) {
  if (process.env.NODE_ENV === "production") {
    return null;
  }
  return (
    <details>
      <summary>
        <code>{`Unimplemented display mode for posts module: "${module?.modPostsDataDisplay?.postsDisplayAs}"`}</code>
      </summary>
      <pre>
        <code>{JSON.stringify(module, null, 2)}</code>
      </pre>
    </details>
  );
}

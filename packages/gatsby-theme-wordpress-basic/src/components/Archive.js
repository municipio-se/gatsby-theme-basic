import { H, Section } from "@jfrk/react-heading-levels";
import {
  LazyMinisearchSearchBackendProvider,
  SearchContextDebug,
  SearchForm,
  SearchResults,
  URLSearchParamsProvider,
  SearchPagination,
} from "@whitespace/gatsby-plugin-search";
import clsx from "clsx";
import PropTypes from "prop-types";
import React from "react";

import {
  getMainArchivePageTitleFromPageContext,
  // getMainArchivePageLabelFromPageContext,
  // getMainArchivePagePathFromPageContext,
  getArchiveURLPatternFromPageContext,
} from "../contentType";
import { useArchiveParamTypes, usePageContext } from "../hooks";

import * as defaultStyles from "./Archive.module.css";

Archive.propTypes = {
  styles: PropTypes.objectOf(PropTypes.string),
  className: PropTypes.string,
};

export default function Archive({
  styles = defaultStyles,
  className,
  ...restProps
}) {
  const paramTypes = useArchiveParamTypes();
  let pageContext = usePageContext();
  return (
    <article className={clsx(styles.component, className)} {...restProps}>
      <div className="o-grid">
        <div className="o-grid-row">
          <div className="o-grid-block o-grid-block--inherit">
            <H className="c-article__title">
              {getMainArchivePageTitleFromPageContext(pageContext)}
            </H>
            <Section>
              <URLSearchParamsProvider
                urlPattern={getArchiveURLPatternFromPageContext(pageContext)}
                forcedParams={{
                  contentType: "post",
                  sort: "publishDate:desc",
                }}
                paramTypes={paramTypes}
                decodeParams={({ year, month, ...params }) => ({
                  ...params,
                  date: month ? `${year}-${month}` : year,
                })}
                encodeParams={({ date, ...params }) => ({
                  ...params,
                  ...(/^\d{4}$/.test(date) && { year: date }),
                  ...(/^\d{4}-\d{2}$/.test(date) && {
                    year: date.substring(0, 4),
                    month: date.substring(5, 7),
                  }),
                })}
              >
                <LazyMinisearchSearchBackendProvider
                  preload={true}
                  settings={{
                    attributesForFaceting: ["contentType", "tags", "month"],
                  }}
                  transformParams={({ date, ...params }) => ({
                    ...params,
                    ...(/^\d{4}$/.test(date) && {
                      month: [
                        "01",
                        "02",
                        "03",
                        "04",
                        "05",
                        "06",
                        "07",
                        "08",
                        "09",
                        "10",
                        "11",
                        "12",
                      ].map((m) => `${date}-${m}`),
                    }),
                    ...(/^\d{4}-\d{2}$/.test(date) && { month: [date] }),
                  })}
                >
                  <SearchForm />
                  {process.env.NODE_ENV !== "production" && (
                    <details>
                      <summary>Debug</summary>
                      <SearchContextDebug />
                    </details>
                  )}
                  <SearchResults />
                  <SearchPagination />
                </LazyMinisearchSearchBackendProvider>
              </URLSearchParamsProvider>
            </Section>
          </div>
        </div>
      </div>
    </article>
  );
}

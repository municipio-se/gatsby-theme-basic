import { HTML } from "@whitespace/gatsby-theme-wordpress-basic/src/components";
import { getMainArchivePagePathFromPageContext } from "@whitespace/gatsby-theme-wordpress-basic/src/contentType";
import { useHTMLProcessor } from "@whitespace/gatsby-theme-wordpress-basic/src/hooks/html-processor";
import { PostsModule as WsuiPostsModule } from "@wsui/municipio";
import React, { useContext } from "react";

// import PostsModuleFilterProvider from "../../../components/modularity-modules/PostsModuleFilterProvider";
import useTaxonomies from "../../../hooks/useTaxonomies";
import modularityModuleContext from "../../../modularityModuleContext";
import getMostRelevantDate from "../../../utils/getMostRelevantDate";

const excerpted = (text) => {
  return text.length > 153 ? text.slice(0, 150) + "…" : text;
};

function defaultNormalizePostsModuleItems(
  { modPostsDataSource, contentNodes },
  { HTML, stripHTML } = {},
) {
  if (!modPostsDataSource?.postsDataSource) {
    return [];
  }

  switch (modPostsDataSource.postsDataSource) {
    case "input":
      return (modPostsDataSource.data || []).map(
        ({ postContentMedia, postContentModularityModules, ...item }) => {
          let permalink = "/" + item?.permalink?.split("/").slice(3).join("/");
          let processedContent = (
            <HTML
              contentMedia={postContentMedia}
              contentModularityModules={postContentModularityModules}
            >
              {item.postContent}
            </HTML>
          );

          return {
            ...item,
            title: item.postTitle,
            link: item?.link,
            url: permalink,
            description: stripHTML(item.postContent),
            content: processedContent,
          };
        },
      );

    default: {
      let itemsArr = contentNodes?.nodes || [];
      let itemsToSlice =
        modPostsDataSource.postsCount >= 0
          ? modPostsDataSource.postsCount
          : itemsArr.length;

      let items = itemsArr
        .filter(Boolean)
        .slice(0, itemsToSlice)
        .map(({ contentMedia, ...item }) => {
          let processedContent = (
            <HTML contentMedia={contentMedia}>{item.content}</HTML>
          );

          let excerpt = excerpted(stripHTML(item.content));
          const splitContent = item.content?.split("<!--more-->");
          if (splitContent?.[1]) {
            // Use everything above Read more tag as excerpt/preamble
            excerpt = stripHTML(splitContent[0]);
          }

          return {
            ...item,
            contentType: item.contentType?.node?.name,
            title: item.title,
            dateGmt: item.dateGmt,
            date:
              (item.archiveDatesGmt &&
                getMostRelevantDate(item.archiveDatesGmt)) ||
              item.dateGmt,
            url: item.uri,
            description: item.description ? item.description : excerpt,
            image: item.featuredImage?.node,
            content: processedContent,
            taxonomies: useTaxonomies(
              { ...item.tags?.nodes, ...item.categories?.nodes },
              item.contentType?.node?.name,
            ),
          };
        });

      return items;
    }
  }
}

// const normalizeHit =
//   ({ HTML, stripHTML }) =>
//   (item) => {
//     return {
//       ...item,
//       title: item.label,
//       excerpt: item.text,
//       content: item.text,
//     };
//   };

export default function PostsModule({
  title,
  module = {},
  normalizePostsModuleItems = defaultNormalizePostsModuleItems,
  ...restProps
}) {
  // let isFilteringEnabled =
  //   !!module?.modPostsDataFiltering?.frontEndTaxFiltering &&
  //   module?.modPostsDataSource?.postsDataSource === "posttype";
  let displayMode = module?.modPostsDataDisplay?.postsDisplayAs;

  let visibleFields =
    displayMode === "expandable-list"
      ? ["title", "description"]
      : module?.modPostsDataSource.postsDataSource !== "input" &&
        module?.modPostsDataDisplay?.postsFields
      ? ["title", ...module.modPostsDataDisplay.postsFields].map((field) =>
          field === "excerpt" ? "description" : field,
        )
      : ["image", "title", "description"];

  const archiveLinkLabel = module.modPostsDataSource?.customArchiveLink?.url
    ? module.modPostsDataSource?.customArchiveLink?.title
    : module.modPostsDataSource?.postsDataPostType?.labels?.allItems;

  const archiveLinkUri = module.modPostsDataSource?.customArchiveLink?.url
    ? module.modPostsDataSource?.customArchiveLink?.url
    : module.modPostsDataSource?.postsDataPostType &&
      getMainArchivePagePathFromPageContext({
        contentType: module.modPostsDataSource?.postsDataPostType,
      });
  const showArchiveLink =
    module.modPostsDataSource?.archiveLink &&
    (module.modPostsDataSource?.customArchiveLink?.url ||
      module.modPostsDataSource?.postsDataPostType?.hasArchive) &&
    archiveLinkUri &&
    archiveLinkLabel;

  const itemColor = module?.modPostsDataDisplay?.theme || undefined;

  const { stripHTML } = useHTMLProcessor();

  const items = normalizePostsModuleItems(module, {
    HTML,
    stripHTML,
  });

  const { headingVariant } = useContext(modularityModuleContext);

  // if (isFilteringEnabled) {
  //   return (
  //     <PostsModuleFilterProvider>
  //       {({ hits }) => (
  //         <WsuiPostsModule
  //           items={(hits || []).map(normalizeHit({ HTML, stripHTML }))}
  //           {...restProps}
  //         />
  //       )}
  //     </PostsModuleFilterProvider>
  //   );
  // }

  return (
    <WsuiPostsModule
      title={title}
      items={items}
      itemColor={itemColor}
      visibleFields={visibleFields}
      displayMode={displayMode}
      headingVariant={headingVariant}
      archiveLink={
        !!showArchiveLink && {
          label: archiveLinkLabel,
          uri: archiveLinkUri,
        }
      }
      {...restProps}
    />
  );
}

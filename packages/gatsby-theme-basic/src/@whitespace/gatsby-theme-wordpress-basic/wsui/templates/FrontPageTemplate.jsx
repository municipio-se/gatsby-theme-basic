/** @jsx jsx */
import { css, jsx, useTheme } from "@emotion/react";
import { usePageContext } from "@whitespace/gatsby-theme-wordpress-basic/src/hooks/page-context";
import {
  PageContent,
  PageHeading,
  PagePreamble,
  Seo,
} from "@whitespace/gatsby-theme-wordpress-basic/src/wsui/components";
import { Section, PageGrid, PageGridItem, useThemeProps } from "@wsui/base";

import {
  // PageChildNavigation,
  PageContentAreaModules,
  // PageFeaturedImage,
  // PageSiblingNavigation,
} from "../../../../wsui/components";

export default function FrontPageTemplate(props) {
  const theme = useTheme();
  props = useThemeProps({ props, name: "FrontPageTemplate" });
  let { spacing = [4, 8] } = props;
  const { title } = usePageContext();
  return (
    <article>
      <Seo title={title} isFrontPage />
      <PageGrid>
        <PageGridItem maxColspan={7}>
          <PageHeading hideTitle marginAfter />
          <Section>
            <PagePreamble marginAfter />
            <PageContent marginAfter />
          </Section>
        </PageGridItem>
      </PageGrid>
      <Section>
        <PageContentAreaModules
          maxColspan={7}
          css={css`
            margin-bottom: ${theme.getLength(spacing)};
          `}
        />
      </Section>
    </article>
  );
}

/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const PROFILE_PATH = "/christian-lacdael";

const toAbsoluteUrl = (value, siteUrl) => {
    if (!value) return undefined;

    try {
        return new URL(value, `${siteUrl}/`).toString();
    } catch (error) {
        return value;
    }
};

const SEO = ({
    title,
    description,
    date,
    image,
    imageAlt,
    imageWidth,
    imageHeight,
    what,
    tags,
    schemaMarkup,
    pathname = "/"
}) => {
    const { site } = useStaticQuery(
        graphql`
          query {
            site {
              siteMetadata {
                siteUrl
                title
                image
                imageWidth
                imageHeight
                description
                author
              }
            }
          }
        `
    )

    const siteUrl = site.siteMetadata.siteUrl || site.siteMetadata.url;
    const defaultTitle = site.siteMetadata.title; // Corrected typo: tile -> title
    const defaultImage = site.siteMetadata.image;
    const defaultDescription = site.siteMetadata.description;
    const siteAuthor = site.siteMetadata.author;
    const normalizedPath = pathname.replace(/\/+$/, '') || '/';

    const seo = {
        title: title || defaultTitle,
        description: description || defaultDescription,
        image: toAbsoluteUrl(image || defaultImage, siteUrl),
        imageAlt: imageAlt || defaultTitle,
        imageWidth: imageWidth || site.siteMetadata.imageWidth,
        imageHeight: imageHeight || site.siteMetadata.imageHeight,
        url: `${siteUrl}${normalizedPath}`,
        author: siteAuthor
    }

    const ogType = what || 'website';

    return (
        <>
            <html lang="en-GB" />
            <title>{seo.title === defaultTitle ? seo.title : `${seo.title} | ${defaultTitle}`}</title>
            <link rel="canonical" href={seo.url} />
            {schemaMarkup && <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>}

            {seo.description && <meta name="description" content={seo.description} />}

            {/* Open Graph tags */}
            <meta property="og:url" content={seo.url} />
            <meta property="og:type" content={ogType} />
            <meta property="og:site_name" content={defaultTitle} />
            <meta property="og:title" content={seo.title} />
            <meta property="og:description" content={seo.description} />
            {seo.image && <meta property="og:image" content={seo.image} />}
            {seo.imageAlt && <meta property="og:image:alt" content={seo.imageAlt} />}
            {seo.imageWidth && <meta property="og:image:width" content={String(seo.imageWidth)} />}
            {seo.imageHeight && <meta property="og:image:height" content={String(seo.imageHeight)} />}
            <meta property="og:locale" content="en_GB"/>

            {/* Twitter Card tags */}
            <meta name="twitter:card" content="summary_large_image" />
            {seo.author && <meta name="twitter:creator" content={seo.author} />}
            <meta name="twitter:url" content={seo.url} />
            <meta name="twitter:title" content={seo.title} />
            <meta name="twitter:description" content={seo.description} />
            {seo.image && <meta name="twitter:image" content={seo.image} />}
            {seo.imageAlt && <meta name="twitter:image:alt" content={seo.imageAlt} />}

            {ogType === 'article' && date && <meta property="article:published_time" content={date} />}
            {(ogType === 'article' || ogType === 'book') && (
                <meta property={`${ogType}:author`} content={`${siteUrl}${PROFILE_PATH}`} />
            )}

            {ogType === 'book' && date && <meta property="book:release_date" content={date} />}

            {tags && what && tags.split(/[\s,]+/).filter(Boolean).map((tag, index) => (
                <meta property={`${what}:tag`} key={`${tag}-${index}`} content={tag} />
            ))}

            {ogType === 'profile' && <>
                <meta property="profile:first_name" content="Christian" />
                <meta property="profile:last_name" content="Lacdael" />
                <meta property="profile:gender" content="male" />
            </>}
        </>
    );
}

export default SEO;

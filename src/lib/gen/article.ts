/**
 * @import {Root} from 'hast'
 * @import {PackageJson} from 'type-fest'
 */

import { common } from '@wooorm/starry-night'
import etc from '@wooorm/starry-night/etc'
import sourceRegexp from '@wooorm/starry-night/source.regexp'
import sourceRegexpExtended from '@wooorm/starry-night/source.regexp.extended'
import sourceRegexpPosix from '@wooorm/starry-night/source.regexp.posix'
import sourceSy from '@wooorm/starry-night/source.sy'
import sourceTsx from '@wooorm/starry-night/source.tsx'
import type { Root } from 'hast'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeInferReadingTimeMeta from 'rehype-infer-reading-time-meta'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeStarryNight from 'rehype-starry-night'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import { link } from './atom/icon/link.js'
import rehypeAbbreviate from './plugin/rehype-abbreviate.js'
import rehypeLink from './plugin/rehype-link.js'
import rehypeStringify from 'rehype-stringify'
import rehypeDocument from 'rehype-document'

const articleProcessor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkFrontmatter)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(function() {
        return function(tree: Root) {
            visit(tree, 'element', function(node) {
                if (node.tagName === 'code' && node.data?.meta === 'twoslash') {
                    const className = Array.isArray(node.properties.className)
                        ? node.properties.className
                        : (node.properties.className = [])
                    className.push('twoslash')
                }
            })
        }
    })
    .use(rehypeRaw)
    .use(rehypeInferReadingTimeMeta)
    .use(rehypeStarryNight, {
        grammars: [
            ...common,
            etc,
            sourceRegexpExtended,
            sourceRegexpPosix,
            sourceRegexp,
            sourceSy,
            sourceTsx
        ],
        plainText: ['txt']
    })
    // .use(rehypeTwoslash, { twoslash: { compilerOptions: compilerOptions as unknown as typescript.CompilerOptions } })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
        behavior: 'prepend',
        content: link(),
        properties: { ariaLabel: 'Link to self', className: ['anchor'] }
    })
    .use(rehypeAbbreviate, {
        ignore: [
            'ATX',
            'ECMAScript',
            'ESLint',
            'ID',
            'ISC',
            'JSDoc',
            'JSX',
            'MDX',
            'MIT'
        ],
        titles: {
            API: 'Application programming interface',
            ARIA: 'Accessible rich internet applications',
            AST: 'Abstract syntax tree',
            CDN: 'Content delivery network',
            CDATUM: 'Character data',
            CI: 'Continuous integration',
            CLI: 'Command-line interface',
            CSS: 'Cascading style sheets',
            DOM: 'Document object model',
            DSL: 'Domain-specific language',
            GFM: 'GitHub flavored markdown',
            HSL: 'Hue, saturation, lightness',
            HTML: 'Hypertext markup language',
            JSON: 'JavaScript object notation',
            MDN: 'Mozilla developer network',
            PR: 'Pull request',
            URL: 'Uniform resource locator',
            XML: 'Extensible markup language',
            XSS: 'Cross site scripting'
        }
    })
    .use(rehypeLink)
    .use(rehypeDocument, {
        link: [
            { href: 'index.css', rel: 'stylesheet' },
        ]
    })
    .use(function addProseClass() {
        return function(tree: Root) {
            visit(tree, 'element', (node) => {
                if (node.tagName === 'body') {
                    node.properties = node.properties || {};
                    const classes = node.properties.className || [];
                    if (typeof classes === 'object' && !classes.includes('prose')) {
                        classes.push('prose mx-auto');
                    }
                    node.properties.className = classes;
                }
            });
        };
    })
    .use(rehypeStringify)

export async function processArticle(source: string) {
    return await articleProcessor.process(source)
}

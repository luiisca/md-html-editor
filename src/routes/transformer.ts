import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

function transformer() {
    return unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeStringify)
}
export async function transform(text: string) {
    return await transformer().process(text)
}

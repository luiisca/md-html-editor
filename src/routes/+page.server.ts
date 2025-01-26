import * as fs from "node:fs/promises";
import { join } from "node:path";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
    let path = join(process.cwd(), "src/demo.md");
    const md = await fs.readFile(path, "utf-8");

    return {
        md
    };
}

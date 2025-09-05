import { Query } from "@/lib/lexicon/primary";
import { ComAtprotoLexiconSchema } from "@/lib/types";
import { describe, expect, test } from "vitest";

const testLexicon: Query = {
    type: "query",
    description: "some test query",
    output: {
        description: "test lexicon output object",
        encoding: "application/json",
        schema: {
            type: "object",
            description: "test lexicon output object schema",
            properties: {
                hello: {
                    type: "string",
                    description: "hello world text lexicon object output",
                    const: "Hello World!",
                },
            },
            required: ["hello"],
        },
    },
};

const testFullLex: ComAtprotoLexiconSchema = {
    lexicon: 1,
    id: "com.example.testing.testQuery",
    defs: {
        main: testLexicon,
    },
    $type: "com.atproto.lexicon.schema",
};

// describe("sum should", () => {
//     test("properly add 1 and 2 into 3", () => {
//         expect(sum(1, 2)).toBe(3);
//     });
// });

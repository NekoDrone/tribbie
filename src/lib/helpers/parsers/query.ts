import {
    ObjectField,
    PossibleObjectFields,
    RefField,
    UnionField,
} from "@/lib/lexicon/fields";
import { Query } from "@/lib/lexicon/primary";

export const parseQueryLexicon = (lexicon: Query) => {
    const { description, output, errors, parameters } = lexicon;
    return {
        get: {
            description: description,
            responses: {
                "200": output && {
                    description: output.description,
                    content: {
                        [output.encoding]: {
                            schema:
                                output.schema &&
                                parseMethodSchema(output.schema),
                        },
                    },
                },
            },
        },
    };
};

const parseMethodSchema = (
    schema: ObjectField<PossibleObjectFields> | RefField | UnionField,
) => {
    switch (schema.type) {
        case "object":
            return parseObjectField(schema);
        case "ref":
            return parseRefField(schema);
        case "union":
            return parseUnionField(schema);
        default:
            throw new Error(
                "Error while parsing method schema. Method schema contained type field that was not object, ref, or union.",
            );
    }
};

const parseObjectField = (field: ObjectField<PossibleObjectFields>) => {};

const parseRefField = (field: RefField) => {};

const parseUnionField = (field: UnionField) => {};

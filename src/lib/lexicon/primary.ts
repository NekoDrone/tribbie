import {
    ObjectField,
    ParamsField,
    ParamsRestrictedFields,
    PossibleObjectFields,
    RefField,
    UnionField,
} from "@/lib/lexicon/fields";

interface BaseLexicon {
    type: "query" | "procedure" | "subscription" | "record";
    description: string;
}

interface Method extends BaseLexicon {
    type: "query" | "procedure" | "subscription";
    parameters?: ParamsField<ParamsRestrictedFields>;
    errors: {
        name: string;
        description?: string;
    };
}

interface QueryOrProcedure extends Method {
    type: "query" | "procedure";
    output: {
        description?: string;
        encoding: "application/json" | string;
        schema?: Extract<
            PossibleObjectFields,
            ObjectField<PossibleObjectFields> | RefField | UnionField
        >;
    };
}

export interface Query extends QueryOrProcedure {
    type: "query";
}

export interface Procedure extends QueryOrProcedure {
    type: "procedure";
    input: {
        description?: string;
        encoding: "application/json" | string;
        schema?: Extract<
            PossibleObjectFields,
            ObjectField<PossibleObjectFields> | RefField | UnionField
        >;
    };
}

export interface Subscription extends Method {
    type: "subscription";
    message?: {
        description?: string;
        schema: UnionField;
    };
}

export interface Record extends BaseLexicon {
    type: "record";
    key: string;
    record: ObjectField<PossibleObjectFields>;
}

export type Lexicon = Query | Procedure | Subscription | Record;

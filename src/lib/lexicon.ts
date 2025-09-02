export interface LexDefinition {
    type: "query" | "procedure" | "subscription" | "record";
    output: {
        schema: ObjectPropertiesDef<PropertiesDef>;
        encoding: string;
    };
    parameters: ParamsPropertiesDef<ParamsRestrictedProperties>;
    description: string;
}

interface BasePropertiesDef {
    type:
        | "null"
        | "boolean"
        | "integer"
        | "string"
        | "bytes"
        | "cid-link"
        | "array"
        | "object"
        | "blob"
        | "params"
        | "token"
        | "ref"
        | "union"
        | "unknown";
    description?: string;
}

// null properties
/**
 * A `null` value.
 * See on {@link https://atproto.com/specs/lexicon#null|ATProto Docs}.
 */
export interface NullPropertiesDef extends BasePropertiesDef {
    type: "null";
}

// boolean properties
interface BaseBoolPropertiesDef extends BasePropertiesDef {
    type: "boolean";
    default?: boolean;
    const?: boolean;
}

/**
 * A `true` or `false` value with a given `default` value for this field.
 * See on {@link https://atproto.com/specs/lexicon#boolean|ATProto Docs}.
 */
export interface BoolDefaultPropertiesDef extends BaseBoolPropertiesDef {
    default: boolean;
    const?: never;
}

/**
 * A `true` or `false` value with a fixed (constant) value for this field.
 * See on {@link https://atproto.com/specs/lexicon#boolean|ATProto Docs}.
 */
export interface BoolConstPropertiesDef extends BaseBoolPropertiesDef {
    default?: never;
    const: boolean;
}

/**
 * A `true` or `false` value.
 * See on {@link https://atproto.com/specs/lexicon#boolean|ATProto Docs}.
 */
export interface BoolPropertiesDef extends BaseBoolPropertiesDef {
    default?: never;
    const?: never;
}

// integer properties
interface BaseIntegerPropertiesDef extends BasePropertiesDef {
    type: "integer";
    minimum?: number;
    maximum?: number;
    enum?: Array<number>;
}

/**
 * A signed integer number with a given `default` value for this field.
 * See on {@link https://atproto.com/specs/lexicon#integer|ATProto Docs}.
 */
export interface IntegerDefaultPropertiesDef extends BaseIntegerPropertiesDef {
    default: number;
    const?: never;
}

/**
 * A signed integer number with a fixed (constant) value for this field.
 * See on {@link https://atproto.com/specs/lexicon#integer|ATProto Docs}.
 */
export interface IntegerConstPropertiesDef extends BaseIntegerPropertiesDef {
    default?: never;
    const: number;
}

/**
 * A signed integer number.
 * See on {@link https://atproto.com/specs/lexicon#integer|ATProto Docs}.
 */
export interface IntegerPropertiesDef extends BaseIntegerPropertiesDef {
    default?: never;
    const?: never;
}

// string properties
interface BaseStringPropertiesDef extends BasePropertiesDef {
    type: "string";
    format?:
        | "at-identifier"
        | "at-uri"
        | "cid"
        | "datetime"
        | "did"
        | "handle"
        | "nsid"
        | "tid"
        | "record-key"
        | "uri"
        | "language";
    maxLength?: number;
    minLength?: number;
    maxGraphemes?: number;
    minGraphemes?: number;
    knownValues?: Array<string>;
    enum?: Array<string>;
    default?: string;
    const?: string;
}

/**
 * A Unicode string with a given `default` value for this field. For non-Unicode encodings, use `bytes` instead.
 * See on {@link https://atproto.com/specs/lexicon#string|ATProto Docs}.
 */
export interface StringDefaultPropertiesDef extends BaseStringPropertiesDef {
    default: string;
    const?: never;
}

/**
 * A Unicode string with a fixed (constant) value for this field. For non-Unicode encodings, use `bytes` instead.
 * See on {@link https://atproto.com/specs/lexicon#string|ATProto Docs}.
 */
export interface StringConstPropertiesDef extends BaseStringPropertiesDef {
    default?: never;
    const: string;
}

/**
 * A Unicode string with a given `default` value for this field.
 * See on {@link https://atproto.com/specs/lexicon#string|ATProto Docs}.
 */
export interface StringPropertiesDef extends BaseStringPropertiesDef {
    default?: never;
    const?: never;
}

// bytes properties
/**
 * A collection of raw bytes with no encoding.
 * See on {@link https://atproto.com/specs/lexicon#bytes|ATProto Docs}.
 */
export interface BytesPropertiesDef extends BasePropertiesDef {
    type: "bytes";
    minLength?: number;
    maxLength?: number;
}

// cid-link properties
/**
 * See on {@link https://atproto.com/specs/lexicon#cid-link|ATProto Docs}
 */
export interface CidLinkPropertiesDef extends BasePropertiesDef {
    type: "cid-link";
    // TODO: what.
}

// array properties
/**
 * A collection of elements.
 * See on {@link https://atproto.com/specs/lexicon#array|ATProto Docs}
 */
export interface ArrayPropertiesDef<T extends PropertiesDef>
    extends BasePropertiesDef {
    type: "array";
    items: T;
    minLength?: number;
    maxLength?: number;
}

/**
 * A generic object schema which can be nested inside other definitions by reference.
 * See on {@link https://atproto.com/specs/lexicon#object|ATProto Docs}
 */
export interface ObjectPropertiesDef<T extends PropertiesDef>
    extends BasePropertiesDef {
    type: "object";
    properties: Record<string, T>;
    required?: Array<string>;
    nullable?: Array<string>;
}

/**
 * A blob of binary data. `accept` should be a valid MIME type
 * See on {@link https://atproto.com/specs/lexicon#blob|ATProto Docs}
 */
export interface BlobPropertiesDef extends BasePropertiesDef {
    type: "blob";
    accept?: Array<string>;
    maxSize?: number;
}

type ParamsRestrictedProperties =
    | BoolConstPropertiesDef
    | BoolDefaultPropertiesDef
    | BoolPropertiesDef
    | IntegerConstPropertiesDef
    | IntegerDefaultPropertiesDef
    | IntegerPropertiesDef
    | StringDefaultPropertiesDef
    | StringConstPropertiesDef
    | StringPropertiesDef
    | ArrayPropertiesDef<
          | BoolConstPropertiesDef
          | BoolDefaultPropertiesDef
          | BoolPropertiesDef
          | IntegerConstPropertiesDef
          | IntegerDefaultPropertiesDef
          | IntegerPropertiesDef
          | StringDefaultPropertiesDef
          | StringConstPropertiesDef
          | StringPropertiesDef
          | UnknownPropertiesDef
      >
    | UnknownPropertiesDef;

/**
 * A more limited scope of the `object` type.
 * Only ever used for the `parameters` field on `query`, `procedure`, and `subscription` primary types.
 * These map to HTTP query params.
 * See on {@link https://atproto.com/specs/lexicon#params|ATProto Docs}
 */
export interface ParamsPropertiesDef<T extends ParamsRestrictedProperties>
    extends BasePropertiesDef {
    type: "params";
    required: Array<string>;
    properties: Record<string, T>;
}

/**
 * An empty data value which exists only to be referenced by name.
 * See on {@link https://atproto.com/specs/lexicon#token|ATProto Docs}
 */
export interface TokenPropertiesDef extends BasePropertiesDef {
    type: "token";
}

/**
 * A reference to another schema definition.
 * See on {@link https://atproto.com/specs/lexicon#ref|ATProto Docs}
 */
export interface RefPropertiesDef extends BasePropertiesDef {
    type: "ref";
    ref: string;
}

/**
 * A union of multiple possible types that could be present at this location in the schema.
 * See on {@link https://atproto.com/specs/lexicon#union|ATProto Docs}
 */
export interface UnionPropertiesDef extends BasePropertiesDef {
    type: "union";
    refs: Array<string>;
    closed?: boolean;
}

/**
 * An object of any data type with no specific validation.
 * The top level data must be an object (not a string, boolean, etc.).
 * May contain a `$type` field indicating the schema of the data.
 * See on {@link https://atproto.com/specs/lexicon#unknown|ATProto Docs}
 */
export interface UnknownPropertiesDef extends BasePropertiesDef {
    type: "unknown";
    $type: unknown;
}

export type PropertiesDef =
    | NullPropertiesDef
    | BoolDefaultPropertiesDef
    | BoolConstPropertiesDef
    | BoolPropertiesDef
    | IntegerDefaultPropertiesDef
    | IntegerConstPropertiesDef
    | IntegerPropertiesDef
    | StringDefaultPropertiesDef
    | StringConstPropertiesDef
    | StringPropertiesDef
    | BytesPropertiesDef
    | CidLinkPropertiesDef
    | ArrayPropertiesDef<PropertiesDef>
    | ObjectPropertiesDef<PropertiesDef>
    | BlobPropertiesDef
    | ParamsPropertiesDef<ParamsRestrictedProperties>
    | TokenPropertiesDef
    | RefPropertiesDef
    | UnionPropertiesDef
    | UnknownPropertiesDef;

export interface BaseField {
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
export interface NullField extends BaseField {
    type: "null";
}

// boolean properties
interface BaseBoolField extends BaseField {
    type: "boolean";
    default?: boolean;
    const?: boolean;
}

/**
 * A `true` or `false` value with a given `default` value for this field.
 * See on {@link https://atproto.com/specs/lexicon#boolean|ATProto Docs}.
 */
export interface BoolDefaultField extends BaseBoolField {
    default: boolean;
    const?: never;
}

/**
 * A `true` or `false` value with a fixed (constant) value for this field.
 * See on {@link https://atproto.com/specs/lexicon#boolean|ATProto Docs}.
 */
export interface BoolConstField extends BaseBoolField {
    default?: never;
    const: boolean;
}

/**
 * A `true` or `false` value.
 * See on {@link https://atproto.com/specs/lexicon#boolean|ATProto Docs}.
 */
export interface BoolField extends BaseBoolField {
    default?: never;
    const?: never;
}

// integer properties
interface BaseIntegerField extends BaseField {
    type: "integer";
    minimum?: number;
    maximum?: number;
    enum?: Array<number>;
}

/**
 * A signed integer number with a given `default` value for this field.
 * See on {@link https://atproto.com/specs/lexicon#integer|ATProto Docs}.
 */
export interface IntegerDefaultField extends BaseIntegerField {
    default: number;
    const?: never;
}

/**
 * A signed integer number with a fixed (constant) value for this field.
 * See on {@link https://atproto.com/specs/lexicon#integer|ATProto Docs}.
 */
export interface IntegerConstField extends BaseIntegerField {
    default?: never;
    const: number;
}

/**
 * A signed integer number.
 * See on {@link https://atproto.com/specs/lexicon#integer|ATProto Docs}.
 */
export interface IntegerField extends BaseIntegerField {
    default?: never;
    const?: never;
}

// string properties
interface BaseStringField extends BaseField {
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
export interface StringDefaultField extends BaseStringField {
    default: string;
    const?: never;
}

/**
 * A Unicode string with a fixed (constant) value for this field. For non-Unicode encodings, use `bytes` instead.
 * See on {@link https://atproto.com/specs/lexicon#string|ATProto Docs}.
 */
export interface StringConstField extends BaseStringField {
    default?: never;
    const: string;
}

/**
 * A Unicode string with a given `default` value for this field.
 * See on {@link https://atproto.com/specs/lexicon#string|ATProto Docs}.
 */
export interface StringField extends BaseStringField {
    default?: never;
    const?: never;
}

// bytes properties
/**
 * A collection of raw bytes with no encoding.
 * See on {@link https://atproto.com/specs/lexicon#bytes|ATProto Docs}.
 */
export interface BytesField extends BaseField {
    type: "bytes";
    minLength?: number;
    maxLength?: number;
}

// cid-link properties
/**
 * See on {@link https://atproto.com/specs/lexicon#cid-link|ATProto Docs}
 */
export interface CidLinkField extends BaseField {
    type: "cid-link";
    // TODO: what.
}

// array properties
/**
 * A collection of elements.
 * See on {@link https://atproto.com/specs/lexicon#array|ATProto Docs}
 */
export interface ArrayField<T extends PossibleObjectFields> extends BaseField {
    type: "array";
    items: T;
    minLength?: number;
    maxLength?: number;
}

/**
 * A generic object schema which can be nested inside other definitions by reference.
 * See on {@link https://atproto.com/specs/lexicon#object|ATProto Docs}
 */
export interface ObjectField<T extends PossibleObjectFields> extends BaseField {
    type: "object";
    properties: Record<string, T>;
    required?: Array<string>;
    nullable?: Array<string>;
}

/**
 * A blob of binary data. `accept` should be a valid MIME type
 * See on {@link https://atproto.com/specs/lexicon#blob|ATProto Docs}
 */
export interface BlobField extends BaseField {
    type: "blob";
    accept?: Array<string>;
    maxSize?: number;
}

export type ParamsRestrictedFields =
    | BoolConstField
    | BoolDefaultField
    | BoolField
    | IntegerConstField
    | IntegerDefaultField
    | IntegerField
    | StringDefaultField
    | StringConstField
    | StringField
    | ArrayField<ParamsRestrictedFields>
    | UnknownField;

/**
 * A more limited scope of the `object` type.
 * Only ever used for the `parameters` field on `query`, `procedure`, and `subscription` primary types.
 * These map to HTTP query params.
 * See on {@link https://atproto.com/specs/lexicon#params|ATProto Docs}
 */
export interface ParamsField<T extends ParamsRestrictedFields>
    extends BaseField {
    type: "params";
    required: Array<string>;
    properties: Record<string, T>;
}

/**
 * An empty data value which exists only to be referenced by name.
 * See on {@link https://atproto.com/specs/lexicon#token|ATProto Docs}
 */
export interface TokenField extends BaseField {
    type: "token";
}

/**
 * A reference to another schema definition.
 * See on {@link https://atproto.com/specs/lexicon#ref|ATProto Docs}
 */
export interface RefField extends BaseField {
    type: "ref";
    ref: string;
}

/**
 * A union of multiple possible types that could be present at this location in the schema.
 * See on {@link https://atproto.com/specs/lexicon#union|ATProto Docs}
 */
export interface UnionField extends BaseField {
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
export interface UnknownField extends BaseField {
    type: "unknown";
    $type?: unknown;
}

export type PossibleObjectFields =
    | NullField
    | BoolDefaultField
    | BoolConstField
    | BoolField
    | IntegerDefaultField
    | IntegerConstField
    | IntegerField
    | StringDefaultField
    | StringConstField
    | StringField
    | BytesField
    | CidLinkField
    | ArrayField<PossibleObjectFields>
    | ObjectField<PossibleObjectFields>
    | BlobField
    | ParamsField<ParamsRestrictedFields>
    | TokenField
    | RefField
    | UnionField
    | UnknownField;

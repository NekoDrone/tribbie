import { LexDefinition } from "@/lib/lexicon.js";

export interface PlcDirectoryResponse {
    id: string;
    alsoKnownAs: Array<string>;
    verificationMethod: Array<{
        id: string;
        type: string;
        controller: string;
        publicKeyMultibase: string;
    }>;
    service: Array<{
        id: string;
        type: string;
        serviceEndpoint: string;
    }>;
}

export interface ComAtprotoLexiconSchemaResponse {
    id: string;
    $type: string;
    lexicon: number;
    defs: Record<"main" | string, LexDefinition>;
}

export interface ComAtprotoRepoListRecordsResponse {
    records: Array<{
        uri: string;
        cid: string;
        value: ComAtprotoLexiconSchemaResponse;
    }>;
    cursor: string;
}

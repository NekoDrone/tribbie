import { Lexicon } from "@/lib/lexicon/primary";

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

export interface ComAtprotoLexiconSchema {
    id: string;
    $type: string;
    lexicon: number;
    defs: Record<string, Lexicon> & { main: Lexicon };
}

export interface ComAtprotoRepoListRecordsResponse {
    records: Array<{
        uri: string;
        cid: string;
        value: ComAtprotoLexiconSchema;
    }>;
    cursor: string;
}

import * as dns from "dns/promises";

enum Lexicons {
    APP_BSKY = "app.bsky.actor",
    // CHAT_BSKY = "https://github.com/bluesky-social/atproto/tree/main/lexicons/chat/bsky",
    COM_ATPROTO = "com.atproto.admin",
    TOOLS_OZONE = "tools.ozone.communication",
    // SH_TANGLED = "https://tangled.sh/@tangled.sh/core/tree/master/lexicons",
    // PLACE_STREAM = "https://github.com/streamplace/streamplace/tree/next/lexicons",
    // SOCIAL_GRAIN = "https://github.com/grainsocial/grain/tree/main/lexicons",
    // COM_WHTWND = "https://github.com/whtwnd/whitewind-blog/tree/main/lexicons",
}

const resolveTxt = async (domain: string): Promise<string> => {
    let res = "";
    return dns
        .resolveTxt(domain)
        .then((records) => {
            records.forEach((record) => {
                record.forEach((segment) => {
                    if (segment.startsWith("did=")) {
                        const kvp = segment.split("=");
                        if (kvp.length >= 2) {
                            res = kvp[1] as string;
                        }
                    }
                });
            });
        })
        .then(() => {
            if (res != "") return res;

            throw new Error(`No DID record found at ${domain}`);
        });
};

interface PlcDirectoryResponse {
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

const resolveDidToServiceUrl = async (did: string) => {
    const req = new Request(`https://plc.directory/${did}`);
    const res = await fetch(req);
    const data = (await res.json()) as PlcDirectoryResponse;
    return data.service[0] ? data.service[0].serviceEndpoint : "";
};

interface ComAtprotoLexiconSchemaResponse {
    id: string;
    $type: string;
    lexicond: number;
    defs: unknown; // TODO: actually implement this
}

interface ComAtprotoRepoListRecordsResponse {
    uri: string;
    cid: string;
    value: ComAtprotoLexiconSchemaResponse;
}

const listLexicons = async (did: string, serviceEndpoint: string) => {
    const req = new Request(
        `${serviceEndpoint}/xrpc/com.atproto.repo.listRecords?repo=${did}&collection=com.atproto.lexicon.schema`,
    );
    const res = await fetch(req);
    const data = (await res.json()) as Array<ComAtprotoRepoListRecordsResponse>;
    return data;
};

const main = async () => {
    const lexiconDomains = Object.values(Lexicons);
    const didRecords = await Promise.all(
        lexiconDomains.map(async (domain) => {
            const mirrored = domain.split(".").reverse().join(".");
            const res = await resolveTxt(`_lexicon.${mirrored}`);
            return res;
        }),
    );

    const serviceUrls = await Promise.all(
        didRecords.map(async (did) => {
            const serviceUrl = await resolveDidToServiceUrl(did);
            return { did, serviceUrl };
        }),
    );

    const lexicons = await Promise.all(
        serviceUrls.map(async (pairs) => {
            return await listLexicons(pairs.did, pairs.serviceUrl);
        }),
    );

    console.log(lexicons);
};

main().then();

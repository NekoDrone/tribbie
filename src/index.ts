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

const resolveDidToPds = async (did: string) => {
    const req = new Request(`https://plc.directory/${did}`);
    const res = await fetch(req);
    const data = (await res.json()) as PlcDirectoryResponse;
    return data.service[0] ? data.service[0].serviceEndpoint : "";
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

    const pdsUrls = await Promise.all(
        didRecords.map((did) => resolveDidToPds(did)),
    );

    console.log(pdsUrls);
};

main().then();

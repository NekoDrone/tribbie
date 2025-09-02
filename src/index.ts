import * as dns from "dns/promises";
import {
    listLexicons,
    resolveDidToServiceUrl,
    resolveTxt,
} from "./lib/helpers";

const lexiconCollections = {
    APP_BSKY: "app.bsky.actor",
    // CHAT_BSKY : "https://github.com/bluesky-social/atproto/tree/main/lexicons/chat/bsky",
    COM_ATPROTO: "com.atproto.admin",
    TOOLS_OZONE: "tools.ozone.communication",
    // SH_TANGLED : "https://tangled.sh/@tangled.sh/core/tree/master/lexicons",
    // PLACE_STREAM : "https://github.com/streamplace/streamplace/tree/next/lexicons",
    // SOCIAL_GRAIN : "https://github.com/grainsocial/grain/tree/main/lexicons",
    // COM_WHTWND : "https://github.com/whtwnd/whitewind-blog/tree/main/lexicons",
};

const main = async () => {
    const lexiconDomains = Object.values(lexiconCollections);
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
};

main().then();

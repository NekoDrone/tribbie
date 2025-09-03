import { listLexicons } from "@/lib/helpers";
import { resolveDidToServiceUrl, resolveTxt } from "@/lib/helpers/resolver";

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

    const collections = await Promise.all(
        serviceUrls.map(async (pairs) => {
            return await listLexicons(pairs.did, pairs.serviceUrl);
        }),
    );

    const counts = {
        query: 0,
        procedure: 0,
        subscription: 0,
        record: 0,
        def: 0,
    };

    collections.forEach((collection) => {
        const records = collection.records;
        records.forEach((record) => {
            const defs = record.value.defs;
            Object.values(defs).forEach((record) => {
                switch (record.type) {
                    case "query":
                        counts.query++;
                        break;
                    case "procedure":
                        counts.procedure++;
                        break;
                    case "subscription":
                        counts.subscription++;
                        break;
                    case "record":
                        counts.record++;
                        break;
                    default:
                        counts.def++;
                }
            });
        });
    });

    console.log(
        "There are",
        counts.query,
        "queries in the given collections set.",
    );
    console.log(
        "There are",
        counts.procedure,
        "procedures in the given collections set.",
    );
    console.log(
        "There are",
        counts.subscription,
        "subscriptions in the given collections set.",
    );
    console.log(
        "There are",
        counts.record,
        "records in the given collections set.",
    );
    console.log("There are", counts.def, "defs in the given collections set.");
};

main().then();

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

    const exampleCollection = collections.find((collection) =>
        collection.records.find(
            (record) => record.value.defs.main.type == "query",
        ),
    );

    if (exampleCollection) {
        const exampleRecord = exampleCollection?.records.find(
            (record) => record.value.defs.main.type == "query",
        );

        if (exampleRecord) {
            const exampleLexicon = exampleRecord.value.defs.main;
            if (exampleLexicon.type == "query") {
                const exampleQueryLexicon = exampleLexicon;
                if (
                    exampleQueryLexicon.output.schema &&
                    exampleQueryLexicon.output.schema.type == "object"
                )
                    console.log(exampleQueryLexicon.output.schema.properties);
            }
        }
    }
};

main().then();

import * as dns from "dns";

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

const resolveTxt = (domain: string) => {
    const records = dns.resolveTxt(domain, (err, records) => {
        records.forEach((record) => console.log(record));
    });
};

const main = () => {
    const lexiconDomains = Object.values(Lexicons);
    lexiconDomains.forEach((domain) => {
        const mirrored = domain.split(".").reverse().join(".");
        resolveTxt(`_lexicon.${mirrored}`);
    });
};

main();

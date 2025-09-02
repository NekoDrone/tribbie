import { ComAtprotoRepoListRecordsResponse } from "@/lib/types";

export const listLexicons = async (did: string, serviceEndpoint: string) => {
    const req = new Request(
        `${serviceEndpoint}/xrpc/com.atproto.repo.listRecords?repo=${did}&collection=com.atproto.lexicon.schema&limit=100`,
    );
    const res = await fetch(req);
    const data = (await res.json()) as ComAtprotoRepoListRecordsResponse;
    return data;
};

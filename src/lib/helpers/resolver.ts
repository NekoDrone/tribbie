import * as dns from "dns/promises";
import type { PlcDirectoryResponse } from "@/lib/types";

export const resolveTxt = async (domain: string): Promise<string> => {
    const records = await dns.resolveTxt(domain);
    records.forEach((record) => {
        record.forEach((segment) => {
            if (segment.startsWith("did=")) {
                const kvp = segment.split("=");
                if (kvp.length >= 2) {
                    return kvp[1];
                }
            }
        });
    });

    throw new Error(`No DID record found at ${domain}`);
};

export const resolveDidToServiceUrl = async (did: string) => {
    const req = new Request(`https://plc.directory/${did}`);
    const res = await fetch(req);
    const data = (await res.json()) as PlcDirectoryResponse;
    return data.service[0] ? data.service[0].serviceEndpoint : "";
};

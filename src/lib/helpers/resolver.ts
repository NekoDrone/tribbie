import * as dns from "dns/promises";
import type { PlcDirectoryResponse } from "@/lib/types";

export const resolveTxt = async (domain: string): Promise<string> => {
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

export const resolveDidToServiceUrl = async (did: string) => {
    const req = new Request(`https://plc.directory/${did}`);
    const res = await fetch(req);
    const data = (await res.json()) as PlcDirectoryResponse;
    return data.service[0] ? data.service[0].serviceEndpoint : "";
};

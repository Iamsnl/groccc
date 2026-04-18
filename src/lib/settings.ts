import { prisma } from "./prisma";
import { unstable_cache } from "next/cache";

export const getStoreSettings = unstable_cache(
    async () => {
        try {
            const settings = await prisma.storeSettings.findUnique({
                where: { id: "default" }
            });
            if (settings) return settings;

            return await prisma.storeSettings.create({
                data: { id: "default", storeName: "FreshCart" }
            });
        } catch (e) {
            return { storeName: "FreshCart" };
        }
    },
    ['store-settings'],
    { revalidate: 3600, tags: ['settings'] }
);

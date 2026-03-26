import { prisma } from "./prisma";

export async function getStoreSettings() {
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
}

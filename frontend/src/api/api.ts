import { client } from "./client";

export const api = {
   get: <T>(
        url: string,
        params?: object
    ) => {
    const query = params
        ? `?${new URLSearchParams(
            Object.entries(params as Record<string, unknown>)
            .filter(([, value]) => value !== undefined && value !== null)
            .map(([key, value]) => [key, String(value)])
        ).toString()}`
        : "";

        return client<T>(`${url}${query}`);
    },

    post: <T>(url: string, body?: unknown) =>
        client<T>(url, {
            method: "POST",
            ...(body ? { body: JSON.stringify(body) } : {}),
        }),

    patch: <T>(url: string, body?: unknown) =>
        client<T>(url, {
            method: "PATCH",
            ...(body ? { body: JSON.stringify(body) } : {}),
        }),

    delete: <T>(url: string) =>
            client<T>(url, {
            method: "DELETE",
        }),
};
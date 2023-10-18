export function get<T>(key: string, defualtValue: T): T {
    if (typeof localStorage === "undefined") {
        return defualtValue;
    }
    const value = localStorage.getItem(key);
    if (value) {
        return JSON.parse(value);
    }
    return defualtValue;
}

export function set(key: string, value: unknown) {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

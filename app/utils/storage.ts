export function get<T>(key: string, defualtValue: T): T {
    const value = localStorage.getItem(key);
    if (value) {
        return JSON.parse(value);
    }
    return defualtValue;
}

export function set(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
}

import {type Dispatch, type SetStateAction, useEffect, useState} from "react";

export function useLocalStorage<T>(
    key: string,
    initialValue: T,
    isValid: (value: unknown) => value is T = (value): value is T => value !== undefined,
): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => {
        try {
            const saved = localStorage.getItem(key);
            if (saved === null) return initialValue;
            const parsed: unknown = JSON.parse(saved);
            return isValid(parsed) ? parsed : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            return;
        }
    }, [key, value]);

    return [value, setValue];
}

import { type DependencyList, useCallback, useEffect, useState } from "react";

type AsyncState<T> =
    | { status: "loading"; data: null; error: null }
    | { status: "success"; data: T; error: null }
    | { status: "error"; data: null; error: unknown };

export function useAsync<T>(
    load: () => Promise<T>,
    deps: DependencyList,
): AsyncState<T> & { reload: () => void } {
    const [state, setState] = useState<AsyncState<T>>({
        status: "loading",
        data: null,
        error: null,
    });
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let cancelled = false;
        setState({ status: "loading", data: null, error: null });
        load().then(
            (data) => {
                if (!cancelled)
                    setState({ status: "success", data, error: null });
            },
            (error: unknown) => {
                if (!cancelled)
                    setState({ status: "error", data: null, error });
            },
        );
        return () => {
            cancelled = true;
        };
    }, [...deps, attempt]);

    const reload = useCallback(() => setAttempt((n) => n + 1), []);

    return { ...state, reload };
}

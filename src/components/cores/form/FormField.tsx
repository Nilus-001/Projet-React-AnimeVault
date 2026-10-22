import type { ReactNode } from "react";

type FormFieldProps = {
    id: string;
    label: string;
    required?: boolean;
    error?: string;
    children: ReactNode;
};

export function fieldClass(error?: string): string {
    return `w-full rounded-xl border bg-neutral px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 disabled:opacity-60 ${
        error ? "border-rose-400/70 focus:ring-rose-400/40" : "border-white/5 focus:ring-primary/60"
    }`;
}

function FormField({ id, label, required = false, error, children }: FormFieldProps) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-sm font-semibold text-on-surface">
                {label}
                {required && <span className="text-rose-300"> *</span>}
            </label>
            {children}
            {error && <p className="text-xs font-medium text-rose-300">{error}</p>}
        </div>
    );
}

export default FormField;

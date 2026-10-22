import type { ReactNode } from "react";
import AppChip, { type ChipVariant } from "./AppChip.tsx";

type ChipItem = {
    key: string | number;
    label: ReactNode;
};

type AppChipListProps = {
    items: ChipItem[];
    variant?: ChipVariant;
    label?: string;
    className?: string;
};

function AppChipList({
    items,
    variant,
    label,
    className = "",
}: AppChipListProps) {
    if (items.length === 0) return null;
    return (
        <ul aria-label={label} className={`flex flex-wrap gap-2 ${className}`}>
            {items.map((item) => (
                <li key={item.key}>
                    <AppChip variant={variant}>{item.label}</AppChip>
                </li>
            ))}
        </ul>
    );
}

export default AppChipList;

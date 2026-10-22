import { Link } from "react-router";
import AppIcon from "../icons/AppIcon.tsx";
import { focusRing } from "../../../styles/ui.ts";

export type BreadcrumbItem = { label: string; to?: string };

function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                {items.map((item, i) => {
                    const isLast = i === items.length - 1;
                    return (
                        <li key={`${i}-${item.label}`} className="flex items-center gap-2">
                            {isLast || !item.to ? (
                                <span aria-current={isLast ? "page" : undefined} className="font-bold text-on-surface">
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    to={item.to}
                                    className={`rounded text-on-surface-variant transition-colors hover:text-on-surface ${focusRing}`}
                                >
                                    {item.label}
                                </Link>
                            )}
                            {!isLast && <AppIcon name="chevron-right" className="size-3 text-on-surface-variant/70" strokeWidth={2.5} />}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export default Breadcrumb;

import AppBadge, { type BadgeVariant } from "./AppBadge.tsx";
import { formatScore } from "../../../utils/anime.ts";

type ScoreBadgeProps = {
    score: number | null;
    variant?: Extract<BadgeVariant, "overlay" | "score">;
    hideWhenEmpty?: boolean;
    className?: string;
};

function ScoreBadge({ score, variant = "overlay", hideWhenEmpty = false, className = "" }: ScoreBadgeProps) {
    if (score === null && hideWhenEmpty) return null;
    return (
        <AppBadge variant={variant} className={className}>
            <span aria-hidden className="text-tertiary-soft">
                ★
            </span>
            <span className="sr-only">Score </span>
            {formatScore(score)}
        </AppBadge>
    );
}

export default ScoreBadge;

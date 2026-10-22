import {useWatchListContext} from "../../../contexts/watchListProvider.tsx";
import AppToggleButton from "../../cores/buttons/AppToggleButton.tsx";
import CardContentContainer from "../../cores/container/CardContentContainer.tsx";

type AnimeActionsBarProps = {
    animeId: number;
};

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="m5 12.5 4.5 4.5L19 7" />
    </svg>
);

function AnimeActionsBar({animeId}: AnimeActionsBarProps) {
    const { addToWatchList, removeFromWatchList, isInWatchList } = useWatchListContext();

    return (
        <CardContentContainer
            content={
                <div className="flex flex-wrap items-center gap-3">
                    <AppToggleButton
                        condition={isInWatchList(animeId)}
                        onTrue={() => removeFromWatchList(animeId)}
                        onFalse={() => addToWatchList(animeId)}
                        labelTrue="In Watchlist"
                        labelFalse="Add to Watchlist"
                        iconTrue={<CheckIcon />}
                        iconFalse={<PlusIcon />}
                        color="primary"
                    />
                </div>
            }
        />
    )
}
export default AnimeActionsBar;

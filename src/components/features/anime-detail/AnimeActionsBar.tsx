import { useWatchListContext } from "../../../contexts/watchListProvider.tsx";
import AppToggleButton from "../../cores/buttons/AppToggleButton.tsx";
import CardContentContainer from "../../cores/container/CardContentContainer.tsx";

type AnimeActionsBarProps = {
    animeId: number;
};

function AnimeActionsBar({ animeId }: AnimeActionsBarProps) {
    const { addToWatchList, removeFromWatchList, isInWatchList } =
        useWatchListContext();

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
                        iconTrue="check"
                        iconFalse="plus"
                        color="primary"
                    />
                </div>
            }
        />
    );
}

export default AnimeActionsBar;

import type { ComponentPropsWithoutRef } from "react";

type PageContainerProps = ComponentPropsWithoutRef<"div">;

/** Shared content width for every section of the site (header, banner, pages, footer). */
function PageContainer({ className = "", ...props }: PageContainerProps) {
    return (
        <div
            className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}
            {...props}
        />
    );
}

export default PageContainer;

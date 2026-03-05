import type { ReactNode } from "react";

const TopSpace = ({child}:{child?:ReactNode}) => {
    return (
        <div className="h-[60px] w-full flex flex-row justify-start items-end px-[20px] py-[10px]">{child}</div>
    )
}

export default TopSpace;
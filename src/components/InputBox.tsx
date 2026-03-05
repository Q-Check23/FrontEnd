import ElementTitle from "./ElementTitle";

interface InputBoxProp {
    bgColor: string,
    basicTxt: string,
    basicTxtColor?: string,
    hasTitle: boolean,
    title: string | null,
}

export default function InputBox(
    { bgColor, basicTxt, basicTxtColor="#C0C0C0", hasTitle, title} : InputBoxProp
) {
    type CSSVars = React.CSSProperties & { [key: `--${string}`]: string | number };
    const vars: CSSVars = {
        "--bg" : bgColor,
        "--txt" : basicTxtColor
    }
    return (
        <div className="flex flex-col w-full gap-y-[2px]">
            {hasTitle?
                <ElementTitle title={title as string} />
                :
                <></>
            }

            <input
                type="text"
                placeholder={basicTxt}
                style={vars}
                className="flex w-full h-12 p-[13px] self-stretch items-center gap-2.5 rounded-lg border border-[#D5D5D5] bg-[var(--bg)] px-[13px] py-[7px]
                text-black t-placeholder"
            />
        </div>
    )
}
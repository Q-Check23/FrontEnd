import ElementTitle from "./ElementTitle";

interface InputAreaProp {
    bgColor: string,
    basicTxt: string,
    basicTxtColor?: string,
    hasTitle: boolean,
    title: string | null,
}

export default function InputArea(
    { bgColor, basicTxt, basicTxtColor="#C0C0C0", hasTitle, title } : InputAreaProp
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

            <textarea
                placeholder={basicTxt}
                style={vars}
                className="flex w-full h-[182px] px-[13px] py-[7px] items-start justify-between 
                self-stretch gap-2.5 rounded-lg border border-[#D5D5D5] bg-[var(--bg)]
                text-black t-placeholder"
            />
        </div>
    )
}
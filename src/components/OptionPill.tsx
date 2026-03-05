import React from "react";
import ElementTitle from "./ElementTitle";

type OptionPillProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

export function OptionPill({
  label,
  selected = false,
  onClick,
  className = "",
}: OptionPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex h-[38px] items-center justify-center gap-2.5",
        "px-[18px] py-[9px]",
        "rounded-[22px] border border-[#D5D5D5] bg-[#FDFDFD] text-ui14",
        "whitespace-nowrap",
        selected ? "font-bold text-primary-dark" : "font-normal text-[#808080]",
        className,
      ].join(" ")}
    >
      {label}
    </button>
  );
}

type OptionSelectorProps = {
  options: string[]; // length 4 가정
  value: string;
  onChange: (next: string) => void;
  className?: string,
  hasTitle: boolean,
  title?: string,
  titleColor?: string
};

export function OptionSelector({
  options,
  value,
  onChange,
  className = "",
  hasTitle,
  title,
  titleColor
}: OptionSelectorProps) {
  return (
    <div className="flex flex-col w-full gap-y-[2px]">
        {hasTitle?
            <ElementTitle title={title as string} />
            :
            <></>
        }
        <div className={["flex flex-wrap gap-2.5", className].join(" ")}>
            {options.map((opt) => (
                <OptionPill
                key={opt}
                label={opt}
                selected={opt === value}
                onClick={() => onChange(opt)}
                />
            ))}
        </div>
    </div>
  );
}
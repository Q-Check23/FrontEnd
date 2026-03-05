interface ElementTitleProp {
    title: string
}

export default function ElementTitle({title} : ElementTitleProp) {
    return (
        <h3 className="flex items-center gap-2.5 self-stretch px-1 py-0 text-title-sm">
        {title}
        </h3>
    )
}
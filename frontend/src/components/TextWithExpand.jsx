import { useEffect, useRef, useState } from "react";
import { MdExpandMore } from "react-icons/md";

export default function TextWithExpand({ originalText, minHeight = 4.5 }) {
  const [showButton, setShowButton] = useState(false);
  const commentRef = useRef(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setTimeout(
      () => setShowButton(commentRef.current.offsetHeight > 16 * minHeight),
      0,
    );
  }, [minHeight]);

  return (
    <div className="flex flex-col gap-1">
      <pre
        ref={commentRef}
        onClick={() => showButton && setExpanded(true)}
        className={`overflow-clip font-exo ${!showButton || expanded ? "h-fit" : `h-[4.5rem]`}`}
      >
        {originalText}
      </pre>
      {showButton && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center gap-1 self-end text-sm font-medium text-gray-500"
        >
          {expanded ? "Show less" : "Show more"}
          <MdExpandMore className={expanded && "rotate-180"} />
        </button>
      )}
    </div>
  );
}

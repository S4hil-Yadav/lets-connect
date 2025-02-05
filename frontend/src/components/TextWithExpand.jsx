import { useEffect, useRef, useState } from "react";
import { MdExpandMore } from "react-icons/md";
import { Link } from "react-router-dom";

export default function TextWithExpand({ originalText, minHeight = 5 }) {
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
        className={`overflow-clip text-wrap font-exo text-sm ${!showButton || expanded ? "h-fit" : `h-[4.5rem]`}`}
      >
        {originalText.split(/(\s+)/).map((word, index) =>
          word.startsWith("#") ? (
            <Link
              key={index}
              to="/search"
              state={{ search: "posts", searchParam: word }}
              className="text-blue-600 hover:underline"
            >
              {word}
            </Link>
          ) : word.startsWith("@") ? (
            <Link
              key={index}
              to="/search"
              state={{ search: "users", searchParam: word }}
              className="text-blue-600 hover:underline"
            >
              {word}
            </Link>
          ) : word.endsWith(".com") || word.endsWith(".in") ? (
            <a
              href={
                word.startsWith("http://") || word.startsWith("https://")
                  ? word
                  : `https://${word}`
              }
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              {word}
            </a>
          ) : (
            word
          ),
        )}
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

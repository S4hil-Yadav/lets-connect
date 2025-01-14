import { useState } from "react";
import { MdExpandMore } from "react-icons/md";

export default function TextWithExpand({ originalText, minLen = 100 }) {
  const [showButton] = useState(originalText.length > minLen + minLen / 2);

  const [text, setText] = useState(
    showButton ? originalText.slice(0, minLen) : originalText,
  );

  function handleExpand() {
    setText(
      text.length === originalText.length
        ? originalText.slice(0, minLen)
        : originalText,
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <span onClick={() => showButton && handleExpand()}>
        {text.concat(text.length < originalText.length ? "...." : "")}
      </span>
      {originalText.length > minLen + minLen / 2 && (
        <button
          onClick={handleExpand}
          className="flex items-center gap-1 self-end text-sm font-medium text-gray-500"
        >
          {text.length === originalText.length ? "Show less" : "Show more"}
          <MdExpandMore
            className={text.length === originalText.length && "rotate-180"}
          />
        </button>
      )}
    </div>
  );
}

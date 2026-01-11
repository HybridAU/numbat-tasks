import Link from "@mui/material/Link";
import linkifyit from "linkify-it";

const linkify = new linkifyit();

export default function LinkifyText({ text }: { text: string }) {
  const matches = linkify.match(text);
  // If there are no links found, return the text
  if (!matches) return text;

  let lastIndex = 0;
  const elements = [];
  matches.forEach((match, index) => {
    // Any preceding text
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }

    // Push the link
    elements.push(
      <Link
        // biome-ignore lint/suspicious/noArrayIndexKey: We only have the index here, and are not moving these elements
        key={index}
        href={match.url}
        // This prevents the parent typography from triggering. Without it,
        // when clicking a link, the edit task dialog pops up for a second before navigating away.
        onClick={(event) => {
          event.stopPropagation();
        }}
        target="_blank"
      >
        {match.text}
      </Link>,
    );

    lastIndex = match.lastIndex;
  });

  // Any remaining text
  if (text.length > lastIndex) {
    elements.push(text.substring(lastIndex));
  }

  return elements;
}

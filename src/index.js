import { first } from "lodash";

const names = ["cats", "trav", "connor", "marisa"];

const generateElement = ({ tag, className }) => {
  const el = document.createElement(tag);
  el.className = className;
  return el;
};

const item = generateElement({ tag: "div", className: "container" });
item.textContent = first(names);
document.body.appendChild(item);

export const render = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div;
};

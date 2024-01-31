import { c, css } from "atomico";

function pokemonTabs() {
  return (
    <host shadowDom>
      <slot />
    </host>
  );
}

pokemonTabs.styles = css`
  :host {
    display: inline-flex;
    border-radius: 100px;
    border: 1px solid black;
    overflow: hidden;
    position: relative;
  }
  ::slotted(*) {
    padding: 0.25rem 0.75rem;
    text-decoration: none;
    font-weight: bold;
    color: unset;
    font-size: 14px;
  }
  ::slotted(.active) {
    background: black;
    color: white;
    border-radius: 100px;
    letter-spacing: 1px;
  }
`;

export const PokemonTabs = c(pokemonTabs);

customElements.define("pokemon-tabs", PokemonTabs);

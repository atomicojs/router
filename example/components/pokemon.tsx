import { Props, c, css } from "atomico";

function pokemon() {
  return (
    <host shadowDom>
      <div class="image">
        <slot name="image" />
      </div>
      <div class="card">
        <slot />
      </div>
      <div class="footer"></div>
    </host>
  );
}

pokemon.props = {};

pokemon.styles = css`
  :host {
    padding: 10%;
    display: grid;
    gap: 1rem;
  }
  .image {
  }
  .card {
    position: relative;
    width: 100%;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.25),
      rgba(255, 255, 255, 0.5)
    );
    border-radius: 1rem;
    border: 1px solid white;
    padding: 5%;
    box-sizing: border-box;
    display: grid;
    justify-content: start;
    gap: 0.25rem;
  }
`;

export const Pokemon = c(pokemon);

customElements.define("app-pokemon", Pokemon);

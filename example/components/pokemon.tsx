import { c, css } from "atomico";

export const Pokemon = c(
  ({ thumbnail }) => (
    <host shadowDom>
      {thumbnail ? (
        <>
          <div class="card">
            <div class="image">
              <slot name="image" />
            </div>
            <div class="content">
              <slot />
            </div>
          </div>
        </>
      ) : (
        <>
          <div class="image">
            <slot name="image" />
          </div>
          <div class="card">
            <slot />
          </div>
          <div class="footer"></div>
        </>
      )}
    </host>
  ),
  {
    props: {
      layer: { type: Boolean, reflect: true },
      loading: { type: Boolean, reflect: true },
      thumbnail: { type: Boolean, reflect: true },
    },
    styles: css`
      :host {
        width: 100%;
        min-height: 100%;
        padding: 10%;
        display: flex;
        flex-flow: column;
        gap: 1rem;
        box-sizing: border-box;
        overflow: hidden;
        --card-bg: linear-gradient(
          45deg,
          rgba(255, 255, 255, 0.25),
          rgba(255, 255, 255, 0.5)
        );
      }
      .image {
      }
      .card {
        position: relative;
        width: 100%;
        background: var(--card-bg);
        border-radius: 1rem;
        border: 1px solid white;
        padding: 5%;
        box-sizing: border-box;
        display: flex;
        flex-flow: column;
        align-items: start;
        gap: 0.25rem;
      }
      .content {
        position: relative;
      }
      :host([layer]) {
        position: absolute;
        top: 0px;
        left: 0px;
        backdrop-filter: blur(50px);
        z-index: 2;
      }
      :host([thumbnail]) {
        height: 100%;
        padding: 0%;
        --card-bg: rgba(0, 0, 0, 0.15);
      }
      :host([thumbnail]) .card {
        overflow: hidden;
        height: 100%;
        align-items: center;
      }
      .loading {
        flex: 0%;
        display: flex;
        place-items: center;
        place-content: center;
      }
    `,
  }
);

customElements.define("pokemon-view", Pokemon);

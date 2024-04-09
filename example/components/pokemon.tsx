import { Props, c, css } from "atomico";

export const Pokemon = c(
  ({ thumbnail, loading }) => (
    <host shadowDom>
      {loading ? (
        <div class="loading">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="3em"
            height="3em"
            viewBox="0 0 24 24"
          >
            <g stroke="currentColor">
              <circle
                cx="12"
                cy="12"
                r="9.5"
                fill="none"
                stroke-linecap="round"
                stroke-width="3"
              >
                <animate
                  attributeName="stroke-dasharray"
                  calcMode="spline"
                  dur="1.5s"
                  keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                  keyTimes="0;0.475;0.95;1"
                  repeatCount="indefinite"
                  values="0 150;42 150;42 150;42 150"
                />
                <animate
                  attributeName="stroke-dashoffset"
                  calcMode="spline"
                  dur="1.5s"
                  keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                  keyTimes="0;0.475;0.95;1"
                  repeatCount="indefinite"
                  values="0;-16;-59;-59"
                />
              </circle>
              <animateTransform
                attributeName="transform"
                dur="2s"
                repeatCount="indefinite"
                type="rotate"
                values="0 12 12;360 12 12"
              />
            </g>
          </svg>
        </div>
      ) : thumbnail ? (
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

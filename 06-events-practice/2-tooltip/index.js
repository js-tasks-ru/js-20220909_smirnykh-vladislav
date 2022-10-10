class Tooltip {
  static instance;
  element;
  tooltipText;

  constructor () {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    Tooltip.instance = this;
  }

  onPointerOver = (event) => {
    const tooltip = event.target.closest("[data-tooltip]");
    if (tooltip) {
      this.tooltipText = tooltip.dataset.tooltip;
      this.render();
      document.addEventListener("pointermove", this.onPointerMove);
    }
  }

  render = () => {
    this.element = document.createElement("div");
    this.element.className = "tooltip";
    this.element.innerHTML = this.tooltipText;
    document.body.append(this.element);
  }

  onPointerMove = (event) => {
    this.element.style.left = `${event.clientX + 5}px`;
    this.element.style.top = `${event.clientY + 5}px`;
  }

  onPointerOut = () => {
    this.remove();
    this.tooltipText = null;
    document.removeEventListener("pointermove", this.onPointerMove);
  }

  initialize () {
    document.addEventListener("pointerover", this.onPointerOver);
    document.addEventListener("pointerout", this.onPointerOut);
  }

  remove () {
    if (this.element) {
      this.tooltipText = null;
      this.element.remove();
    }
  }

  destroy () {
    document.removeEventListener("pointermove", this.onPointerMove);
    document.removeEventListener("pointerover", this.onPointerOver);
    document.removeEventListener("pointerout", this.onPointerOut);
    this.remove();
    this.element = null;
  }
}

export default Tooltip;

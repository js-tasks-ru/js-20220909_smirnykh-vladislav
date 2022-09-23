export default class ColumnChart {
  chartHeight = 50;

  constructor(values={}) {
    this.data = values.data || [];
    this.label = values.label || '';
    this.value = values.hasOwnProperty('formatHeading') ? values.formatHeading(values.value) : values.value || 0;
    this.link = values.link || '';
    this.render();
  }

  getDataLine() {
    const maxVal = Math.max(...this.data);
    return this.data
      .map((item) => {
        return `<div style="--value:${Math.floor(item * (this.chartHeight / maxVal))}" data-tooltip="${Math.round(item / maxVal * 100)}%"></div>`;
      })
      .join("");
  }

  getTemplate() {
    const elemLink = this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>`: '';
    const elemData = this.getDataLine();
    
    return `
      <div class="column-chart__title">
        Total ${this.label}
        ${elemLink}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${
          this.value
        }</div>
        <div data-element="body" class="column-chart__chart">
            ${elemData}
        </div>
      </div>
    `;
  }

  render() {
    // DOM
    const wrapper = document.createElement("div");
    wrapper.className = 'column-chart ' + (this.data.length ? '' : 'column-chart_loading');
    wrapper.innerHTML = this.getTemplate();
    wrapper.style = `--chart-height: ${this.chartHeight}`

    this.element = wrapper;
  }

  update(data){
    this.data = data
    this.render()
  }

  destroy() {
    this.element.remove();
  }

  remove() {
    this.destroy();
  }
}

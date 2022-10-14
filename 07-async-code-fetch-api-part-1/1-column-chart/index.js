import fetchJson from "./utils/fetch-json.js";

const BACKEND_URL = "https://course-js.javascript.ru";

export default class ColumnChart {
  data = {};
  chartHeight = 50;
  subElements = {};
  element;

  constructor({
    url = "",
    link = "",
    range = {
      from: new Date(),
      to: new Date(),
    },
    label = "",
    formatHeading = (data) => data,
  } = {}) {
    this.url = new URL(url, BACKEND_URL);
    this.label = label;
    this.formatHeading = formatHeading;
    this.link = link;
    this.update(range.from, range.to);
    this.render();
  }

  getDataLine() {
    const maxVal = Math.max(...Object.values(this.data));
    return Object.values(this.data)
      .map((item) => {
        return `<div style="--value:${Math.floor(
          item * (this.chartHeight / maxVal)
        )}" data-tooltip="${Math.round((item / maxVal) * 100)}%"></div>`;
      })
      .join("");
  }

  getHeaderElem() {
    return `
        <div data-element="header" class="column-chart__header">${this.formatHeading(
            Object.values(this.data).reduce((sum, item) => sum + item, 0)
        )}</div>`;
  }

  getTemplate() {
    const elemLink = this.link
      ? `<a href="${this.link}" class="column-chart__link">View all</a>`
      : "";
    const elemData = this.getDataLine();
    return `
    <div class="column-chart column-chart_loading" style="--chart-height: ${
      this.chartHeight
    }">
        <div class="column-chart__title">
          Total ${this.label}
          ${elemLink}
        </div>
        <div class="column-chart__container">
            ${this.getHeaderElem()}
          <div data-element="body" class="column-chart__chart">
              ${elemData}
          </div>
        </div>
      `;
  }

  render() {
    const element = document.createElement("div");
    if (Object.values(this.data).length) {
      this.element.classList.remove("column-chart_loading");
    }
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);
  }

  async loadData(dateFrom, dateTo) {
    this.url.searchParams.set("from", dateFrom.toISOString());
    this.url.searchParams.set("to", dateTo.toISOString());
    return await fetchJson(this.url);
  }

  async update(dateFrom = new Date(), dateTo = new Date()) {
    const data = await this.loadData(dateFrom, dateTo);
    this.data = data;
    if (Object.values(data).length) {
      this.element.classList.remove("column-chart_loading");
      this.subElements.header.innerHTML = this.getHeaderElem();
      this.subElements.body.innerHTML = this.getDataLine();
    }
    return this.data;
  }

  destroy() {
    this.element = null;
    this.subElements = {};
    this.data = {};
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll("[data-element]");
    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }
    return result;
  }
}

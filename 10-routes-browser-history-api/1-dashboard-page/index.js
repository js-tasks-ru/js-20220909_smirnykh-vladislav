import RangePicker from "./components/range-picker/src/index.js";
import SortableTable from "./components/sortable-table/src/index.js";
import ColumnChart from "./components/column-chart/src/index.js";
import header from "./bestsellers-header.js";

import fetchJson from "./utils/fetch-json.js";

const BACKEND_URL = "https://course-js.javascript.ru/";

export default class Page {
  subElements = {};

  createComponents() {
    this.rangePiker = new RangePicker();

    this.sortableTable = new SortableTable(header, {
      url: "api/dashboard/bestsellers",
      isSortLocally: true,
    });

    this.ordersChart = new ColumnChart({
      url: "api/dashboard/orders",
      label: "orders",
      link: "#",
    });

    this.salesChart = new ColumnChart({
      url: "api/dashboard/sales",
      label: "sales",
      formatHeading: (data) => `$${data}`,
    });

    this.customersChart = new ColumnChart({
      url: "api/dashboard/customers",
      label: "customers",
    });
  }

  getContent() {
    return `
    <div class="dashboard">
      <div class="content__top-panel">
        <h2 class="page-title">Dashboard</h2>
        <div data-element="rangePicker"></div>
      </div>
      <div class="dashboard__charts">
        <div id="orders" data-element="ordersChart" 
            class="dashboard__chart_orders"></div>
        <div id="sales" data-element="salesChart"
             class="dashboard__chart_sales"></div>
        <div id="customers" data-element="customersChart"
            class="dashboard__chart_customers"></div>
      </div>
      <h3 class="block-title">Best sellers</h3>
      <div data-element="sortableTable"></div>
    </div>
    `;
  }

  initEventListeners() {
    document.addEventListener("date-select", (event) => {
      const { from, to } = event.detail;
      this.update(from, to);
    });
  }

  render() {
    this.createComponents();
    const element = document.createElement("div");
    element.innerHTML = this.getContent();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);
    this.renderComponents();
    this.initEventListeners();
    return this.element;
  }

  renderComponents() {
    this.subElements.rangePicker.append(this.rangePiker.element);
    this.subElements.ordersChart.append(this.ordersChart.element);
    this.subElements.salesChart.append(this.salesChart.element);
    this.subElements.customersChart.append(this.customersChart.element);
    this.subElements.sortableTable.append(this.sortableTable.element);
  }

  updateColumnChart(from, to) {
    this.ordersChart.update(from, to);
    this.salesChart.update(from, to);
    this.customersChart.update(from, to);
  }

  async updatesortableTable(from, to) {
    this.url.searchParams.set("_sort", "title");
    this.url.searchParams.set("_order", "asc");
    this.url.searchParams.set("_start", "1");
    this.url.searchParams.set("_end", "21");
    this.url.searchParams.set("from", from.toISOString());
    this.url.searchParams.set("to", to.toISOString());
    const data = await fetchJson(this.url);
    this.sortableTable.update(data);
  }

  update(from, to) {
    this.updatesortableTable(from, to);
    this.updateColumnChart(from, to);
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

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.subElements = {};
    this.element = null;
    this.rangePiker.destroy();
    this.ordersChart.destroy();
    this.salesChart.destroy();
    this.customersChart.destroy();
    this.sortableTable.destroy();
  }
}

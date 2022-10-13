import fetchJson from "./utils/fetch-json.js";

const BACKEND_URL = "https://course-js.javascript.ru";

export default class SortableTable {
  element;
  data = [];
  subElement = {};
  start = 1;
  end = 30;
  step = 30;
  loading = false;

  constructor(
    headerConfig = [],
    {
      sorted = {
        id: headerConfig.find((item) => item.sortable).id,
        order: "asc",
      },
      url = "",
      isSortClient = true,
    } = {}
  ) {
    this.headerConfig = headerConfig;
    this.sorted = sorted;
    this.url = new URL(url, BACKEND_URL);
    this.isSortClient = isSortClient;
    this.render();
    this.sort(this.sorted.id, this.sorted.order);
    this.initEventListeners();
  }

  sortClick = (event) => {
    const column = event.target.closest('[data-sortable="true"]');
    if (column) {
      const order = column.dataset.order === "asc" ? "desc" : "asc";
      this.sorted.id = column.dataset.id;
      this.sorted.order = order;
      this.sort(this.sorted.id, this.sorted.order);
    }
  };

  scrollTable = async () => {
    const { bottom } = this.element.getBoundingClientRect();
    if (
      bottom < document.documentElement.clientHeight &&
      !this.loading &&
      !this.isSortClient
    ) {
      this.loading = true;
      await this.update();
      this.loading = false;
    }
  };

  initEventListeners() {
    this.subElements.header.addEventListener("pointerdown", this.sortClick);
    window.addEventListener("scroll", this.scrollTable);
  }

  getHeader() {
    return `
    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headerConfig
        .map((item) => {
          const order = this.sorted.id === item.id ? this.sorted.order : "asc";
          return `
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="${order}">
            <span>${item.title}</span>
            <span data-element="arrow" class="sortable-table__sort-arrow">
              <span class="sort-arrow"></span>
            </span>
          </div>`;
        })
        .join("")}
    </div>`;
  }

  getRowElements(dataEl) {
    return this.headerConfig
      .map((item) => {
        if (Object.hasOwn(item, "template")) {
          return item.template(dataEl[item.id]);
        } else {
          return `<div class="sortable-table__cell">${dataEl[item.id]}</div>`;
        }
      })
      .join(" ");
  }

  getBody() {
    return this.data
      .map((item) => {
        return `
            <a href="${item.id}" class="sortable-table__row">
              ${this.getRowElements(item)}
            </a>
            `;
      })
      .join("");
  }

  get table() {
    return `<div class="sortable-table">
              ${this.getHeader()}
              <div data-element="body" class="sortable-table__body">
                ${this.getBody()}
              </div>
            </div>`;
  }

  async sort(id, order) {
    const column = this.headerConfig.find((item) => {
      return item.id === id;
    });
    if (column) {
      if (this.isSortClient) {
        this.sortOnClient(id, order, column);
      } else {
        await this.sortOnServer(id, order);
      }
      const allColumns = this.element.querySelectorAll(
        ".sortable-table__cell[data-id]"
      );
      const currentColumn = this.element.querySelector(
        `.sortable-table__cell[data-id="${id}"]`
      );

      allColumns.forEach((column) => {
        column.dataset.order = "";
      });

      currentColumn.dataset.order = order;
    }
  }

  async sortOnServer() {
    this.start = 1;
    this.end = this.step;

    const data = await this.loadData();

    this.start += this.step;
    this.end += this.step;

    this.data = data;
    this.subElements.body.innerHTML = this.getBody();
  }

  sortOnClient(id, order = "asc", column) {
    const directions = {
      asc: 1,
      desc: -1,
    };
    const direction = directions[order];
    if (column.sortType === "string") {
      this.data = this.data.sort((a, b) => {
        return direction * a[id].localeCompare(b[id], ["ru", "en"]);
      });
    } else if (column.sortType === "number") {
      this.data = this.data.sort((a, b) => {
        return direction * (b[id] - a[id]);
      });
    } else {
      throw new Error("Error sorting");
    }
    const allColumns = this.element.querySelectorAll(
      ".sortable-table__cell[data-id]"
    );
    const currentColumn = this.element.querySelector(
      `.sortable-table__cell[data-id="${id}"]`
    );

    allColumns.forEach((column) => {
      column.dataset.order = "";
    });

    currentColumn.dataset.order = order;
    this.subElements.body.innerHTML = this.getBody();
  }

  async loadData() {
    this.url.searchParams.set("_sort", this.sorted.id);
    this.url.searchParams.set("_order", this.sorted.order);
    this.url.searchParams.set("_start", this.start);
    this.url.searchParams.set("_end", this.end);
    return await fetchJson(this.url);
  }

  async update() {
    this.element.classList.add("sortable-table_loading");
    const data = await this.loadData();
    this.start += this.step;
    this.end += this.step;

    const rows = document.createElement("div");
    rows.innerHTML = this.getBody();
    this.subElements.body.append(...rows.childNodes);
    this.data = [...data, ...this.data];
    this.element.classList.remove("sortable-table_loading");
  }

  async render() {
    const element = document.createElement("div");
    element.innerHTML = this.table;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);

    this.data = await this.loadData();
    this.subElements.body.innerHTML = this.getBody();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElement = {};
    document.removeEventListener("pointerdown", this.sortClick);
    document.removeEventListener("scroll", this.scrollTable);
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

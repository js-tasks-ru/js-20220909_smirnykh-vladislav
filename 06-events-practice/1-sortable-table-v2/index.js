export default class SortableTable {
  element;
  subElement = {};

  constructor(
    headerConfig = [],
    {
      data = [],
      sorted = {
        id: headerConfig.find((item) => item.sortable).id,
        order: "asc",
      },
    } = {}
  ) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;

    this.render();
    this.initEventListeners()
  }

  sortClick = (event) => {
    const column = event.target.closest('[data-sortable="true"]');
    if (column){
      const order = column.dataset.order === "asc" ? "desc" : "asc";
      this.sort(column.dataset.id, order);
    }
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.sortClick);
  }

  getHeader() {
    return `
    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headerConfig
        .map((item) => {
          const order = this.sorted.id === item.id ? this.sorted.order : 'asc';
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
        if (item.hasOwnProperty("template")) {
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
      .join(" ");
  }

  get table() {
    return `<div class="sortable-table">
              ${this.getHeader()}
              <div data-element="body" class="sortable-table__body">
                ${this.getBody()}
              </div>
            </div>`;
  }

  sort(field, order = "asc") {
    const directions = {
      asc: 1,
      desc: -1,
    };
    const column = this.headerConfig.find((item) => {
      return item.id === field;
    });
    const direction = directions[order];

    if (column.sortType === "string") {
      this.data = this.data.sort((a, b) => {
        return direction * a[field].localeCompare(b[field], ["ru", "en"]);
      });
    } else if (column.sortType === "number") {
      this.data = this.data.sort((a, b) => {
        return direction * (b[field] - a[field]);
      });
    } else {
      throw new Error("Error sorting");
    }
    const allColumns = this.element.querySelectorAll(
      ".sortable-table__cell[data-id]"
    );
    const currentColumn = this.element.querySelector(
      `.sortable-table__cell[data-id="${field}"]`
    );

    allColumns.forEach((column) => {
      column.dataset.order = "";
    });

    currentColumn.dataset.order = order;
    this.subElements.body.innerHTML = this.getBody();
  }

  render() {
    const element = document.createElement("div");
    element.innerHTML = this.table;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);
    this.sort(this.sorted.id, this.sorted.order);
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
    this.subElements.header.removeEventListener('pointerdown', this.sortClick);
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

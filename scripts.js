document.addEventListener("DOMContentLoaded", () => {
  function setupGeneralEventListeners() {
    const themeToggle = document.getElementById("theme-toggle");
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.querySelector(".overlay");

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark-theme") {
      document.body.classList.add("dark-theme");
      if (themeToggle) themeToggle.checked = true;
    }

    if (themeToggle) {
      themeToggle.addEventListener("change", function () {
        document.body.classList.toggle("dark-theme");
        localStorage.setItem(
          "theme",
          this.checked ? "dark-theme" : "light-theme"
        );
      });
    }

    const toggleMenu = () => {
      sidebar.classList.toggle("show");
      overlay.classList.toggle("show");
    };

    if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", toggleMenu);
    if (overlay) overlay.addEventListener("click", toggleMenu);
  }

  function displayGreeting() {
    const greetingText = document.getElementById("greeting-text");
    if (!greetingText) return;

    const hour = new Date().getHours();
    let greeting = "Welcome Back";
    if (hour < 12) greeting = "Good morning";
    else if (hour < 18) greeting = "Good afternoon";
    else greeting = "Good evening";

    greetingText.innerHTML = `${greeting}, <span class="user-name">Ana</span>!`;
  }

  function initTransactionsPage() {
    const transactionTableBody = document.getElementById(
      "transaction-table-body"
    );
    if (!transactionTableBody) return;

    let allTransactions = [];
    let filteredTransactions = [];
    let currentPage = 1;
    const rowsPerPage = 10;

    const dom = {
      searchInput: document.getElementById("search-input"),
      typeFilter: document.getElementById("type-filter"),
      categoryFilter: document.getElementById("category-filter"),
      exportBtn: document.getElementById("export-btn"),
      paginationContainer: document.getElementById("pagination-container"),
      startDateInput: document.getElementById("start-date"),
      endDateInput: document.getElementById("end-date"),
      filterMonthBtn: document.getElementById("filter-month"),
      filter90DaysBtn: document.getElementById("filter-90-days"),
      totalIncomeEl: document.getElementById("total-income"),
      totalExpensesEl: document.getElementById("total-expenses"),
      netFlowEl: document.getElementById("net-flow"),
      modal: document.getElementById("details-modal"),
      modalBody: document.getElementById("modal-body"),
      modalCloseBtn: document.getElementById("modal-close-btn"),
    };

    const categoryIcons = {
      Food: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`,
      Bills: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,
      Travel: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h17l-4-4m0 8l4-4"></path><path d="M21 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18"></path></svg>`,
      Shopping: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
      Entertainment: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
      Income: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
      Other: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
    };

    function generateMockData() {
      const categories = [
        "Food",
        "Bills",
        "Travel",
        "Shopping",
        "Entertainment",
        "Other",
      ];
      const descriptions = {
        Food: ["Groceries", "Coffee Shop", "Restaurant"],
        Bills: ["Monthly Rent", "Internet Bill", "Phone Bill"],
        Travel: ["Flight Tickets", "Hotel Booking", "Uber Ride"],
        Shopping: ["Amazon Purchase", "Clothing Store"],
        Entertainment: ["Movie Tickets", "Spotify"],
        Other: ["Pharmacy", "Bookstore"],
      };

      for (let i = 0; i < 105; i++) {
        const isIncome = Math.random() > 0.85;
        const category = isIncome
          ? "Income"
          : categories[Math.floor(Math.random() * categories.length)];
        const description = isIncome
          ? "Client Payment"
          : descriptions[category][
              Math.floor(Math.random() * descriptions[category].length)
            ];
        const amount = isIncome
          ? Math.random() * 2000 + 500
          : Math.random() * 200 + 5;
        const date = new Date();
        date.setDate(date.getDate() - i);
        const status = Math.random() > 0.1 ? "Completed" : "Pending";
        allTransactions.push({
          id: `tx_${i}`,
          date,
          description,
          category,
          type: isIncome ? "income" : "expense",
          amount,
          status,
        });
      }
      filteredTransactions = [...allTransactions];
    }

    function renderTable() {
      transactionTableBody.innerHTML = "";
      const startIndex = (currentPage - 1) * rowsPerPage;
      const paginatedItems = filteredTransactions.slice(
        startIndex,
        startIndex + rowsPerPage
      );

      paginatedItems.forEach((tx) =>
        transactionTableBody.appendChild(createTableRow(tx))
      );

      updateSummaryCards();
      renderPagination();
    }

    function createTableRow(tx) {
      const row = document.createElement("tr");
      row.dataset.transactionId = tx.id;
      const isIncome = tx.type === "income";
      const icon = categoryIcons[tx.category] || categoryIcons["Other"];

      row.innerHTML = `
                <td>${tx.date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}</td>
                <td class="description-cell"><div class="transaction-icon ${
                  isIncome ? "income" : "expense"
                }">${icon}</div>${tx.description}</td>
                <td>${tx.category}</td>
                <td class="amount ${isIncome ? "income" : "expense"}">${
        isIncome ? "+" : "-"
      }${tx.amount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })}</td>
                <td><span class="status-pill ${tx.status.toLowerCase()}">${
        tx.status
      }</span></td>
            `;
      return row;
    }

    function updateSummaryCards() {
      const totalIncome = filteredTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = filteredTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
      const netFlow = totalIncome - totalExpenses;

      dom.totalIncomeEl.textContent = totalIncome.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      dom.totalExpensesEl.textContent = totalExpenses.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      dom.netFlowEl.textContent = netFlow.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    }

    function renderPagination() {
      dom.paginationContainer.innerHTML = "";
      const pageCount = Math.ceil(filteredTransactions.length / rowsPerPage);
      if (pageCount <= 1) return;

      const pageInfo = document.createElement("div");
      pageInfo.className = "pagination-info";
      pageInfo.innerText = `Page ${currentPage} of ${pageCount}`;

      const controls = document.createElement("div");
      controls.className = "pagination-controls";

      const prevButton = document.createElement("button");
      prevButton.innerText = "Previous";
      prevButton.disabled = currentPage === 1;
      prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          renderTable();
        }
      });

      const nextButton = document.createElement("button");
      nextButton.innerText = "Next";
      nextButton.disabled = currentPage === pageCount;
      nextButton.addEventListener("click", () => {
        if (currentPage < pageCount) {
          currentPage++;
          renderTable();
        }
      });

      controls.append(prevButton, nextButton);
      dom.paginationContainer.append(pageInfo, controls);
    }

    function applyFilters() {
      const searchTerm = dom.searchInput.value.toLowerCase();
      const type = dom.typeFilter.value;
      const category = dom.categoryFilter.value;
      const startDate = dom.startDateInput.value
        ? new Date(dom.startDateInput.value)
        : null;
      const endDate = dom.endDateInput.value
        ? new Date(dom.endDateInput.value)
        : null;

      if (startDate) startDate.setHours(0, 0, 0, 0);
      if (endDate) endDate.setHours(23, 59, 59, 999);

      filteredTransactions = allTransactions.filter((tx) => {
        const searchMatch = tx.description.toLowerCase().includes(searchTerm);
        const typeMatch = type === "all" || tx.type === type;
        const categoryMatch = category === "all" || tx.category === category;
        const dateMatch =
          (!startDate || tx.date >= startDate) &&
          (!endDate || tx.date <= endDate);
        return searchMatch && typeMatch && categoryMatch && dateMatch;
      });

      currentPage = 1;
      renderTable();
    }

    function setupEventListeners() {
      const filters = [
        dom.searchInput,
        dom.typeFilter,
        dom.categoryFilter,
        dom.startDateInput,
        dom.endDateInput,
      ];
      filters.forEach((el) => el.addEventListener("input", applyFilters));

      dom.filterMonthBtn.addEventListener("click", () => {
        const end = new Date();
        const start = new Date(end.getFullYear(), end.getMonth(), 1);
        dom.startDateInput.valueAsDate = start;
        dom.endDateInput.valueAsDate = end;
        applyFilters();
      });

      dom.filter90DaysBtn.addEventListener("click", () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 90);
        dom.startDateInput.valueAsDate = start;
        dom.endDateInput.valueAsDate = end;
        applyFilters();
      });

      transactionTableBody.addEventListener("click", (e) => {
        const row = e.target.closest("tr");
        if (row) {
          const tx = filteredTransactions.find(
            (t) => t.id === row.dataset.transactionId
          );
          if (tx) showTransactionModal(tx);
        }
      });

      dom.modalCloseBtn.addEventListener("click", hideModal);
      dom.modal.addEventListener("click", (e) => {
        if (e.target === dom.modal) hideModal();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") hideModal();
      });
      dom.exportBtn.addEventListener("click", exportToCsv);
    }

    function showTransactionModal(tx) {
      dom.modalBody.innerHTML = `
                <div class="detail-row"><span class="label">Description</span><span class="value">${
                  tx.description
                }</span></div>
                <div class="detail-row"><span class="label">Amount</span><span class="value ${
                  tx.type
                }">${
        tx.type === "income" ? "+" : "-"
      }${tx.amount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })}</span></div>
                <div class="detail-row"><span class="label">Date</span><span class="value">${tx.date.toLocaleString()}</span></div>
                <div class="detail-row"><span class="label">Category</span><span class="value">${
                  tx.category
                }</span></div>
                <div class="detail-row"><span class="label">Status</span><span class="value"><span class="status-pill ${tx.status.toLowerCase()}">${
        tx.status
      }</span></span></div>
                <div class="detail-row"><span class="label">Transaction ID</span><span class="value">${
                  tx.id
                }</span></div>
            `;
      dom.modal.classList.add("show");
    }

    function hideModal() {
      dom.modal.classList.remove("show");
    }

    function exportToCsv() {
      const headers = [
        "Date",
        "Description",
        "Category",
        "Amount",
        "Type",
        "Status",
      ];
      const rows = filteredTransactions.map((tx) =>
        [
          `"${tx.date.toLocaleDateString()}"`,
          `"${tx.description}"`,
          tx.category,
          tx.amount,
          tx.type,
          tx.status,
        ].join(",")
      );
      const csvContent =
        "data:text/csv;charset=utf-8," +
        headers.join(",") +
        "\n" +
        rows.join("\n");
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", "transactions.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    generateMockData();
    renderTable();
    setupEventListeners();
  }

  setupGeneralEventListeners();
  displayGreeting();
  initTransactionsPage();
});

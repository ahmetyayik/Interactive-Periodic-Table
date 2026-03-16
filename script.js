//(API URL)
const API_URL =
  "https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json";

//VERİYİ GETİRME FONKSİYONU
function loadPeriodicTable() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      const elements = data.elements; // 118 elementlik listeyi al
      buildTable(elements);
    })
    .catch((error) => console.error("Veri çekilirken hata oluştu:", error));
}

// ELEMENTLERİ EKRANA DİZME
function buildTable(elements) {
  const container = document.getElementById("periodic-table-container");

  elements.forEach((element) => {
    const card = document.createElement("div");
    card.classList.add("element-card");

    const categoryClass = element.category.replace(/ /g, "-").toLowerCase();
    card.classList.add(categoryClass);

    //Elementi tablodaki doğru satır ve sütuna yerleştir
    card.style.gridColumn = element.xpos;
    card.style.gridRow = element.ypos;

    // Kutunun içine Atom Numarası ve Sembolü yaz
    card.innerHTML = `
            <div class="small text-muted">${element.number}</div>
            <div class="symbol fs-4 fw-bold">${element.symbol}</div>
        `;

    // Kutuya tıklama özelliği
    card.addEventListener("click", () => {
      showElementDetails(
        element.name,
        element.symbol,
        element.number,
        element.atomic_mass,
        element.category,
        element.discovered_by || "Unknown",
        element.summary,
      );
    });

    container.appendChild(card);
  });
}

// (MODAL) GÖRÜNÜR YAPAN VE İÇİNİ DOLDURAN FONKSİYON
function showElementDetails(
  name,
  symbol,
  number,
  mass,
  category,
  discovery,
  summary,
) {
  document.getElementById("modalTitle").innerText = name;
  document.getElementById("modalSymbol").innerText = symbol;
  document.getElementById("modalNumber").innerText = number;
  document.getElementById("modalMass").innerText = mass;
  document.getElementById("modalCategory").innerText = category;
  document.getElementById("modalDiscovery").innerText = discovery;
  document.getElementById("modalSummary").innerText = summary;

  const elementModal = new bootstrap.Modal(
    document.getElementById("elementModal"),
  );
  elementModal.show();
}

//SAYFA AÇILDIĞINDA SİSTEMİ ÇALIŞTIR
loadPeriodicTable();

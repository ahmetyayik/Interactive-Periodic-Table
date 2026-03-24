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

let favoriler = JSON.parse(localStorage.getItem("kimyaFavoriler")) || [];
let seciliElementSembolu = ""; // Hangi elementin modalı açık tutmak için

// ELEMENTLERİ EKRANA DİZME
function buildTable(elements) {
  const container = document.getElementById("periodic-table-container");

  elements.forEach((element) => {
    const card = document.createElement("div");
    card.classList.add("element-card");
    const categoryClass = element.category.replace(/ /g, "-").toLowerCase();
    card.classList.add(categoryClass);
    card.dataset.category = categoryClass;

    card.dataset.name = element.name.toLowerCase();
    card.dataset.symbol = element.symbol.toLowerCase();

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

  seciliElementSembolu = symbol.toLowerCase(); // Sembolü hafızaya al
  const favBtn = document.getElementById("modalFavoriteBtn");

  // Eğer bu element zaten favorilerde varsa, butonu "Çıkar" yap
  if (favoriler.includes(seciliElementSembolu)) {
    favBtn.innerText = "⭐ Discard Favorites";
    favBtn.classList.replace("btn-warning", "btn-danger");
  } else {
    favBtn.innerText = "⭐ Add Favorites";
    favBtn.classList.replace("btn-danger", "btn-warning");
  }

  const elementModal = new bootstrap.Modal(
    document.getElementById("elementModal"),
  );
  elementModal.show();
}

//SAYFA AÇILDIĞINDA SİSTEMİ ÇALIŞTIR
loadPeriodicTable();

// ARAMA MOTORU
document
  .getElementById("searchInput")
  .addEventListener("input", function (event) {
    const arananKelime = event.target.value.toLowerCase();
    const butunKartlar = document.querySelectorAll(".element-card");
    butunKartlar.forEach((kart) => {
      const elementAdi = kart.dataset.name;
      const elementSembolu = kart.dataset.symbol;

      // Eğer yazılan harfler elementin adında VEYA sembolünde varsa:
      if (
        elementAdi.includes(arananKelime) ||
        elementSembolu.includes(arananKelime)
      ) {
        kart.style.opacity = "1"; // Parlat
        kart.style.transform = "scale(1)"; // Normal boyutta tut
      } else {
        // Eğer eşleşmiyorsa:
        kart.style.opacity = "0.1"; // Gölge gibi yap (Saydamlaştır)
        kart.style.transform = "scale(0.95)"; // Hafifçe küçült
      }
    });
  });

// KATEGORİ FİLTRELEME
const filterButtons = document.querySelectorAll("#filter-buttons button");

filterButtons.forEach((button) => {
  button.addEventListener("click", function () {
    //Tıklanan butonun "data-filter" değerini al
    const secilenKategori = this.dataset.filter;
    const butunKartlar = document.querySelectorAll(".element-card");
    butunKartlar.forEach((kart) => {
      if (
        secilenKategori === "all" ||
        kart.dataset.category === secilenKategori
      ) {
        kart.style.opacity = "1"; // Işıkları yak
        kart.style.transform = "scale(1)"; // Normal boyuta getir
      } else {
        // Eşleşmeyen elementlerin ışığını kıs
        kart.style.opacity = "0.1";
        kart.style.transform = "scale(0.95)";
      }
    });
  });
});

// MODAL İÇİNDEKİ YILDIZ BUTONUNA TIKLANINCA YAPILACAKLAR
document
  .getElementById("modalFavoriteBtn")
  .addEventListener("click", function () {
    // Eğer element zaten listedeyse, listeden at
    if (favoriler.includes(seciliElementSembolu)) {
      favoriler = favoriler.filter((sembol) => sembol !== seciliElementSembolu);
      this.innerText = "⭐ Add Favorites";
      this.classList.replace("btn-danger", "btn-warning");
    } else {
      // Eğer listede yoksa, listeye ekle
      favoriler.push(seciliElementSembolu);
      this.innerText = "⭐ Discard Favorites";
      this.classList.replace("btn-warning", "btn-danger");
    }

    // Değişen listeyi tarayıcının çekmecesine (localStorage) geri koy
    localStorage.setItem("kimyaFavoriler", JSON.stringify(favoriler));
  });

// ANA SAYFADAKİ "FAVORİLERİM" TIKLANINCA YAPILACAKLAR
document.getElementById("btn-favorites").addEventListener("click", function () {
  const butunKartlar = document.querySelectorAll(".element-card");

  butunKartlar.forEach((kart) => {
    // Eğer kartın sembolü favoriler listemizin içinde geçiyorsa parlat, yoksa karart
    if (favoriler.includes(kart.dataset.symbol)) {
      kart.style.opacity = "1";
      kart.style.transform = "scale(1)";
    } else {
      kart.style.opacity = "0.1";
      kart.style.transform = "scale(0.95)";
    }
  });
});

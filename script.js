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

  // Show the modal using Bootstrap's API
  const elementModal = new bootstrap.Modal(
    document.getElementById("elementModal"),
  );
  elementModal.show();
}

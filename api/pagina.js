export default async function handler(req, res) {
  try {
    const response = await fetch("https://fragaebitelloconsorcios.com.br/api/json/contemplados");
    const data = await response.json();

    const disponiveis = data.filter(item =>
      !item.status || item.status.toLowerCase() === "disponivel"
    );

    disponiveis.sort((a, b) => {
      const valorA = parseFloat(a.valor_credito) || 0;
      const valorB = parseFloat(b.valor_credito) || 0;
      return valorA - valorB;
    });

    function removerAcentos(texto = "") {
      return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function getIcon(categoria = "") {
      const cat = removerAcentos(categoria.toLowerCase());

      if (cat.includes("imovel")) return "🏠";
      if (cat.includes("veiculo")) return "🚗";
      if (cat.includes("servico")) return "🛠️";
      if (cat.includes("maquina")) return "🏗️";
      return "💳";
    }

    let cards = "";

    disponiveis.forEach(item => {

      const mensagem = encodeURIComponent(
        `Olá, tenho interesse na carta ${item.id || ""} no valor de ${item.valor_credito_fmt || item.valor_credito}. Pode me enviar detalhes?`
      );

      const categoria = item.categoria || "Carta disponível";
      const icon = getIcon(categoria);

      cards += `
        <div class="carta-card">
          <div class="carta-topo">
            <span class="carta-icone">${icon}</span>
            <strong>${categoria}</strong>
          </div>

          <div class="carta-valor">
            ${item.valor_credito_fmt || item.valor_credito}
          </div>

          <div class="carta-info">
            <span>Entrada: ${item.entrada_fmt || item.entrada || "-"}</span>
            <span>Parcelas: ${item.parcelas || "-"}</span>
          </div>

          <a class="carta-botao"
            href="https://wa.me/5534991960400?text=${mensagem}"
            target="_blank">
            Solicitar detalhes
          </a>
        </div>
      `;
    });

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(cards);

  } catch (error) {
    res.status(200).send("<p>Estamos atualizando as oportunidades.</p>");
  }
}

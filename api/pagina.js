export default async function handler(req, res) {
  try {
    const response = await fetch("https://fragaebitelloconsorcios.com.br/api/json/contemplados");
    const data = await response.json();

    // Função para limpar acentos e espaços, evitando que as cartas sumam
    function padronizarTexto(texto) {
      if (!texto) return "";
      return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
    }

    // FILTRO CORRIGIDO:
    const disponiveis = data.filter(item => {
      // Se não vier status nenhum na API, assumimos que está disponível
      if (!item.status) return true; 
      
      // Limpa a palavra para garantir que "Disponível" com acento seja reconhecido
      const statusLimpo = padronizarTexto(item.status);
      return statusLimpo === "disponivel";
    });

    disponiveis.sort((a, b) => {
      const valorA = parseFloat(a.valor_credito) || 0;
      const valorB = parseFloat(b.valor_credito) || 0;
      return valorA - valorB;
    });

    function getIcon(categoria = "") {
      const cat = padronizarTexto(categoria);
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
      const administradora = item.administradora || "Sob consulta";
      
      // Busca o valor da parcela e a quantidade
      const valorParcela = item.valor_parcela_fmt || item.valor_parcela || "-";
      const quantidadeParcelas = item.parcelas || "";
      
      const icon = getIcon(categoria);

      cards += `
        <div class="item">
          <div class="info">
            <div class="titulo">
              <span class="icone">${icon}</span>
              <div>
                <strong>${categoria}</strong><br>
                <small style="color: #888; font-size: 11px; text-transform: uppercase;">${administradora}</small>
              </div>
            </div>

            <div class="valor">
              ${item.valor_credito_fmt || item.valor_credito}
            </div>

            <div class="detalhes">
              <span>Entrada: <strong>Consultar</strong></span>
              <span>Parcelas: ${quantidadeParcelas}x de <strong>${valorParcela}</strong></span>
            </div>
          </div>

          <div class="acao">
            <a class="botao"
              href="https://wa.me/5534991960400?text=${mensagem}"
              target="_blank">
              Solicitar detalhes
            </a>
          </div>
        </div>
      `;
    });

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Oportunidades Disponíveis</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f6f8; padding: 30px; margin: 0; }
        h2 { margin-bottom: 8px; }
        .contador { margin-bottom: 22px; color: #555; font-size: 14px; }
        .topo { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 25px; }
        input { padding: 10px 12px; border-radius: 8px; border: 1px solid #ccc; flex: 1; min-width: 200px; font-size: 14px; }
        button { padding: 10px 16px; border: none; border-radius: 8px; background: black; color: white; cursor: pointer; font-size: 14px; }
        .lista .item { display: flex; justify-content: space-between; align-items: center; background: white; padding: 24px 28px; border-radius: 14px; margin-bottom: 16px; box-shadow: 0 5px 15px rgba(0,0,0,0.06); gap: 30px; font-size: 14px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 22px; }
        .grid .item { background: white; padding: 26px; border-radius: 14px; box-shadow: 0 6px 18px rgba(0,0,0,0.06); font-size: 14px; display: flex; flex-direction: column; justify-content: space-between; }
        .titulo { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .icone { font-size: 20px; }
        .valor { font-size: 20px; font-weight: bold; margin: 12px 0 14px 0; }
        .detalhes { display: flex; gap: 20px; flex-wrap: wrap; font-size: 13px; color: #555; }
        .detalhes strong { color: #000; }
        .botao { background: black; color: white; padding: 12px 20px; border-radius: 10px; text-decoration: none; font-weight: bold; white-space: nowrap; margin-top: 20px; display: block; text-align: center; }
      </style>
      <script>
        function alternarVisualizacao() {
          const container = document.getElementById("container");
          container.classList.toggle("lista");
          container.classList.toggle("grid");
        }
        function buscar() {
          const termo = document.getElementById("busca").value.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase();
          const itens = document.querySelectorAll(".item");
          itens.forEach(item => {
            const texto = item.innerText.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase();
            item.style.display = texto.includes(termo) ? "" : "none";
          });
        }
      </script>
    </head>
    <body>
      <h2>Oportunidades Disponíveis</h2>
      <div class="contador">${disponiveis.length} cartas 100% disponíveis no momento</div>
      <div class="topo">
        <input type="text" id="busca" onkeyup="buscar()" placeholder="Filtrar por administradora, crédito ou tipo...">
        <button onclick="alternarVisualizacao()">Mudar Visualização</button>
      </div>
      <div id="container" class="lista">
        ${cards}
      </div>
    </body>
    </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (error) {
    res.status(200).send("<h2>O sistema está sendo atualizado. Por favor, tente em alguns instantes.</h2>");
  }
}

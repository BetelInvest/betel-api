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
        <div class="item">
          <div class="info">
            <div class="titulo">
              <span class="icone">${icon}</span>
              <strong>${categoria}</strong>
            </div>
            <div class="valor">${item.valor_credito_fmt || item.valor_credito}</div>
            <div class="detalhes">
              <span>Entrada: ${item.entrada_fmt || item.entrada || "-"}</span>
              <span>Parcelas: ${item.parcelas || "-"}</span>
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
        body {
          font-family: Arial, sans-serif;
          background: #f4f6f8;
          padding: 25px;
          margin: 0;
        }

        h2 {
          margin-bottom: 5px;
        }

        .contador {
          margin-bottom: 20px;
          color: #555;
          font-size: 14px;
        }

        .topo {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }

        input {
          padding: 8px 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          flex: 1;
          min-width: 200px;
          font-size: 14px;
        }

        button {
          padding: 8px 14px;
          border: none;
          border-radius: 6px;
          background: black;
          color: white;
          cursor: pointer;
          font-size: 14px;
        }

        .lista .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 18px 22px;
          border-radius: 12px;
          margin-bottom: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          gap: 20px;
          font-size: 14px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }

        .grid .item {
          background: white;
          padding: 22px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          font-size: 14px;
        }

        .titulo {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .icone {
          font-size: 18px;
        }

        .valor {
          font-size: 18px;
          font-weight: bold;
          margin: 6px 0;
        }

        .detalhes {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          font-size: 13px;
          color: #555;
          margin-top: 4px;
        }

        .acao {
          display: flex;
          align-items: center;
        }

        .botao {
          background: black;
          color: white;
          padding: 10px 16px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          white-space: nowrap;
        }
      </style>

      <script>
        function alternarVisualizacao() {
          const container = document.getElementById("container");
          container.classList.toggle("lista");
          container.classList.toggle("grid");
        }

        function removerAcentos(texto) {
          return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }

        function buscar() {
          const termo = removerAcentos(
            document.getElementById("busca").value.toLowerCase()
          );

          const itens = document.querySelectorAll(".item");

          itens.forEach(item => {
            const texto = removerAcentos(item.innerText.toLowerCase());
            item.style.display = texto.includes(termo) ? "flex" : "none";
          });
        }
      </script>
    </head>

    <body>

      <h2>Oportunidades Disponíveis</h2>
      <div class="contador">${disponiveis.length} oportunidades encontradas</div>

      <div class="topo">
        <input type="text" id="busca" onkeyup="buscar()" placeholder="Buscar por valor ou categoria">
        <button onclick="alternarVisualizacao()">Alternar visualização</button>
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
    res.status(200).send("<h2>Estamos atualizando as oportunidades.</h2>");
  }
}

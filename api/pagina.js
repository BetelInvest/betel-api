export default async function handler(req, res) {
  try {
    const response = await fetch("https://fragaebitelloconsorcios.com.br/api/json/contemplados");
    const data = await response.json();

    // Filtrar somente disponíveis (ajuste se o campo for diferente)
    const disponiveis = data.filter(item =>
      !item.status || item.status.toLowerCase() === "disponivel"
    );

    // Ordenar por valor crescente
    disponiveis.sort((a, b) => {
      const valorA = parseFloat(a.valor_credito) || 0;
      const valorB = parseFloat(b.valor_credito) || 0;
      return valorA - valorB;
    });

    let cards = "";

    disponiveis.forEach(item => {

      const mensagem = encodeURIComponent(
        `Olá, tenho interesse na carta ${item.id || ""} no valor de ${item.valor_credito_fmt || item.valor_credito}. Pode me enviar detalhes?`
      );

      cards += `
        <div class="item">
          <div class="info">
            <strong>${item.categoria || "Carta disponível"}</strong>
            <div class="valor">${item.valor_credito_fmt || item.valor_credito}</div>
            <div>Entrada: ${item.entrada_fmt || item.entrada || "-"}</div>
            <div>Parcelas: ${item.parcelas || "-"}</div>
          </div>
          <div>
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
          padding: 30px;
          margin: 0;
        }

        h2 {
          margin-bottom: 10px;
        }

        .contador {
          margin-bottom: 20px;
          color: #555;
        }

        .topo {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 25px;
        }

        input {
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          flex: 1;
          min-width: 200px;
        }

        button {
          padding: 10px 15px;
          border: none;
          border-radius: 6px;
          background: black;
          color: white;
          cursor: pointer;
        }

        .lista .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          flex-wrap: wrap;
          gap: 15px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .grid .item {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }

        .valor {
          font-size: 20px;
          font-weight: bold;
          margin: 8px 0;
        }

        .botao {
          display: inline-block;
          margin-top: 12px;
          background: black;
          color: white;
          padding: 10px 15px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
        }
      </style>

      <script>
        function alternarVisualizacao() {
          const container = document.getElementById("container");
          if (container.classList.contains("lista")) {
            container.classList.remove("lista");
            container.classList.add("grid");
          } else {
            container.classList.remove("grid");
            container.classList.add("lista");
          }
        }

        function buscar() {
          const termo = document.getElementById("busca").value.toLowerCase();
          const itens = document.querySelectorAll(".item");

          itens.forEach(item => {
            const texto = item.innerText.toLowerCase();
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
        <button onclick="alternarVisualizacao()">Alternar Lista/Grid</button>
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

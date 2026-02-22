export default async function handler(req, res) {
  try {
    const response = await fetch("https://fragaebitelloconsorcios.com.br/api/json/contemplados");
    const data = await response.json();

    let cards = "";

    data.forEach(item => {

  const mensagem = encodeURIComponent(
    `Olá, tenho interesse na carta ${item.id || ""} no valor de ${item.valor_credito || ""}. Pode me enviar detalhes?`
  );

  cards += `
    <div class="card">
      <h3>${item.categoria || "Carta disponível"}</h3>
      <div class="valor">${item.valor_credito_fmt || item.valor_credito}</div>
      <p>Entrada: ${item.entrada_fmt || item.entrada}</p>
      <p>Parcelas: ${item.parcelas}</p>
      <a class="botao"
        href="https://wa.me/5534991960400?text=${mensagem}"
        target="_blank">
        Solicitar detalhes
      </a>
    </div>
  `;
});

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f5f5f5;
          padding: 40px;
          margin: 0;
        }

        h2 {
          margin-bottom: 30px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 25px;
        }

        .card {
          background: white;
          padding: 25px;
          border-radius: 14px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
        }

        .valor {
          font-size: 22px;
          font-weight: bold;
          margin: 10px 0;
        }

        .botao {
          display: block;
          margin-top: 20px;
          text-align: center;
          background: black;
          color: white;
          padding: 12px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
        }
      </style>
    </head>
    <body>

      <h2>Oportunidades Disponíveis</h2>

      <div class="grid">
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

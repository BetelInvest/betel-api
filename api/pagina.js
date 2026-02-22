export default async function handler(req, res) {
  try {
    const response = await fetch("https://fragaebitelloconsorcios.com.br/api/json/contemplados");
    const data = await response.json();

    let linhas = "";

    data
      .filter(item => !item.reserva || item.reserva !== "Reservado")
      .forEach(item => {

        const mensagem = encodeURIComponent(
          `Olá, tenho interesse na carta ${item.id || ""} no valor de ${item.valor_credito || ""}. Pode me enviar detalhes?`
        );

        linhas += `
          <div class="linha">
            <div>${item.categoria || "Carta"}</div>
            <div class="valor">${item.valor_credito_fmt || item.valor_credito}</div>
            <div>${item.entrada_fmt || item.entrada}</div>
            <div>${item.parcelas}x</div>
            <div>
              <a href="https://wa.me/5534991960400?text=${mensagem}" target="_blank">
                WhatsApp
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
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f5f5f5;
          padding: 40px;
          margin: 0;
        }

        h2 {
          margin-bottom: 25px;
        }

        .tabela {
          width: 100%;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
        }

        .header, .linha {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr 0.8fr 1fr;
          padding: 15px;
          align-items: center;
        }

        .header {
          background: #000;
          color: white;
          font-weight: bold;
        }

        .linha {
          border-bottom: 1px solid #eee;
          font-size: 14px;
        }

        .linha:hover {
          background: #f9f9f9;
        }

        .valor {
          font-weight: bold;
        }

        a {
          background: black;
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 13px;
        }

        @media (max-width: 768px) {
          .header {
            display: none;
          }

          .linha {
            grid-template-columns: 1fr;
            gap: 6px;
            padding: 18px;
          }

          .linha div {
            font-size: 14px;
          }
        }
      </style>
    </head>
    <body>

      <h2>Oportunidades Disponíveis</h2>

      <div class="tabela">
        <div class="header">
          <div>Categoria</div>
          <div>Crédito</div>
          <div>Entrada</div>
          <div>Parcelas</div>
          <div></div>
        </div>

        ${linhas}
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

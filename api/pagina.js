export default function handler(req, res) {

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

      <div class="card">
        <h3>Imóvel</h3>
        <div class="valor">R$ 500.000</div>
        <p>Entrada: R$ 120.000</p>
        <p>Parcelas: 120x</p>
        <a class="botao" href="https://wa.me/55SEUNUMERO?text=Tenho%20interesse%20na%20carta%20de%20500mil" target="_blank">
          Solicitar detalhes
        </a>
      </div>

      <div class="card">
        <h3>Veículo</h3>
        <div class="valor">R$ 150.000</div>
        <p>Entrada: R$ 40.000</p>
        <p>Parcelas: 60x</p>
        <a class="botao" href="https://wa.me/55SEUNUMERO?text=Tenho%20interesse%20na%20carta%20de%20150mil" target="_blank">
          Solicitar detalhes
        </a>
      </div>

    </div>

  </body>
  </html>
  `;

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}

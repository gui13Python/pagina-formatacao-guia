const fs = require('fs');
const https = require('https');

// URL pública de fallback que o Adcash usa para disponibilizar os scripts das zonas
const zoneId = 'nk1hyvs8wv';
const url = `https://platform.adcash.com/script/source.php?zone=${zoneId}`;

// Altere para './public/adcash-zone.js' se você usa Next.js ou Vite. 
// Deixe './adcash-zone.js' se for um site HTML simples na raiz.
const outputPath = './adcash-zone.js'; 

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    if (data && data.length > 100) { // Garante que não veio um arquivo vazio
      fs.writeFileSync(outputPath, data);
      console.log('Script do Adcash atualizado com sucesso!');
    } else {
      console.error('Erro: Resposta inválida ou vazia do Adcash.');
    }
  });
}).on('error', (err) => {
  console.error('Erro na requisição:', err.message);
});

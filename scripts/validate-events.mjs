// Valida os JSON Schemas de events/ (draft 2020-12) e os exemplos em events/examples/.
// Cada schema events/<tipo>.v<N>.json precisa de $id e "dataschema" apontando para o próprio arquivo;
// *.valid.json tem que passar e *.invalid.json tem que falhar contra o schema de mesmo nome.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const PASTA_EVENTOS = 'events';
const PASTA_EXEMPLOS = join(PASTA_EVENTOS, 'examples');
const URL_BASE = 'https://raw.githubusercontent.com/SeniorInsight-Project/si-contracts/main/events/';
const NOME_SCHEMA = /^[a-z]+(\.[a-z]+)+\.v[0-9]+\.json$/;

const ajv = new Ajv2020({ strict: true, allErrors: true });
addFormats(ajv);

const lerJson = (caminho) => JSON.parse(readFileSync(caminho, 'utf8'));
const erros = [];
const validadores = new Map();

for (const arquivo of readdirSync(PASTA_EVENTOS).filter((nome) => nome.endsWith('.json'))) {
  if (!NOME_SCHEMA.test(arquivo)) {
    erros.push(`${arquivo}: nome fora do padrão <entidade>.<acao>.v<N>.json`);
    continue;
  }
  const schema = lerJson(join(PASTA_EVENTOS, arquivo));
  const urlEsperada = URL_BASE + arquivo;
  const tipoEsperado = arquivo.replace(/\.v[0-9]+\.json$/, '');

  if (schema.$id !== urlEsperada) erros.push(`${arquivo}: $id deve ser ${urlEsperada}`);
  if (schema.properties?.dataschema?.const !== urlEsperada) erros.push(`${arquivo}: dataschema deve ser ${urlEsperada}`);
  if (schema.properties?.type?.const !== tipoEsperado) erros.push(`${arquivo}: type deve ser ${tipoEsperado}`);
  if (schema.properties?.specversion?.const !== '1.0') erros.push(`${arquivo}: specversion deve ser 1.0`);

  try {
    validadores.set(arquivo, ajv.compile(schema));
    console.log(`ok      ${arquivo}`);
  } catch (e) {
    erros.push(`${arquivo}: schema inválido: ${e.message}`);
  }
}

for (const arquivo of readdirSync(PASTA_EXEMPLOS).filter((nome) => nome.endsWith('.json'))) {
  const [, schema, esperado] = arquivo.match(/^(.+\.v[0-9]+)\.(valid|invalid)\.json$/) ?? [];
  const validar = schema && validadores.get(`${schema}.json`);
  if (!validar) {
    erros.push(`examples/${arquivo}: sem schema correspondente (use <schema>.valid.json ou <schema>.invalid.json)`);
    continue;
  }
  const passou = validar(lerJson(join(PASTA_EXEMPLOS, arquivo)));
  if (passou === (esperado === 'valid')) {
    console.log(`ok      examples/${arquivo} (${esperado})`);
  } else {
    erros.push(`examples/${arquivo}: esperado ${esperado}, ${passou ? 'passou' : `falhou: ${ajv.errorsText(validar.errors)}`}`);
  }
}

if (validadores.size === 0) erros.push('nenhum schema encontrado em events/');

if (erros.length > 0) {
  erros.forEach((erro) => console.error(`ERRO    ${erro}`));
  process.exit(1);
}

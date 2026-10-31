# si-contracts

Contratos compartilhados do SeniorInsight: especificações OpenAPI dos serviços e JSON Schemas dos eventos (CloudEvents) publicados no RabbitMQ (exchange `si.events`).

Branches: `main` (principal) e `develop` (testes).

## Conteúdo

| Caminho | O que tem |
|---|---|
| `openapi/care-v1.yaml` | care-service: idosos, comorbidades, contatos de emergência, convites e rede de proteção, rotinas de medicação e SOS |
| `openapi/identity-v1.yaml` | identity-service: perfil do usuário (`/v1/me`) e pareamento do idoso por código/QR |
| `openapi/notification-v1.yaml` | notification-service: token de push do aparelho e confirmação de leitura |
| `events/<tipo>.v<N>.json` | JSON Schema (draft 2020-12) do evento no envelope CloudEvents 1.0 |
| `events/examples/` | Exemplos válidos e inválidos de cada evento, verificados no CI |
| `generated/ts/` | Tipos TypeScript gerados dos OpenAPI (openapi-typescript). Não edite à mão |

## Eventos

Cada evento é publicado em modo estruturado do CloudEvents 1.0, com o `type` como routing key na exchange `si.events`. A versão fica no nome do arquivo e o campo `dataschema` do evento aponta para ele:

| `type` | Produtor | Schema |
|---|---|---|
| `user.created` | identity-service | [`events/user.created.v1.json`](events/user.created.v1.json) |
| `sos.updated` | care-service | [`events/sos.updated.v1.json`](events/sos.updated.v1.json) |

Mudança incompatível no `data` gera um arquivo novo (`.v2.json`); o `.v1` continua até os consumidores migrarem. Os consumidores deduplicam pelo `id` (entrega "pelo menos uma vez").

## Usando os tipos no app

```bash
npm install --save-dev github:SeniorInsight-Project/si-contracts#main
```

```ts
import type { Care, Identity } from '@seniorinsight/contracts';

type Idoso = Care.components['schemas']['Idoso'];
type Perfil = Identity.components['schemas']['Perfil'];
```

Os tipos `paths` de cada serviço também servem para clientes tipados como o `openapi-fetch`.

## Validando eventos no back

Os schemas são JSON Schema draft 2020-12 comuns: no Java, por exemplo, com `com.networknt:json-schema-validator` (`SpecVersion.VersionFlag.V202012`), carregando o arquivo de `events/` correspondente ao `dataschema` do evento.

## Desenvolvimento

Pré-requisito: Node.js 20+.

```bash
npm ci
npm run generate        # regenera generated/ts a partir dos OpenAPI
npm run validate        # lint dos OpenAPI, schemas e exemplos de eventos e typecheck dos tipos
```

Ao mudar um OpenAPI, rode `npm run generate` e commite os arquivos gerados junto: o CI falha se `generated/` estiver desatualizado.

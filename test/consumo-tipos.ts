// Garante que os tipos gerados podem ser importados como o app vai importar. Roda em `npm run typecheck`.
import type { Care, Identity, Notification, Report, Telemetry } from '../generated/ts/index.js';

type Idoso = Care.components['schemas']['Idoso'];
type DispararSos = Care.paths['/api/v1/idosos/{idosoId}/sos']['post'];
type Perfil = Identity.components['schemas']['Perfil'];
type RegistrarTokenPush = Notification.components['schemas']['RegistrarTokenPushRequest'];

const idoso: Pick<Idoso, 'id' | 'nomeCompleto' | 'dataNascimento'> = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  nomeCompleto: 'Maria Aparecida da Silva',
  dataNascimento: '1945-03-12',
};

const corpoSos: NonNullable<DispararSos['requestBody']>['content']['application/json'] = {
  latitude: -23.55052,
  longitude: -46.633308,
  nivelBateria: 85,
};

const statusSos: Care.components['schemas']['StatusAlarme'] = 'EM_ATENDIMENTO';

const papelAcesso: Care.components['schemas']['PapelAcesso'] = 'CUIDADOR';

// Convite com papel fora da lista não compila (o care responde 400 em runtime)
// @ts-expect-error 'ADMIN' não pertence a PapelAcesso
const papelInvalido: Care.components['schemas']['ConviteRedeRequest']['papelAcesso'] = 'ADMIN';

const convitePublico: Care.components['schemas']['ConvitePublico'] = {
  nomeConvidante: 'Carlos Eduardo Souza',
  primeiroNomeIdoso: 'Maria',
  papelAcesso: 'CUIDADOR',
  grauParentesco: 'Filho',
  expiraEm: '2026-11-20T18:30:00Z',
  status: 'PENDENTE',
};

// O convite público não expõe e-mail: o campo não existe no tipo
// @ts-expect-error 'emailDestinatario' não pertence a ConvitePublico
const emailNoConvitePublico: Care.components['schemas']['ConvitePublico']['emailDestinatario'] = 'a@b.com';

type ConsultarConvite = Care.paths['/api/v1/convites']['get'];
const respostaConvite: ConsultarConvite['responses'][200]['content']['application/json'] = convitePublico;

const perfil: Pick<Perfil, 'tipo' | 'nome'> = { tipo: 'IDOSO', nome: idoso.nomeCompleto };

const tokenPush: RegistrarTokenPush = {
  token: 'token-do-aparelho',
  identificadorAparelho: 'aparelho-1',
  plataforma: 'ANDROID',
};

const estadoAtual: Pick<Telemetry.components['schemas']['EstadoAtual'], 'idosoId' | 'passosHoje'> = {
  idosoId: idoso.id,
  passosHoje: null,
};

const pedidoExclusao: Report.components['schemas']['SolicitarExclusaoRequest'] = { confirmacao: 'EXCLUIR' };

export { convitePublico, corpoSos, emailNoConvitePublico, respostaConvite, estadoAtual, papelAcesso, papelInvalido, pedidoExclusao, perfil, statusSos, tokenPush };
